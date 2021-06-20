// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {CoreBindings} from '@loopback/core';
import {Client, expect} from '@loopback/testlab';
import _ from 'lodash';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {BaseController} from '../../controllers/base.controller';
import {
  NotificationController,
  request,
} from '../../controllers/notification.controller';
import {
  BounceRepository,
  NotificationRepository,
  SubscriptionRepository,
} from '../../repositories';
import {BaseCrudRepository} from '../../repositories/baseCrudRepository';
import {setupApplication, wait} from './test-helper';

let app: NotifyBcApplication;
let client: Client;
let notificationRepository: NotificationRepository;
let subscriptionRepository: SubscriptionRepository;
let bounceRepository: BounceRepository;

before('setupApplication', async function () {
  ({app, client} = await setupApplication());
  notificationRepository = await app.get('repositories.NotificationRepository');
  subscriptionRepository = await app.get('repositories.SubscriptionRepository');
  bounceRepository = await app.get('repositories.BounceRepository');
});

describe('GET /notifications', function () {
  beforeEach(async function () {
    await Promise.all([
      (async () => {
        return notificationRepository.create({
          channel: 'inApp',
          isBroadcast: true,
          message: {
            title: 'test',
            body: 'this is a test',
          },
          serviceName: 'myService',
          validTill: '2000-01-01',
          state: 'new',
        });
      })(),
      (async () => {
        return notificationRepository.create({
          channel: 'inApp',
          isBroadcast: true,
          message: {
            title: 'test',
            body: 'this is a test',
          },
          serviceName: 'myService',
          readBy: ['bar'],
          state: 'new',
        });
      })(),
      (async () => {
        return notificationRepository.create({
          channel: 'inApp',
          isBroadcast: true,
          message: {
            title: 'test',
            body: 'this is a test',
          },
          serviceName: 'myService',
          deletedBy: ['bar'],
          state: 'new',
        });
      })(),
      (async () => {
        return notificationRepository.create({
          channel: 'inApp',
          isBroadcast: true,
          message: {
            title: 'test',
            body: 'this is a test',
          },
          serviceName: 'myService',
          invalidBefore: '3017-05-30',
          state: 'new',
        });
      })(),
      (async () => {
        return notificationRepository.create({
          channel: 'email',
          isBroadcast: true,
          message: {
            from: 'no_reply@invlid.local',
            subject: 'hello',
            htmlBody: 'hello',
          },
          serviceName: 'myService',
          state: 'sent',
        });
      })(),
    ]);
  });

  it('should be forbidden by anonymous user', async function () {
    const res = await client.get('/api/notifications');
    expect(res.status).equal(401);
  });

  it(
    'should be allowed to sm user for current, non-expired, non-deleted ' +
      'inApp notifications',
    async function () {
      const res = await client
        .get('/api/notifications')
        .set('Accept', 'application/json')
        .set('SM_USER', 'bar');
      expect(res.status).equal(200);
      expect(res.body.length).equal(1);
    },
  );
});

describe('POST /notifications', function () {
  beforeEach(async function () {
    await Promise.all([
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userId: 'bar',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          confirmationRequest: {
            confirmationCodeRegex: '\\d{5}',
            sendRequest: true,
            from: 'no_reply@invlid.local',
            subject: 'Subscription confirmation',
            textBody: 'enter {confirmation_code} in this email',
            confirmationCode: '12345',
          },
          unsubscriptionCode: '54321',
          data: {
            gender: 'male',
          },
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'sms',
          userChannelId: '12345',
          state: 'confirmed',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myChunkedBroadcastService',
          channel: 'email',
          userChannelId: 'bar1@foo.com',
          state: 'confirmed',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myChunkedBroadcastService',
          channel: 'email',
          userChannelId: 'bar2@invalid',
          state: 'confirmed',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myFilterableBroadcastService',
          channel: 'email',
          userChannelId: 'bar2@invalid',
          state: 'confirmed',
          broadcastPushNotificationFilter: "contains(name,'f')",
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myInvalidEmailService',
          channel: 'email',
          userChannelId: 'bar@invalid.local',
          state: 'confirmed',
        });
      })(),
    ]);
  });

  it('should send broadcast email notifications with proper mail merge', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);

    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody:
            '\\{1\\} \\{2\\}, This is a broadcast test {confirmation_code} ' +
            '{service_name} {http_host} {rest_api_root} {subscription_id} ' +
            '{unsubscription_code} {2} {notification::1} {subscription::gender}',
          htmlBody:
            '\\{1\\} \\{2\\}, This is a broadcast test {confirmation_code} ' +
            '{service_name} {http_host} {rest_api_root} {subscription_id} ' +
            '{unsubscription_code} {2} {notification::1} {subscription::gender}',
        },
        data: {
          '1': 'foo',
          '2': 'bar',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.called(BaseController.prototype.sendEmail as sinon.SinonStub);

    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).not.containEql('{confirmation_code}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).not.containEql('{service_name}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).not.containEql('{http_host}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).not.containEql('{rest_api_root}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).not.containEql('{subscription_id}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).not.containEql('{unsubscription_code}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('12345');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('myService');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('http://127.0.0.1');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('/api');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('54321');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('bar foo male');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.text,
    ).containEql('{1} {2}, This is a broadcast test');

    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).not.containEql('{confirmation_code}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).not.containEql('{service_name}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).not.containEql('{http_host}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).not.containEql('{rest_api_root}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).not.containEql('{subscription_id}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).not.containEql('{unsubscription_code}');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('12345');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('myService');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('http://127.0.0.1');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('/api');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('54321');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('bar foo male');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.html,
    ).containEql('{1} {2}, This is a broadcast test');
    // test list-unsubscribe header
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub)
        .getCall(0)
        .firstArg.list.unsubscribe[0].indexOf('un-1-54321@invalid.local'),
    ).equal(0);

    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data.length).equal(1);
  });

  it('should send unicast email notification', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody:
            'This is a unicast test {confirmation_code} {service_name} ' +
            '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
          htmlBody:
            'This is a unicast test {confirmation_code} {service_name} ' +
            '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
        },
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@foo.COM',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).called,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data.length).equal(1);
  });

  it('should send unicast sms notification', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          textBody:
            'This is a unicast test {confirmation_code} {service_name} ' +
            '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
        },
        channel: 'sms',
        skipSubscriptionConfirmationCheck: true,
        userChannelId: '12345',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect((BaseController.prototype.sendSMS as sinon.SinonStub).called).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data.length).equal(1);
  });

  it('should send broadcast sms notification', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          textBody:
            'This is a unicast test {confirmation_code} {service_name} ' +
            '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
        },
        channel: 'sms',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect((BaseController.prototype.sendSMS as sinon.SinonStub).called).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data.length).equal(1);
  });

  it('should not send future-dated notification', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody:
            'This is a unicast test {confirmation_code} {service_name} ' +
            '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
        },
        channel: 'email',
        userId: 'bar',
        invalidBefore: '3017-06-01T00:00:00Z',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).notCalled,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data.length).equal(1);
  });

  it(
    'should deny skipSubscriptionConfirmationCheck unicast notification ' +
      'missing userChannelId',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          message: {
            from: 'no_reply@bar.com',
            subject: 'test',
            textBody:
              'This is a unicast test {confirmation_code} {service_name} ' +
              '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
          },
          channel: 'email',
          userId: 'bar',
          skipSubscriptionConfirmationCheck: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(403);
      const data = await notificationRepository.find({
        where: {
          serviceName: 'myService',
        },
      });
      expect(data.length).equal(0);
    },
  );

  it('should deny unicast notification missing both userChannelId and userId', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody:
            'This is a unicast test {confirmation_code} {service_name} ' +
            '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
        },
        channel: 'email',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(403);
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data.length).equal(0);
  });

  it('should deny anonymous user', async function () {
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'This is a broadcast test',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(401);
  });

  it('should deny sm user', async function () {
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'This is a broadcast test',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).equal(403);
  });

  it(
    'should perform async callback for broadcast push notification if ' +
      'asyncBroadcastPushNotification is set',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      (BaseController.prototype.sendEmail as sinon.SinonStub).restore();
      sinon
        .stub(BaseController.prototype, 'sendEmail')
        .callsFake(async (...args) => {
          console.log('faking delayed sendEmail');
          await wait(1000);
        });
      sinon.spy(request, 'post');

      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          message: {
            from: 'no_reply@bar.com',
            subject: 'test',
            textBody:
              'This is a unicast test {confirmation_code} {service_name} ' +
              '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
          },
          channel: 'email',
          isBroadcast: true,
          asyncBroadcastPushNotification: 'http://foo.com',
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(200);
      let data = await notificationRepository.find({
        where: {
          serviceName: 'myService',
        },
      });
      expect(data.length).equal(1);
      expect(data[0].state).equal('sending');
      await wait(3000);
      data = await notificationRepository.find({
        where: {
          serviceName: 'myService',
        },
      });
      expect(data.length).equal(1);
      expect(data[0].state).equal('sent');
      expect(
        (request.post as sinon.SinonStub).calledWith(
          'http://foo.com',
          sinon.match.object,
          sinon.match.object,
        ),
      ).true();
    },
  );

  it('should send chunked sync broadcast email notifications', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        notification: {
          broadcastSubscriberChunkSize: 1,
          broadcastSubRequestBatchSize: 10,
        },
      }),
    );
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myChunkedBroadcastService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).calledTwice,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myChunkedBroadcastService',
      },
    });
    expect(data.length).equal(1);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it('should send chunked async broadcast email notifications', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        notification: {
          broadcastSubscriberChunkSize: 1,
          broadcastSubRequestBatchSize: 10,
        },
      }),
    );
    sinon.spy(request, 'post');
    (BaseController.prototype.sendEmail as sinon.SinonStub).restore();
    sinon
      .stub(BaseController.prototype, 'sendEmail')
      .callsFake(async (...args) => {
        const to = args[0].to;
        let error: any = null;
        if (to.indexOf('invalid') >= 0) {
          error = to;
        }
        console.log('faking sendEmail with error for invalid recipient');
        if (error) {
          throw error;
        }
      });

    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myChunkedBroadcastService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        isBroadcast: true,
        asyncBroadcastPushNotification: 'http://foo.com',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    let data = await notificationRepository.find({
      where: {
        serviceName: 'myChunkedBroadcastService',
      },
    });
    expect(data.length).equal(1);
    expect(data[0].state).equal('sending');
    await wait(3000);
    data = await notificationRepository.find({
      where: {
        serviceName: 'myChunkedBroadcastService',
      },
    });
    expect(data.length).equal(1);
    expect(data[0].state).equal('sent');
    expect(
      (request.post as sinon.SinonStub).calledWith(
        'http://foo.com',
        sinon.match.object,
        sinon.match.object,
      ),
    ).true();
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).calledTwice,
    ).true();
    expect(data[0].dispatch.candidates.indexOf('4')).greaterThanOrEqual(0);
    expect(data[0].dispatch.failed.length).equal(1);
    expect(data[0].dispatch.failed[0]).containEql({
      userChannelId: 'bar2@invalid',
      error: 'bar2@invalid',
    });
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it('should use successful and failed dispatch list', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        notification: {
          broadcastSubscriberChunkSize: 1,
          broadcastSubRequestBatchSize: 10,
        },
      }),
    );
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myChunkedBroadcastService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        isBroadcast: true,
        dispatch: {
          successful: ['3'],
          failed: [{subscriptionId: '4'}],
        },
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).notCalled,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myChunkedBroadcastService',
      },
    });
    expect(data.length).equal(1);
    expect(data[0].dispatch.candidates).containDeep(['3', '4']);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it(
    'should retry sub-request when sending chunked broadcast ' +
      'notifications',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(
        _.merge({}, origConfig, {
          notification: {
            broadcastSubscriberChunkSize: 1,
            broadcastSubRequestBatchSize: 10,
          },
        }),
      );
      const reqStub = sinon.stub(request, 'get');
      reqStub.callThrough();
      reqStub.onFirstCall().throws({error: 'connection error'});
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myChunkedBroadcastService',
          message: {
            from: 'no_reply@bar.com',
            subject: 'test',
            textBody: 'test',
          },
          channel: 'email',
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(200);
      expect(
        (BaseController.prototype.sendEmail as sinon.SinonStub).calledTwice,
      ).true();
      sinon.assert.calledThrice(reqStub);
      const data = await notificationRepository.find({
        where: {
          serviceName: 'myChunkedBroadcastService',
        },
      });
      expect(data.length).equal(1);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
    },
  );

  it('should handle chunk request abortion', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        notification: {
          broadcastSubscriberChunkSize: 1,
          broadcastSubRequestBatchSize: 10,
        },
      }),
    );
    const sendPushNotificationStub = sinon
      .stub(NotificationController.prototype, 'sendPushNotification')
      .callsFake(async function (this: any, ...args) {
        await wait(3000);
        await sendPushNotificationStub.wrappedMethod.apply(this, args);
      });

    const notification = await notificationRepository.create(
      {
        serviceName: 'myChunkedBroadcastService',
        state: 'sending',
        message: {
          from: 'no_reply@invalid.local',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        isBroadcast: true,
        dispatch: {
          candidates: ['3', '4'],
        },
      },
      undefined,
    );
    const res = client
      .get(
        `/api/notifications/${notification.id}/broadcastToChunkSubscribers?start=0`,
      )
      .end();
    await wait(10);
    res.abort();
    await wait(4000);
    sinon.assert.notCalled(
      BaseController.prototype.sendEmail as sinon.SinonStub,
    );
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it('should perform client-retry', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    (BaseController.prototype.sendEmail as sinon.SinonStub).restore();
    const mailer = require('nodemailer/lib/mailer');
    sinon
      .stub(mailer.prototype, 'sendMail')
      .callsFake(async function (this: any) {
        if (this.options.host !== '127.0.0.1') {
          // eslint-disable-next-line no-throw-literal
          throw {command: 'CONN', code: 'ETIMEDOUT'};
        }
        return 'ok';
      });
    const dns = require('dns');
    sinon.stub(dns, 'lookup').callsFake((...args) => {
      const cb = args[args.length - 1];
      cb(null, [{address: '127.0.0.2'}, {address: '127.0.0.1'}]);
    });
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
      },
    });
    expect(data[0].dispatch?.failed).undefined();
  });

  it('should send broadcast email notification with matching filter', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myFilterableBroadcastService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        data: {
          name: 'foo',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).calledOnce,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myFilterableBroadcastService',
      },
    });
    expect(data.length).equal(1);
  });

  it('should skip broadcast email notification with un-matching filter', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myFilterableBroadcastService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        data: {
          name: 'Foo',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).notCalled,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myFilterableBroadcastService',
      },
    });
    expect(data.length).equal(1);
    expect(data[0].state).equal('sent');
  });

  it('should update bounce record after sending unicast email notification', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    await bounceRepository.create({
      channel: 'email',
      userChannelId: 'bar@foo.com',
      hardBounceCount: 1,
      state: 'active',
    });
    await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@foo.COM',
      })
      .set('Accept', 'application/json');
    const data = await bounceRepository.findById('1');
    expect(data.latestNotificationStarted !== undefined).true();
    expect(data.latestNotificationEnded !== undefined).true();
    expect(
      Date.parse(data.latestNotificationEnded as string),
    ).greaterThanOrEqual(Date.parse(data.latestNotificationStarted as string));
  });

  it('should update bounce record after sending broadcast email notification', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    await bounceRepository.create({
      channel: 'email',
      userChannelId: 'bar@foo.com',
      hardBounceCount: 1,
      state: 'active',
    });
    await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        channel: 'email',
        message: {
          from: 'no_reply@invalid.local',
          subject: 'test',
          textBody: 'test',
        },
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    const data = await bounceRepository.findById('1');
    expect(data.latestNotificationStarted).not.undefined();
    expect(data.latestNotificationEnded).not.undefined();
    expect(
      Date.parse(data.latestNotificationEnded as string),
    ).greaterThanOrEqual(Date.parse(data.latestNotificationStarted as string));
  });

  it(
    'should log successful dispatches after sending broadcast email ' +
      'notification if configured so',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          channel: 'email',
          message: {
            from: 'no_reply@invalid.local',
            subject: 'test',
            textBody: 'test',
          },
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(200);
      expect(res.body.dispatch.candidates.indexOf('1')).greaterThanOrEqual(0);
      expect(res.body.dispatch.successful[0]).equal('1');
    },
  );

  it(
    'should not log successful dispatches after sending broadcast email ' +
      'notification if configured so',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(
        _.merge({}, origConfig, {
          notification: {
            guaranteedBroadcastPushDispatchProcessing: false,
            handleBounce: false,
          },
        }),
      );
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          channel: 'email',
          message: {
            from: 'no_reply@invalid.local',
            subject: 'test',
            textBody: 'test',
          },
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(200);
      expect(res.body.dispatch?.successful).undefined();
      app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
    },
  );

  it(
    'should set envelope address when bounce is enabled and ' +
      'inboundSmtpServer.domain is defined',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          channel: 'email',
          message: {
            from: 'no_reply@invalid.local',
            subject: 'test',
            textBody: 'test',
          },
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(200);
      expect(
        (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
          .firstArg.envelope.from,
      ).equal('bn-1-54321@invalid.local');
    },
  );

  it('should not set envelope address when bounce is disabled', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        notification: {
          handleBounce: false,
        },
      }),
    );
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        channel: 'email',
        message: {
          from: 'no_reply@invalid.local',
          subject: 'test',
          textBody: 'test',
        },
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.envelope,
    ).undefined();
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it('should not set envelope address when inboundSmtpServer.domain is undefined', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      Object.assign({}, origConfig, {
        inboundSmtpServer: {
          domain: undefined,
        },
      }),
    );
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'myService',
        channel: 'email',
        message: {
          from: 'no_reply@invalid.local',
          subject: 'test',
          textBody: 'test',
        },
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.envelope,
    ).undefined();
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it(
    'should handle batch broadcast request error ' +
      'when guaranteedBroadcastPushDispatchProcessing is false',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(
        _.merge({}, origConfig, {
          notification: {
            broadcastSubscriberChunkSize: 1,
            broadcastSubRequestBatchSize: 2,
            guaranteedBroadcastPushDispatchProcessing: false,
          },
        }),
      );
      sinon.stub(request, 'get').callsFake(async function () {
        throw new Error('error');
      });

      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myChunkedBroadcastService',
          message: {
            from: 'no_reply@bar.com',
            subject: 'test',
            textBody: 'test',
          },
          channel: 'email',
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(200);
      expect(res.body.dispatch.candidates.indexOf('3')).greaterThanOrEqual(0);
      expect(res.body.dispatch.failed).to.containEql({subscriptionId: '3'});
      expect(res.body.dispatch.candidates.indexOf('4')).greaterThanOrEqual(0);
      expect(res.body.dispatch.failed).to.containEql({subscriptionId: '4'});
      app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
    },
  );

  it('should handle async broadcastCustomFilterFunctions', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    await subscriptionRepository.create({
      serviceName: 'broadcastCustomFilterFunctionsTest',
      channel: 'email',
      userChannelId: 'bar2@invalid',
      state: 'confirmed',
      broadcastPushNotificationFilter: "contains_ci(name,'FOO')",
    });

    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'broadcastCustomFilterFunctionsTest',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        data: {
          name: 'foo',
        },
        channel: 'email',
        isBroadcast: true,
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).calledOnce,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'broadcastCustomFilterFunctionsTest',
      },
    });
    expect(data[0].state).equal('sent');
  });

  it(
    'should reject notification with invalid ' +
      'string broadcastPushNotificationSubscriptionFilter',
    async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'broadcastCustomFilterFunctionsTest',
          channel: 'email',
          isBroadcast: true,
          message: {
            from: 'no_reply@bar.com',
            subject: 'test',
            textBody: 'test',
          },
          broadcastPushNotificationSubscriptionFilter: "a === 'b'",
        })
        .set('Accept', 'application/json');
      expect(res.status).equal(400);
    },
  );

  it('should handle broadcastPushNotificationSubscriptionFilter', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    await subscriptionRepository.create({
      serviceName: 'broadcastCustomFilterFunctionsTest',
      channel: 'email',
      userChannelId: 'bar2@invalid',
      state: 'confirmed',
      data: {
        name: 'foo',
      },
    });

    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'broadcastCustomFilterFunctionsTest',
        message: {
          from: 'no_reply@bar.com',
          subject: 'test',
          textBody: 'test',
        },
        channel: 'email',
        isBroadcast: true,
        broadcastPushNotificationSubscriptionFilter: "contains_ci(name,'FOO')",
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).calledOnce,
    ).true();
    const data = await notificationRepository.find({
      where: {
        serviceName: 'broadcastCustomFilterFunctionsTest',
      },
    });
    expect(data[0].state).equal('sent');
  });
});

describe('PATCH /notifications/{id}', function () {
  beforeEach(async function () {
    await notificationRepository.create({
      channel: 'inApp',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'myService',
      state: 'new',
    });
  });
  it('should set readBy field of broadcast inApp notifications for sm users', async function () {
    const res = await client
      .patch('/api/notifications/1')
      .send({
        serviceName: 'myService',
        state: 'read',
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).equal(204);
    const data = await notificationRepository.findById('1');
    expect(data.readBy).containEql('bar');
    expect(data.state).equal('new');
  });
  it('should set state field of broadcast inApp notifications for admin users', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .patch('/api/notifications/1')
      .send({
        state: 'deleted',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(204);
    const data = await notificationRepository.findById('1');
    expect(data.state).equal('deleted');
  });
  it('should deny anonymous user', async function () {
    const res = await client
      .patch('/api/notifications/1')
      .send({
        serviceName: 'myService',
        state: 'read',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(401);
  });
});

describe('DELETE /notifications/{id}', function () {
  beforeEach(async function () {
    await notificationRepository.create({
      channel: 'inApp',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'myService',
      state: 'new',
    });
  });
  it('should set deletedBy field of broadcast inApp notifications for sm users', async function () {
    const res = await client
      .delete('/api/notifications/1')
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).equal(204);
    const data = await notificationRepository.findById('1');
    expect(data.deletedBy).containEql('bar');
    expect(data.state).equal('new');
  });
  it('should set state field of broadcast inApp notifications for admin users', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client
      .delete('/api/notifications/1')
      .set('Accept', 'application/json');
    expect(res.status).equal(204);
    const data = await notificationRepository.findById('1');
    expect(data.state).equal('deleted');
  });
  it('should deny anonymous user', async function () {
    const res = await client
      .delete('/api/notifications/1')
      .set('Accept', 'application/json');
    expect(res.status).equal(401);
  });
});
