import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { BouncesService } from 'src/api/bounces/bounces.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { AppConfigService } from 'src/config/app-config.service';
import supertest from 'supertest';
import { promisify } from 'util';
import { getAppAndClient, runAsSuperAdmin } from './test-helper';

const smtpSvrImport = require('../src/observers/smtp-server');
let client: supertest.SuperTest<supertest.Test>;
let subscriptionsService: SubscriptionsService;
let bouncesService: BouncesService;
let app: NestExpressApplication;
let smtpSvr: any;
let origMailParser: any;
let port: number;

beforeAll(async () => {
  ({ app, client } = getAppAndClient());
  subscriptionsService = app.get<SubscriptionsService>(SubscriptionsService);
  bouncesService = app.get<BouncesService>(BouncesService);
  const appConfig = app.get<AppConfigService>(AppConfigService).get();
  smtpSvr = await smtpSvrImport.smtpServer(appConfig);
  origMailParser = smtpSvrImport.mailParser;
  port = smtpSvr.server.address().port;
});

afterAll(function () {
  smtpSvr.close();
});

describe('list-unsubscribe by email', function () {
  let connection: any;
  let subId;
  beforeEach(async () => {
    jest.spyOn(smtpSvr, 'onRcptTo');
    jest.spyOn(smtpSvr, 'onData');
    connection = new SMTPConnection({
      port: port,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    await Promise.all([
      (async () => {
        const res = await subscriptionsService.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
        subId = res.id;
      })(),
    ]);
  });

  it('should accept valid email', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(async (...args: any[]) => {
      const url = args[0].substring(args[0].indexOf('/api'));
      const getReq = client.get(url);
      for (const [p, v] of Object.entries(args[1].headers as object)) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getReq.set(p, v);
      }
      await getReq;
      const res = await subscriptionsService.findById(subId);
      expect(res.state).toEqual('deleted');
      return new Response();
    });
    expect(port).toBeGreaterThan(0);
    await promisify(connection.connect).bind(connection)();
    const info = await promisify(connection.send).bind(connection)(
      {
        from: 'bar@foo.com',
        to: `un-${subId}-12345@invalid.local`,
      },
      'unsubscribe',
    );
    expect(info.accepted.length).toEqual(1);
    expect(smtpSvr.onRcptTo).toHaveBeenCalled();
    expect(smtpSvr.onData).toHaveBeenCalled();
    expect(fetch as unknown as jest.SpyInstance).toBeCalledWith(
      `http://localhost:3000/api/subscriptions/${subId}/unsubscribe?unsubscriptionCode=12345&userChannelId=bar%40foo.com`,
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_anonymous: 'true',
        },
      },
    );
    connection.quit();
  });

  it('should reject email of invalid local-part pattern', async () => {
    await promisify(connection.connect).bind(connection)();
    try {
      await promisify(connection.send).bind(connection)(
        {
          from: 'bar@foo.com',
          to: 'undo-1-12345@invalid.local',
        },
        'unsubscribe',
      );
    } catch (err) {
      expect(err.rejected.length).toEqual(1);
    }
    expect(smtpSvr.onRcptTo).toBeCalled;
    expect(smtpSvr.onData).not.toBeCalled();
    connection.quit();
  });

  it('should reject email of invalid domain', async () => {
    await promisify(connection.connect).bind(connection)();
    try {
      await promisify(connection.send).bind(connection)(
        {
          from: 'bar@foo.com',
          to: 'un-1-12345@valid.local',
        },
        'unsubscribe',
      );
    } catch (err) {
      expect(err.rejected.length).toEqual(1);
    }
    expect(smtpSvr.onRcptTo).toBeCalled();
    expect(smtpSvr.onData).not.toBeCalled();
    connection.quit();
  });
});

describe('bounce', function () {
  let connection: any;
  let subId;
  beforeEach(async function () {
    jest.spyOn(smtpSvr, 'onRcptTo');
    jest.spyOn(smtpSvr, 'onData');
    connection = new SMTPConnection({
      port: port,
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });
    await Promise.all([
      (async () => {
        const res = await subscriptionsService.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
        subId = res.id;
      })(),
    ]);
  });

  it('should create bounce record', async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data = await getReq;
            return new Response(JSON.stringify(data));
          }
          if (args.length > 1 && args[1].method === 'POST') {
            const req = client.post(args[0].substring(args[0].indexOf('/api')));
            if (args[1]) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data = await req;
            if (data) {
              expect(data.body.hardBounceCount).toEqual(1);
            }
            return new Response(JSON.stringify(data.body));
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `Received: from localhost (localhost)\r\n\tby foo.invalid.local (8.14.4/8.14.4) id w7TItYs4100793;\r\n\tWed, 29 Aug 2018 11:55:34 -0700\r\nDate: Wed, 29 Aug 2018 11:55:34 -0700\r\nFrom: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\nThe original message was received at Wed, 29 Aug 2018 11:55:34 -0700\r\nfrom invalid.local [0.0.0.0]\r\n\r\n   ----- The following addresses had permanent fatal errors -----\r\n<bar@foo.com>\r\n    (reason: 550-5.1.1 The email account that you tried to reach does not exist. Please try)\r\n\r\n   ----- Transcript of session follows -----\r\n... while talking to gmail-smtp-in.l.google.com.:\r\n>>> DATA\r\n<<< 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\n<<< 550-5.1.1 double-checking the recipient's email address for typos or\r\n<<< 550-5.1.1 unnecessary spaces. Learn more at\r\n<<< 550 5.1.1  https://support.google.com/mail/?p=NoSuchUser c17-v6si4448431pge.273 - gsmtp\r\n550 5.1.1 <bar@foo.com>... User unknown\r\n<<< 503 5.5.1 RCPT first. c17-v6si4448431pge.273 - gsmtp\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/rfc822\r\n\r\nReturn-Path: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nReceived: from [127.0.0.1] (invalid.local [0.0.0.0])\r\n\tby foo.invalid.local (8.14.4/8.14.4) with ESMTP id w7TIqOs6099075\r\n\t(version=TLSv1/SSLv3 cipher=DHE-RSA-AES128-GCM-SHA256 bits=128 verify=NO)\r\n\tfor <bar@foo.com>; Wed, 29 Aug 2018 11:55:34 -0700\r\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=mail.www2.invalid.local; q=dns/txt; s=dev;\r\n bh=wrkCugmpWjuk1K/MNn64VeMFmvd+ef1KHXTHHL+GO84=;\r\n h=from:subject:date:message-id:to:mime-version:content-type:list-id:list-unsubscribe;\r\n b=O5i568MBJIL38+umlZxJGAG+vffxe89cbUNbCrjt/QDHRiiLBcLpZBMPTqvQnEJX6gwLXnBkj\r\n m/69oke2/HmSTp9T/I0MmwenuqpEc7lhCeMfCvS19PTaQKb5tb/EK+TQt516yre3ElkCXrr/lyg\r\n PPrZozr8rupPNhK5NZNpABJXQtCQEfdF8Fw7OnHWalvch7Q5jfta84EQ6zOGAC6HfLFe0O/VkVf\r\n sbEwGGyC9OOEyGBpppEMBGx8qXuZxSpxiaWGdGVhW6jf/WLghPwThvDgRYSq9jTNfenMXR2LAPf\r\n FbjSR6GqrRowS4h2GVVyPTYk1SGT0uGJucNa/vlDWgnQ==\r\nContent-Type: multipart/alternative;\r\n boundary="--_NmP-6ea6170c81eda5cc-Part_1"\r\nFrom: donotreply@invalid.local\r\nTo: bar@foo.com\r\nSubject: test\r\nMessage-ID: <1d6819a2-698c-eea7-f3e8-fa4977801d49@invalid.local>\r\nList-ID: <https://invalid.local/test>\r\nList-Unsubscribe: <mailto:un-5b50cb6e953d170b24983019-42074@invalid.local>, <https://invalid.local/notifybc/api/subscriptions/5b50cb6e953d170b24983019/unsubscribe?unsubscriptionCode=42074>\r\nDate: Wed, 29 Aug 2018 18:55:34 +0000\r\nMIME-Version: 1.0\r\nX-Scanned-By: MIMEDefang 2.70 on 0.0.0.0\r\n\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test https://invalid.local/notifybc/api/subscriptions/5b50c=\r\nb6e953d170b24983019/unsubscribe?unsubscriptionCode=3D42074\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test.\r\n----_NmP-6ea6170c81eda5cc-Part_1--\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
    });
  });

  it('should increment bounce record', async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data: any = await getReq;
            return new Response(JSON.stringify(data.body));
          }
          if (args.length > 1 && args[1].method === 'PATCH') {
            const req = client.patch(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]?.body) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data: any = await req;
            expect(data.status).toEqual(204);
            return new Response(JSON.stringify(data.body));
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      const res = await bouncesService.create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      });
      const bounceId = res.id;
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `Received: from localhost (localhost)\r\n\tby foo.invalid.local (8.14.4/8.14.4) id w7TItYs4100793;\r\n\tWed, 29 Aug 2018 11:55:34 -0700\r\nDate: Wed, 29 Aug 2018 11:55:34 -0700\r\nFrom: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
      const rec = await bouncesService.findById(bounceId);
      expect(rec.hardBounceCount).toEqual(2);
    });
  });

  it("should not increment bounce record if subject doesn't match", async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data: any = await getReq;
            return new Response(JSON.stringify(data.body));
          }
          if (args.length > 1 && args[1].method === 'PATCH') {
            const req = client.patch(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data: any = await req;
            expect(data.status).toEqual(204);
            return new Response();
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      const res = await bouncesService.create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      });
      const bounceId = res.id;
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: invalid\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
      const rec = await bouncesService.findById(bounceId);
      expect(rec.hardBounceCount).toEqual(1);
    });
  });

  it("should not increment bounce record if status code doesn't match", async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data: any = await getReq;
            return new Response(JSON.stringify(data.body));
          }
          if (args.length > 1 && args[1].method === 'PATCH') {
            const req = client.patch(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data: any = await req;
            expect(data.status).toEqual(204);
            return new Response();
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      const res = await bouncesService.create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      });
      const bounceId = res.id;
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 4.1.1\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
      const rec = await bouncesService.findById(bounceId);
      expect(rec.hardBounceCount).toEqual(1);
    });
  });

  it("should not increment bounce record if email doesn't match", async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data: any = await getReq;
            return new Response(JSON.stringify(data.body));
          }
          if (args.length > 1 && args[1].method === 'PATCH') {
            const req = client.patch(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data: any = await req;
            expect(data.status).toEqual(204);
            return new Response();
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      const res = await bouncesService.create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      });
      const bounceId = res.id;
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@invalid.local\r\nAction: failed\r\nStatus: 5.1.1\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
      const rec = await bouncesService.findById(bounceId);
      expect(rec.hardBounceCount).toEqual(1);
    });
  });

  it('should check header x-failed-recipients', async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data: any = await getReq;
            return new Response(JSON.stringify(data.body));
          }
          if (args.length > 1 && args[1].method === 'PATCH') {
            const req = client.patch(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data: any = await req;
            expect(data.status).toEqual(204);
            return new Response();
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      const res = await bouncesService.create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 1,
        state: 'active',
      });
      const bounceId = res.id;
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `From: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nX-Failed-Recipients: bar@foo.com\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@invalid.local\r\nAction: failed\r\nStatus: 5.1.1\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
      const rec = await bouncesService.findById(bounceId);
      expect(rec.hardBounceCount).toEqual(2);
    });
  });

  it('should unsubscribe and delete bounce record when hardBounceCount exceeds threshold', async () => {
    await runAsSuperAdmin(async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(async function (...args: any[]) {
          if (
            args.length === 1 ||
            (args.length > 1 && args[1].method === undefined)
          ) {
            const getReq = client.get(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args?.[1]?.headers) {
              for (const [p, v] of Object.entries(args[1].headers as object)) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                getReq.set(p, v);
              }
            }
            const data: any = await getReq;
            if (data) {
              if (args[0].indexOf('/unsubscribe?unsubscriptionCode') >= 0) {
                const res = await subscriptionsService.findById(subId);
                expect(res.state).toEqual('deleted');
              }
            }
            return new Response(JSON.stringify(data.body));
          }
          if (args.length > 1 && args[1].method === 'PATCH') {
            const req = client.patch(
              args[0].substring(args[0].indexOf('/api')),
            );
            if (args[1]) {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              req.send(JSON.parse(args[1].body));
            }
            const data: any = await req;
            expect(data.status).toEqual(204);
            return new Response();
          }
          throw new Error();
        });
      expect(port).toBeGreaterThan(0);
      const res = await bouncesService.create({
        channel: 'email',
        userChannelId: 'bar@foo.com',
        hardBounceCount: 2,
        state: 'active',
      });
      const bounceId = res.id;
      await promisify(connection.connect).bind(connection)();
      const info = await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `Received: from localhost (localhost)\r\n\tby foo.invalid.local (8.14.4/8.14.4) id w7TItYs4100793;\r\n\tWed, 29 Aug 2018 11:55:34 -0700\r\nDate: Wed, 29 Aug 2018 11:55:34 -0700\r\nFrom: Mail Delivery Subsystem <postmaster@gems.invalid.local>\r\nMessage-Id: <201808291855.w7TItYs4100793@foo.invalid.local>\r\nTo: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\nThe original message was received at Wed, 29 Aug 2018 11:55:34 -0700\r\nfrom invalid.local [0.0.0.0]\r\n\r\n   ----- The following addresses had permanent fatal errors -----\r\n<bar@foo.com>\r\n    (reason: 550-5.1.1 The email account that you tried to reach does not exist. Please try)\r\n\r\n   ----- Transcript of session follows -----\r\n... while talking to gmail-smtp-in.l.google.com.:\r\n>>> DATA\r\n<<< 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\n<<< 550-5.1.1 double-checking the recipient's email address for typos or\r\n<<< 550-5.1.1 unnecessary spaces. Learn more at\r\n<<< 550 5.1.1  https://support.google.com/mail/?p=NoSuchUser c17-v6si4448431pge.273 - gsmtp\r\n550 5.1.1 <bar@foo.com>... User unknown\r\n<<< 503 5.5.1 RCPT first. c17-v6si4448431pge.273 - gsmtp\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@foo.com\r\nAction: failed\r\nStatus: 5.1.1\r\nRemote-MTA: DNS; gmail-smtp-in.l.google.com\r\nDiagnostic-Code: SMTP; 550-5.1.1 The email account that you tried to reach does not exist. Please try\r\nLast-Attempt-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/rfc822\r\n\r\nReturn-Path: <bn-5b50cb6e953d170b24983019-42074@invalid.local>\r\nReceived: from [127.0.0.1] (invalid.local [0.0.0.0])\r\n\tby foo.invalid.local (8.14.4/8.14.4) with ESMTP id w7TIqOs6099075\r\n\t(version=TLSv1/SSLv3 cipher=DHE-RSA-AES128-GCM-SHA256 bits=128 verify=NO)\r\n\tfor <bar@foo.com>; Wed, 29 Aug 2018 11:55:34 -0700\r\nDKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=mail.www2.invalid.local; q=dns/txt; s=dev;\r\n bh=wrkCugmpWjuk1K/MNn64VeMFmvd+ef1KHXTHHL+GO84=;\r\n h=from:subject:date:message-id:to:mime-version:content-type:list-id:list-unsubscribe;\r\n b=O5i568MBJIL38+umlZxJGAG+vffxe89cbUNbCrjt/QDHRiiLBcLpZBMPTqvQnEJX6gwLXnBkj\r\n m/69oke2/HmSTp9T/I0MmwenuqpEc7lhCeMfCvS19PTaQKb5tb/EK+TQt516yre3ElkCXrr/lyg\r\n PPrZozr8rupPNhK5NZNpABJXQtCQEfdF8Fw7OnHWalvch7Q5jfta84EQ6zOGAC6HfLFe0O/VkVf\r\n sbEwGGyC9OOEyGBpppEMBGx8qXuZxSpxiaWGdGVhW6jf/WLghPwThvDgRYSq9jTNfenMXR2LAPf\r\n FbjSR6GqrRowS4h2GVVyPTYk1SGT0uGJucNa/vlDWgnQ==\r\nContent-Type: multipart/alternative;\r\n boundary="--_NmP-6ea6170c81eda5cc-Part_1"\r\nFrom: donotreply@invalid.local\r\nTo: bar@foo.com\r\nSubject: test\r\nMessage-ID: <1d6819a2-698c-eea7-f3e8-fa4977801d49@invalid.local>\r\nList-ID: <https://invalid.local/test>\r\nList-Unsubscribe: <mailto:un-5b50cb6e953d170b24983019-42074@invalid.local>, <https://invalid.local/notifybc/api/subscriptions/5b50cb6e953d170b24983019/unsubscribe?unsubscriptionCode=42074>\r\nDate: Wed, 29 Aug 2018 18:55:34 +0000\r\nMIME-Version: 1.0\r\nX-Scanned-By: MIMEDefang 2.70 on 0.0.0.0\r\n\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test https://invalid.local/notifybc/api/subscriptions/5b50c=\r\nb6e953d170b24983019/unsubscribe?unsubscriptionCode=3D42074\r\n----_NmP-6ea6170c81eda5cc-Part_1\r\nContent-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nThis is a test.\r\n----_NmP-6ea6170c81eda5cc-Part_1--\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local--\r\n\r\n`,
      );
      expect(info.accepted.length).toEqual(1);
      expect(smtpSvr.onRcptTo).toBeCalled();
      expect(smtpSvr.onData).toBeCalled();
      connection.quit();
      const rec = await bouncesService.findById(bounceId);
      expect(rec.state).toEqual('deleted');
    });
  });

  it('should handle parse error', async () => {
    jest
      .spyOn(origMailParser, 'simpleParser')
      .mockRejectedValue(new Error('error!'));
    jest.spyOn(Logger.prototype, 'error').mockReturnValueOnce();
    await promisify(connection.connect).bind(connection)();
    try {
      await promisify(connection.send).bind(connection)(
        {
          from: 'postmaster@invalid.local',
          to: `bn-${subId}-12345@invalid.local`,
        },
        `Content-Type: multipart/report; report-type=delivery-status;\r\n\tboundary="w7TItYs4100793.1535568934/foo.invalid.local"\r\nSubject: Returned mail: see transcript for details\r\nAuto-Submitted: auto-generated (failure)\r\n\r\nThis is a MIME-encapsulated message\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; foo.invalid.local\r\nReceived-From-MTA: DNS; invalid.local\r\nArrival-Date: Wed, 29 Aug 2018 11:55:34 -0700\r\n\r\nFinal-Recipient: RFC822; bar@invalid.local\r\nAction: failed\r\nStatus: 5.1.1\r\n\r\n--w7TItYs4100793.1535568934/foo.invalid.local\r\n\r\n`,
      );
    } catch (err) {
      expect(err.responseCode).toEqual(451);
    }
    expect(smtpSvr.onRcptTo).toBeCalled();
    expect(smtpSvr.onData).toBeCalled();
    connection.quit();
  });
});
