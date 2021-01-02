import {CoreBindings} from '@loopback/core';
import {Client, expect} from '@loopback/testlab';
import {fail} from 'should';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {BounceRepository, SubscriptionRepository} from '../../repositories';
import {setupApplication} from './test-helper';

let app: NotifyBcApplication;
const SMTPConnection = require('smtp-connection');
let smtpSvrImport: any;
let smtpSvr: any;
let origRequest: any;
let origMailParser: any;
let port: number;
let client: Client;
let subscriptionRepository: SubscriptionRepository;
let bounceRepository: BounceRepository;
before('setupApplication', async function () {
  ({app, client} = await setupApplication());
  subscriptionRepository = await app.get('repositories.SubscriptionRepository');
  bounceRepository = await app.get('repositories.BounceRepository');
  smtpSvrImport = require('../../observers/smtp-server');
  const data = await smtpSvrImport.app(
    await app.getConfig(CoreBindings.APPLICATION_INSTANCE),
  );
  smtpSvr = data;
  origRequest = smtpSvrImport.request;
  origMailParser = smtpSvrImport.mailParser;
  port = smtpSvr.server.address().port;
});

after(function () {
  smtpSvr.close();
});

describe('list-unsubscribe by email', function () {
  let connection: any;

  beforeEach(async function () {
    sinon.stub(smtpSvr, 'onRcptTo').callThrough();
    sinon.stub(smtpSvr, 'onData').callThrough();
    connection = new SMTPConnection({
      port: port,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await Promise.all([
      (async () => {
        await subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
      })(),
    ]);
  });

  it('should accept valid email', function (done) {
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
      for (const p in args[1].headers) {
        // eslint-disable-next-line no-prototype-builtins
        if (args[1].headers.hasOwnProperty(p)) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          getReq.set(p, args[1].headers[p]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getReq.end((err, res) => {
        expect(err).null();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        subscriptionRepository.findById('1').then(function (data) {
          expect(data.state).equal('deleted');
          done();
        });
      });
    });
    expect(port).greaterThan(0);
    connection.connect(() => {
      connection.send(
        {
          from: 'bar@foo.com',
          to: 'un-1-12345@invalid.local',
        },
        'unsubscribe',
        (err: any, info: any) => {
          expect(err).null();
          expect(info.accepted.length).equal(1);
          sinon.assert.called(smtpSvr.onRcptTo);
          sinon.assert.called(smtpSvr.onData);
          sinon.assert.calledWith(
            origRequest.get,
            'http://localhost:3000/api/subscriptions/1/unsubscribe?unsubscriptionCode=12345&userChannelId=bar%40foo.com',
            {
              headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                is_anonymous: true,
              },
            },
          );
          connection.quit();
        },
      );
    });
  });

  it('should reject email of invalid local-part pattern', function (done) {
    connection.connect(() => {
      connection.send(
        {
          from: 'bar@foo.com',
          to: 'undo-1-12345@invalid.local',
        },
        'unsubscribe',
        (err: any, info: any) => {
          expect(err.rejected.length).equal(1);
          sinon.assert.called(smtpSvr.onRcptTo);
          sinon.assert.notCalled(smtpSvr.onData);
          connection.quit();
          done();
        },
      );
    });
  });

  it('should reject email of invalid domain', function (done) {
    connection.connect(() => {
      connection.send(
        {
          from: 'bar@foo.com',
          to: 'un-1-12345@valid.local',
        },
        'unsubscribe',
        (err: any, info: any) => {
          expect(err.rejected.length).equal(1);
          sinon.assert.called(smtpSvr.onRcptTo);
          sinon.assert.notCalled(smtpSvr.onData);
          connection.quit();
          done();
        },
      );
    });
  });
});

describe('bounce', function () {
  let connection: any;
  beforeEach(async function () {
    sinon.stub(smtpSvr, 'onRcptTo').callThrough();
    sinon.stub(smtpSvr, 'onData').callThrough();
    connection = new SMTPConnection({
      port: port,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });
    await Promise.all([
      (async () => {
        await subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
      })(),
    ]);
  });

  it('should create bounce record', function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'post').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.post(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            expect(data.body.hardBounceCount).equal(1);
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    connection.connect(() => {
      connection.send(
        {
          from: 'postmaster@invalid.local',
          to: 'bn-1-12345@invalid.local',
        },
        `Received: from localhost (localhost)\r\n\tby foo.invalid.local (8.14.4/8.14.4) id w7TItYs4100793;\r\n\tWed, 29 Aug 2018 11:55:34 -0700\r\nDate: Wed, 29 Aug 2018 11:55:34 -0700\r\nFrom: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\nThe original message was received at Wed, 29 Aug 2018 11:55:34 -0700\r\nfrom invalid.local [0.0.0.0]\r\n\r\n   ----- The following addresses had permanent fatal errors -----\r\n<bar@foo.com>\r\n    (reason: 550-5.1.1 The email account that you tried to reach does not exist. Please try)\r\n\r\n   ----- Transcript of session follows -----\r\n... while talking to gmail-smtp-in.l.google.com.:\r\n>>> DATA\r\n<<< 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\n<<< 550-5.1.1 double-checking the recipient's email address for typos or\r\n<<< 550-5.1.1 unnecessary spaces. Learn more at\r\n<<< 550 5.1.1  https://support.google.com/mail/?p=NoSuchUser c17-v6si4448431pge.273 - gsmtp\r\n550 5.1.1 <bar@foo.com>... User unknown\r\n<<< 503 5.5.1 RCPT first. c17-v6si4448431pge.273 - gsmtp\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/rfc822\r\n\r\nReturn-Path: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nReceived: from [127.0.0.1] (invalid.local [0.0.0.0])\r\n\tby foo.invalid.local (8.14.4/8.14.4) with ESMTP id w7TIqOs6099075\r\n\t(version=TLSv1/SSLv3 cipher=DHE-RSA-AES128-GCM-SHA256 bits=128 verify=NO)\r\n\tfor <bar@foo.com>; Wed, 29 Aug 2018 11:55:34 -0700\r\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=mail.www2.invalid.local; q=dns/txt; s=dev;\r\n bh=wrkCugmpWjuk1K/MNn64VeMFmvd+ef1KHXTHHL+GO84=;\r\n h=from:subject:date:message-id:to:mime-version:content-type:list-id:list-unsubscribe;\r\n b=O5i568MBJIL38+umlZxJGAG+vffxe89cbUNbCrjt/QDHRiiLBcLpZBMPTqvQnEJX6gwLXnBkj\r\n m/69oke2/HmSTp9T/I0MmwenuqpEc7lhCeMfCvS19PTaQKb5tb/EK+TQt516yre3ElkCXrr/lyg\r\n PPrZozr8rupPNhK5NZNpABJXQtCQEfdF8Fw7OnHWalvch7Q5jfta84EQ6zOGAC6HfLFe0O/VkVf\r\n sbEwGGyC9OOEyGBpppEMBGx8qXuZxSpxiaWGdGVhW6jf/WLghPwThvDgRYSq9jTNfenMXR2LAPf\r\n FbjSR6GqrRowS4h2GVVyPTYk1SGT0uGJucNa/vlDWgnQ==\r\nContent-Type: multipart/alternative;\r\n boundary="--_NmP-6ea6170c81eda5cc-Part_1"\r\nFrom: donotreply@invalid.local\r\nTo: bar@foo.com\r\nSubject: test\r\nMessage-ID: <1d6819a2-698c-eea7-f3e8-fa4977801d49@invalid.local>\r\nList-ID: <https://invalid.local/test>\r\nList-Unsubscribe: <mailto:un-5b50cb6e953d170b24983019-42074@invalid.local>, <https://invalid.local/notifybc/api/subscriptions/5b50cb6e953d170b24983019/unsubscribe?unsubscriptionCode=42074>\r\nDate: Wed, 29 Aug 2018 18:55:34 +0000\r\nMIME-Version: 1.0\r\nX-Scanned-By: MIMEDefang 2.70 on 0.0.0.0\r\n\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test https://invalid.local/notifybc/api/subscriptions/5b50c=\r\nb6e953d170b24983019/unsubscribe?unsubscriptionCode=3D42074\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test.\r\n----_NmP-6ea6170c81eda5cc-Part_1--\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
        (err: any, info: any) => {
          expect(err).null();
          expect(info.accepted.length).equal(1);
          sinon.assert.called(smtpSvr.onRcptTo);
          sinon.assert.called(smtpSvr.onData);
          connection.quit();
          done();
        },
      );
    });
  });

  it('should increment bounce record', function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'patch').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.patch(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            expect(data.body.hardBounceCount).equal(2);
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    bounceRepository
      .create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      })
      .then(() => {
        connection.connect(() => {
          connection.send(
            {
              from: 'postmaster@invalid.local',
              to: 'bn-1-12345@invalid.local',
            },
            `Received: from localhost (localhost)\r\n\tby foo.invalid.local (8.14.4/8.14.4) id w7TItYs4100793;\r\n\tWed, 29 Aug 2018 11:55:34 -0700\r\nDate: Wed, 29 Aug 2018 11:55:34 -0700\r\nFrom: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
            (err: any, info: any) => {
              expect(err).null();
              expect(info.accepted.length).equal(1);
              sinon.assert.called(smtpSvr.onRcptTo);
              sinon.assert.called(smtpSvr.onData);
              connection.quit();
              done();
            },
          );
        });
      })
      .catch(err => {
        fail(err, null, '', '');
        done();
      });
  });

  it("should not increment bounce record if subject doesn't match", function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'patch').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.patch(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            expect(data.body.hardBounceCount).equal(1);
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    bounceRepository
      .create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      })
      .then(() => {
        connection.connect(() => {
          connection.send(
            {
              from: 'postmaster@invalid.local',
              to: 'bn-1-12345@invalid.local',
            },
            `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: invalid\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
            (err: any, info: any) => {
              expect(err).null();
              expect(info.accepted.length).equal(1);
              sinon.assert.called(smtpSvr.onRcptTo);
              sinon.assert.called(smtpSvr.onData);
              connection.quit();
              done();
            },
          );
        });
      })
      .catch(err => {
        fail(err, null, '', '');
        done();
      });
  });

  it("should not increment bounce record if status code doesn't match", function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'patch').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.patch(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            expect(data.body.hardBounceCount).equal(1);
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    bounceRepository
      .create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      })
      .then(() => {
        connection.connect(() => {
          connection.send(
            {
              from: 'postmaster@invalid.local',
              to: 'bn-1-12345@invalid.local',
            },
            `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 4.1.1\r\n\r\n`,
            (err: any, info: any) => {
              expect(err).null();
              expect(info.accepted.length).equal(1);
              sinon.assert.called(smtpSvr.onRcptTo);
              sinon.assert.called(smtpSvr.onData);
              connection.quit();
              done();
            },
          );
        });
      })
      .catch(err => {
        fail(err, null, '', '');
        done();
      });
  });

  it("should not increment bounce record if email doesn't match", function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'patch').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.patch(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            expect(data.body.hardBounceCount).equal(1);
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    bounceRepository
      .create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      })
      .then(() => {
        connection.connect(() => {
          connection.send(
            {
              from: 'postmaster@invalid.local',
              to: 'bn-1-12345@invalid.local',
            },
            `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@invalid.local\r\nAction: failed\r\nStatus: 5.1.1\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\n`,
            (err: any, info: any) => {
              expect(err).null();
              expect(info.accepted.length).equal(1);
              sinon.assert.called(smtpSvr.onRcptTo);
              sinon.assert.called(smtpSvr.onData);
              connection.quit();
              done();
            },
          );
        });
      })
      .catch(err => {
        fail(err, null, '', '');
        done();
      });
  });

  it('should check header x-failed-recipients', function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'patch').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.patch(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            expect(data.body.hardBounceCount).equal(2);
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    bounceRepository
      .create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      })
      .then(() => {
        connection.connect(() => {
          connection.send(
            {
              from: 'postmaster@invalid.local',
              to: 'bn-1-12345@invalid.local',
            },
            `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nX-Failed-Recipients: bar@foo.com\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@invalid.local\r\nAction: failed\r\nStatus: 5.1.1\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\n`,
            (err: any, info: any) => {
              expect(err).null();
              expect(info.accepted.length).equal(1);
              sinon.assert.called(smtpSvr.onRcptTo);
              sinon.assert.called(smtpSvr.onData);
              connection.quit();
              done();
            },
          );
        });
      })
      .catch(err => {
        fail(err, null, '', '');
        done();
      });
  });

  it('should unsubscribe and delete bounce record when hardBounceCount exceeds threshold', function (done) {
    sinon.stub(subscriptionRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(bounceRepository, 'isAdminReq').callsFake(async () => {
      return true;
    });
    sinon.stub(origRequest, 'get').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          for (const p in args[1].headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (args[1].headers.hasOwnProperty(p)) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              getReq.set(p, args[1].headers[p]);
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            if (args[0].indexOf('/unsubscribe?unsubscriptionCode') >= 0) {
              subscriptionRepository
                .findById('1')
                .then(res => {
                  expect(res.state).equal('deleted');
                })
                .catch(reject);
            }
            resolve(data);
          }
        });
      });
    });
    sinon.stub(origRequest, 'patch').callsFake(function (...args) {
      return new Promise((resolve, reject) => {
        const req = client.patch(args[0].substring(args[0].indexOf('/api')));
        if (args[1]) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          req.send(args[1]);
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        req.end((err, data: any) => {
          if (err) {
            reject(err);
          }
          if (data) {
            data.data = data.body;
            if (args[1].state) {
              bounceRepository
                .findById('1')
                .then(res => {
                  expect(res.state).equal('deleted');
                })
                .catch(reject);
            }
            resolve(data);
          }
        });
      });
    });
    expect(port).greaterThan(0);
    bounceRepository
      .create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 2,
        state: 'active',
      })
      .then(() => {
        connection.connect(() => {
          connection.send(
            {
              from: 'postmaster@invalid.local',
              to: 'bn-1-12345@invalid.local',
            },
            `Received: from localhost (localhost)\r\n\tby foo.invalid.local (8.14.4/8.14.4) id w7TItYs4100793;\r\n\tWed, 29 Aug 2018 11:55:34 -0700\r\nDate: Wed, 29 Aug 2018 11:55:34 -0700\r\nFrom: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\nThe original message was received at Wed, 29 Aug 2018 11:55:34 -0700\r\nfrom invalid.local [0.0.0.0]\r\n\r\n   ----- The following addresses had permanent fatal errors -----\r\n<bar@foo.com>\r\n    (reason: 550-5.1.1 The email account that you tried to reach does not exist. Please try)\r\n\r\n   ----- Transcript of session follows -----\r\n... while talking to gmail-smtp-in.l.google.com.:\r\n>>> DATA\r\n<<< 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\n<<< 550-5.1.1 double-checking the recipient's email address for typos or\r\n<<< 550-5.1.1 unnecessary spaces. Learn more at\r\n<<< 550 5.1.1  https://support.google.com/mail/?p=NoSuchUser c17-v6si4448431pge.273 - gsmtp\r\n550 5.1.1 <bar@foo.com>... User unknown\r\n<<< 503 5.5.1 RCPT first. c17-v6si4448431pge.273 - gsmtp\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/rfc822\r\n\r\nReturn-Path: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nReceived: from [127.0.0.1] (invalid.local [0.0.0.0])\r\n\tby foo.invalid.local (8.14.4/8.14.4) with ESMTP id w7TIqOs6099075\r\n\t(version=TLSv1/SSLv3 cipher=DHE-RSA-AES128-GCM-SHA256 bits=128 verify=NO)\r\n\tfor <bar@foo.com>; Wed, 29 Aug 2018 11:55:34 -0700\r\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=mail.www2.invalid.local; q=dns/txt; s=dev;\r\n bh=wrkCugmpWjuk1K/MNn64VeMFmvd+ef1KHXTHHL+GO84=;\r\n h=from:subject:date:message-id:to:mime-version:content-type:list-id:list-unsubscribe;\r\n b=O5i568MBJIL38+umlZxJGAG+vffxe89cbUNbCrjt/QDHRiiLBcLpZBMPTqvQnEJX6gwLXnBkj\r\n m/69oke2/HmSTp9T/I0MmwenuqpEc7lhCeMfCvS19PTaQKb5tb/EK+TQt516yre3ElkCXrr/lyg\r\n PPrZozr8rupPNhK5NZNpABJXQtCQEfdF8Fw7OnHWalvch7Q5jfta84EQ6zOGAC6HfLFe0O/VkVf\r\n sbEwGGyC9OOEyGBpppEMBGx8qXuZxSpxiaWGdGVhW6jf/WLghPwThvDgRYSq9jTNfenMXR2LAPf\r\n FbjSR6GqrRowS4h2GVVyPTYk1SGT0uGJucNa/vlDWgnQ==\r\nContent-Type: multipart/alternative;\r\n boundary="--_NmP-6ea6170c81eda5cc-Part_1"\r\nFrom: donotreply@invalid.local\r\nTo: bar@foo.com\r\nSubject: test\r\nMessage-ID: <1d6819a2-698c-eea7-f3e8-fa4977801d49@invalid.local>\r\nList-ID: <https://invalid.local/test>\r\nList-Unsubscribe: <mailto:un-5b50cb6e953d170b24983019-42074@invalid.local>, <https://invalid.local/notifybc/api/subscriptions/5b50cb6e953d170b24983019/unsubscribe?unsubscriptionCode=42074>\r\nDate: Wed, 29 Aug 2018 18:55:34 +0000\r\nMIME-Version: 1.0\r\nX-Scanned-By: MIMEDefang 2.70 on 0.0.0.0\r\n\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test https://invalid.local/notifybc/api/subscriptions/5b50c=\r\nb6e953d170b24983019/unsubscribe?unsubscriptionCode=3D42074\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test.\r\n----_NmP-6ea6170c81eda5cc-Part_1--\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
            (err: any, info: any) => {
              expect(err).null();
              expect(info.accepted.length).equal(1);
              sinon.assert.called(smtpSvr.onRcptTo);
              sinon.assert.called(smtpSvr.onData);
              connection.quit();
              done();
            },
          );
        });
      })
      .catch(err => {
        fail(err, null, '', '');
        done();
      });
  });

  it('should handle parse error', function (done) {
    sinon.stub(origMailParser, 'simpleParser').callsFake(function () {
      return new Promise((resolve, reject) => {
        process.nextTick(reject, 'error!');
      });
    });
    connection.connect(() => {
      connection.send(
        {
          from: 'postmaster@invalid.local',
          to: 'bn-1-12345@invalid.local',
        },
        `Content-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@invalid.local\r\nAction: failed\r\nStatus: 5.1.1\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\n`,
        (err: any, info: any) => {
          expect(err.responseCode).equal(451);
          sinon.assert.called(smtpSvr.onRcptTo);
          sinon.assert.called(smtpSvr.onData);
          connection.quit();
          done();
        },
      );
    });
  });
});
