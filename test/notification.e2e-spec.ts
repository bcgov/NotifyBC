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

import { HttpException, HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import axios from 'axios';
import dns from 'dns';
import { merge } from 'lodash';
import mailer from 'nodemailer/lib/mailer';
import { BouncesService } from 'src/api/bounces/bounces.service';
import { NotificationsController } from 'src/api/notifications/notifications.controller';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { CommonService } from 'src/common/common.service';
import { AppConfigService } from 'src/config/app-config.service';
import { NotificationQueueConsumer } from 'src/queue-consumers/notification-queue-consumer';
import supertest from 'supertest';
import { getAppAndClient, runAsSuperAdmin, wait } from './test-helper';

let app: NestExpressApplication;
let client: supertest.SuperTest<supertest.Test>;
let notificationsService: NotificationsService;
let subscriptionsService: SubscriptionsService;
let bouncesService: BouncesService;

beforeAll(async () => {
  ({ app, client } = getAppAndClient());
  subscriptionsService = app.get<SubscriptionsService>(SubscriptionsService);
  bouncesService = app.get<BouncesService>(BouncesService);
  notificationsService = app.get<NotificationsService>(NotificationsService);
});

describe('GET /notifications', () => {
  beforeEach(async () => {
    await Promise.all([
      notificationsService.create({
        channel: 'inApp',
        isBroadcast: true,
        message: {
          title: 'test',
          body: 'this is a test',
        },
        serviceName: 'myService',
        validTill: '2000-01-01',
        state: 'new',
      }),
      notificationsService.create({
        channel: 'inApp',
        isBroadcast: true,
        message: {
          title: 'test',
          body: 'this is a test',
        },
        serviceName: 'myService',
        readBy: ['bar'],
        state: 'new',
      }),
      notificationsService.create({
        channel: 'inApp',
        isBroadcast: true,
        message: {
          title: 'test',
          body: 'this is a test',
        },
        serviceName: 'myService',
        deletedBy: ['bar'],
        state: 'new',
      }),
      notificationsService.create({
        channel: 'inApp',
        isBroadcast: true,
        message: {
          title: 'test',
          body: 'this is a test',
        },
        serviceName: 'myService',
        invalidBefore: '3017-05-30',
        state: 'new',
      }),
      notificationsService.create({
        channel: 'email',
        isBroadcast: true,
        message: {
          from: 'no_reply@invlid.local',
          subject: 'hello',
          htmlBody: 'hello',
        },
        serviceName: 'myService',
        state: 'sent',
      }),
    ]);
  });

  it('should be forbidden by anonymous user', async () => {
    const res = await client.get('/api/notifications');
    expect(res.status).toEqual(403);
  });

  it(
    'should be allowed to sm user for current, non-expired, non-deleted ' +
      'inApp notifications',
    async () => {
      const res = await client
        .get('/api/notifications')
        .set('Accept', 'application/json')
        .set('SM_USER', 'bar');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
    },
  );
});

describe('POST /notifications', () => {
  let promiseAllRes;
  beforeEach(async () => {
    promiseAllRes = await Promise.all([
      subscriptionsService.create({
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
      }),
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'myChunkedBroadcastService',
        channel: 'email',
        userChannelId: 'bar1@foo.com',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'myChunkedBroadcastService',
        channel: 'email',
        userChannelId: 'bar2@invalid',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'myFilterableBroadcastService',
        channel: 'email',
        userChannelId: 'bar2@invalid',
        state: 'confirmed',
        broadcastPushNotificationFilter: "contains(name,'f')",
      }),
      subscriptionsService.create({
        serviceName: 'myInvalidEmailService',
        channel: 'email',
        userChannelId: 'bar@invalid.local',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'smsThrottle',
        channel: 'sms',
        userChannelId: '12345',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'smsThrottle',
        channel: 'sms',
        userChannelId: '23456',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'emailThrottle',
        channel: 'email',
        userChannelId: 'foo@invalid.local',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'emailThrottle',
        channel: 'email',
        userChannelId: 'foo2@invalid.local',
        state: 'confirmed',
      }),
    ]);
  });

  it('should send broadcast email notifications with proper mail merge', async () => {
    await runAsSuperAdmin(async () => {
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
      expect(res.status).toEqual(200);
      const spiedSendEmail = CommonService.prototype
        .sendEmail as unknown as jest.SpyInstance;
      expect(spiedSendEmail).toBeCalled();
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.not.stringContaining('{confirmation_code}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.not.stringContaining('{service_name}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.not.stringContaining('{http_host}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.not.stringContaining('{rest_api_root}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.not.stringContaining('{subscription_id}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.not.stringContaining('{unsubscription_code}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('12345'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('myService'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('http://127.0.0.1'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('/api'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('54321'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('bar foo male'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          text: expect.stringContaining('{1} {2}, This is a broadcast test'),
        }),
      );

      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.not.stringContaining('{confirmation_code}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.not.stringContaining('{service_name}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.not.stringContaining('{http_host}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.not.stringContaining('{rest_api_root}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.not.stringContaining('{subscription_id}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.not.stringContaining('{unsubscription_code}'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('12345'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('myService'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('http://127.0.0.1'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('/api'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('54321'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('bar foo male'),
        }),
      );
      expect(spiedSendEmail).nthCalledWith(
        1,
        expect.objectContaining({
          html: expect.stringContaining('{1} {2}, This is a broadcast test'),
        }),
      );
      // test list-unsubscribe header
      expect(spiedSendEmail.mock.calls[0][0].list.unsubscribe[0][0]).toBe(
        `un-${promiseAllRes[0].id}-54321@invalid.local`,
      );

      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it('should send unicast email notification', async () => {
    await runAsSuperAdmin(async () => {
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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toBeCalled();
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it('should send unicast sms notification', async () => {
    await runAsSuperAdmin(async () => {
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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendSMS as unknown as jest.SpyInstance,
      ).toBeCalled();
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it('should send broadcast sms notification', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          message: {
            textBody:
              'This is a broadcast test {confirmation_code} {service_name} ' +
              '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
          },
          channel: 'sms',
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendSMS as unknown as jest.SpyInstance,
      ).toBeCalled();
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it('should handle sms broadcast push notification failures', async () => {
    await runAsSuperAdmin(async () => {
      (
        CommonService.prototype.sendSMS as unknown as jest.SpyInstance
      ).mockRestore();
      const mockedFetch = jest
        .spyOn(global, 'fetch')
        .mockRejectedValue(
          new HttpException(undefined, HttpStatus.TOO_MANY_REQUESTS),
        );
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'myService',
          message: {
            textBody:
              'This is a broadcast test {confirmation_code} {service_name} ' +
              '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
          },
          channel: 'sms',
          isBroadcast: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(mockedFetch).toBeCalledTimes(1);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
            state: 'sent',
          },
        },
        undefined,
      );
      expect(data?.[0]?.dispatch?.failed?.[0]?.error?.status).toEqual(429);
    });
  });

  it('should not send future-dated notification', async () => {
    await runAsSuperAdmin(async () => {
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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).not.toBeCalled();
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it(
    'should deny skipSubscriptionConfirmationCheck unicast notification ' +
      'missing userChannelId',
    async () => {
      await runAsSuperAdmin(async () => {
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
        expect(res.status).toEqual(403);
        const data = await notificationsService.findAll(
          {
            where: {
              serviceName: 'myService',
            },
          },
          undefined,
        );
        expect(data.length).toEqual(0);
      });
    },
  );

  it('should deny unicast notification missing both userChannelId and userId', async () => {
    await runAsSuperAdmin(async () => {
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
      expect(res.status).toEqual(403);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(0);
    });
  });

  it('should deny anonymous user', async () => {
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
    expect(res.status).toEqual(403);
  });

  it('should deny sm user', async () => {
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
    expect(res.status).toEqual(403);
  });

  it(
    'should perform async callback for broadcast push notification if ' +
      'asyncBroadcastPushNotification is set',
    async () => {
      await runAsSuperAdmin(async () => {
        (
          CommonService.prototype.sendEmail as unknown as jest.SpyInstance
        ).mockImplementation(async () => {
          await wait(1000);
        });
        const spiedFetch = jest
          .spyOn(global, 'fetch')
          .mockRejectedValue(undefined);
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
        expect(res.status).toEqual(200);
        let data = await notificationsService.findAll(
          {
            where: {
              serviceName: 'myService',
            },
          },
          undefined,
        );
        expect(data.length).toEqual(1);
        expect(['new', 'sending']).toContain(data[0].state);
        await wait(3000);
        data = await notificationsService.findAll(
          {
            where: {
              serviceName: 'myService',
            },
          },
          undefined,
        );
        expect(data.length).toEqual(1);
        expect(data[0].state).toEqual('sent');
        expect(spiedFetch).toBeCalledWith('http://foo.com', expect.any(Object));
      });
    },
  );

  it('should send chunked sync broadcast email notifications', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origNotificationConfig = appConfig.notification;
      const newNotificationConfig = merge({}, origNotificationConfig, {
        broadcastSubscriberChunkSize: 1,
        broadcastSubRequestBatchSize: 10,
      });
      appConfig.notification = newNotificationConfig;
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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toHaveBeenCalledTimes(2);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myChunkedBroadcastService',
            state: 'sent',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
      appConfig.notification = origNotificationConfig;
    });
  });

  it('should send chunked async broadcast email notifications', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origNotificationConfig = appConfig.notification;
      const newNotificationConfig = merge({}, origNotificationConfig, {
        broadcastSubscriberChunkSize: 1,
        broadcastSubRequestBatchSize: 10,
      });
      appConfig.notification = newNotificationConfig;

      const spiedFetch = jest
        .spyOn(global, 'fetch')
        .mockResolvedValue(new Response());
      jest.spyOn(axios, 'get').mockImplementation(async (...args: any[]) => {
        const getReq = client.get(args[0].substring(args[0].indexOf('/api')));
        const data: any = await getReq;
        return new Response(JSON.stringify(data.body));
      });

      (
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance
      ).mockImplementation(async (...args) => {
        const to = args[0].to;
        let error: any = null;
        if (to.indexOf('invalid') >= 0) {
          error = to;
        }
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
      expect(res.status).toEqual(200);
      let data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myChunkedBroadcastService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
      expect(['sending', 'new']).toContain(data[0].state);
      await wait(3000);
      data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myChunkedBroadcastService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
      expect(data[0].state).toEqual('sent');
      expect(spiedFetch).toBeCalledWith('http://foo.com', expect.any(Object));

      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toBeCalledTimes(2);
      expect(
        data[0].dispatch.candidates.indexOf(promiseAllRes[3].id),
      ).toBeGreaterThanOrEqual(0);
      expect(data[0].dispatch.failed.length).toEqual(1);
      expect(data[0].dispatch.failed[0]).toMatchObject({
        userChannelId: 'bar2@invalid',
        error: 'bar2@invalid',
      });
      appConfig.notification = origNotificationConfig;
    });
  });

  it('should use successful and failed dispatch list', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origNotificationConfig = appConfig.notification;
      const newNotificationConfig = merge({}, origNotificationConfig, {
        broadcastSubscriberChunkSize: 1,
        broadcastSubRequestBatchSize: 10,
      });
      appConfig.notification = newNotificationConfig;

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
            successful: [promiseAllRes[2].id],
            failed: [{ subscriptionId: promiseAllRes[3].id }],
          },
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).not.toBeCalled();
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myChunkedBroadcastService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
      expect(data[0].dispatch.candidates).toEqual(
        expect.arrayContaining([promiseAllRes[2].id, promiseAllRes[3].id]),
      );
      appConfig.notification = origNotificationConfig;
    });
  });

  // skip b/c bullMQ
  it.skip(
    'should retry sub-request when sending chunked broadcast ' +
      'notifications',
    async () => {
      await runAsSuperAdmin(async () => {
        const appConfig = app.get<AppConfigService>(AppConfigService).get();
        const origNotificationConfig = appConfig.notification;
        const newNotificationConfig = merge({}, origNotificationConfig, {
          broadcastSubscriberChunkSize: 1,
          broadcastSubRequestBatchSize: 10,
        });
        appConfig.notification = newNotificationConfig;

        const reqStub = jest
          .spyOn(axios, 'get')
          .mockRejectedValueOnce({ error: 'connection error' });
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
        expect(res.status).toEqual(200);
        expect(
          CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
        ).toBeCalledTimes(2);
        expect(reqStub).toBeCalledTimes(3);
        const data = await notificationsService.findAll(
          {
            where: {
              serviceName: 'myChunkedBroadcastService',
            },
          },
          undefined,
        );
        expect(data.length).toEqual(1);
        appConfig.notification = origNotificationConfig;
      });
    },
  );

  // skip b/c bullMQ
  it.skip('should handle chunk request abortion', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origNotificationConfig = appConfig.notification;
      const newNotificationConfig = merge({}, origNotificationConfig, {
        broadcastSubscriberChunkSize: 1,
        broadcastSubRequestBatchSize: 10,
      });
      appConfig.notification = newNotificationConfig;

      const sendPushNotificationStub = jest
        .spyOn(NotificationsController.prototype, 'sendPushNotification')
        .mockImplementation(async function (this: any, ...args) {
          await wait(3000);
          sendPushNotificationStub.mockRestore();
          await NotificationsController.prototype.sendPushNotification.apply(
            this,
            args,
          );
        });

      const notification = await notificationsService.create(
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
            candidates: [promiseAllRes[2].id, promiseAllRes[3].id],
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
      ((res as any).req as any).socket.destroy();
      res.abort();
      await wait(4000);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).not.toBeCalled();
      appConfig.notification = newNotificationConfig;
    });
  });

  it('should perform client-retry', async () => {
    await runAsSuperAdmin(async () => {
      (
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance
      ).mockRestore();
      jest
        .spyOn(mailer.prototype, 'sendMail')
        .mockImplementation(async function (this: any) {
          if (this.options.host !== '127.0.0.1') {
            // eslint-disable-next-line no-throw-literal
            throw { command: 'CONN', code: 'ETIMEDOUT' };
          }
          return 'ok';
        });
      jest.spyOn(dns, 'lookup').mockImplementation((...args) => {
        const cb: any = args[args.length - 1];
        cb(null, [{ address: '127.0.0.2' }, { address: '127.0.0.1' }]);
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
      expect(res.status).toEqual(200);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myService',
          },
        },
        undefined,
      );
      expect(data[0].dispatch?.failed).toBeUndefined();
      expect(data[0].dispatch?.successful).toContain(promiseAllRes[0].id);
    });
  });

  it('should send broadcast email notification with matching filter', async () => {
    await runAsSuperAdmin(async () => {
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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toBeCalledTimes(1);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myFilterableBroadcastService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it('should skip broadcast email notification with un-matching filter', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origNotificationConfig = appConfig.notification;
      const newNotificationConfig = merge({}, origNotificationConfig, {
        broadcastSubscriberChunkSize: 1,
        broadcastSubRequestBatchSize: 10,
        logSkippedBroadcastPushDispatches: true,
      });
      appConfig.notification = newNotificationConfig;

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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).not.toBeCalled();
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'myFilterableBroadcastService',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
      expect(data[0].state).toEqual('sent');
      expect(data[0].dispatch?.skipped).toContain(promiseAllRes[4].id);
      appConfig.notification = origNotificationConfig;
    });
  });

  it('should update bounce record after sending unicast email notification', async () => {
    await runAsSuperAdmin(async () => {
      const bounceRec = await bouncesService.create({
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
      const data = await bouncesService.findById(bounceRec.id);
      expect(data.latestNotificationStarted).toBeDefined();
      expect(data.latestNotificationEnded).toBeDefined();
      expect(data.latestNotificationEnded.valueOf()).toBeGreaterThanOrEqual(
        data.latestNotificationStarted.valueOf(),
      );
    });
  });

  it('should update bounce record after sending broadcast email notification', async () => {
    await runAsSuperAdmin(async () => {
      const bounceRec = await bouncesService.create({
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
      const data = await bouncesService.findById(bounceRec.id);
      expect(data.latestNotificationStarted).toBeDefined();
      expect(data.latestNotificationEnded).toBeDefined();
      expect(data.latestNotificationEnded.valueOf()).toBeGreaterThanOrEqual(
        data.latestNotificationStarted.valueOf(),
      );
    });
  });

  it(
    'should log successful dispatches after sending broadcast email ' +
      'notification if configured so',
    async () => {
      await runAsSuperAdmin(async () => {
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
        expect(res.status).toEqual(200);
        expect(res.body.dispatch.candidates).toContain(promiseAllRes[0].id);
        expect(res.body.dispatch.successful).toContain(promiseAllRes[0].id);
      });
    },
  );

  it(
    'should not log successful dispatches after sending broadcast email ' +
      'notification if configured so',
    async () => {
      await runAsSuperAdmin(async () => {
        const appConfig = app.get<AppConfigService>(AppConfigService).get();
        const origNotificationConfig = appConfig.notification;
        const origEmailConfig = appConfig.email;
        const newNotificationConfig = merge({}, origNotificationConfig, {
          guaranteedBroadcastPushDispatchProcessing: false,
        });
        const newEmailConfig = merge({}, origEmailConfig, {
          bounce: { enabled: false },
        });
        appConfig.notification = newNotificationConfig;
        appConfig.email = newEmailConfig;

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
        expect(res.status).toEqual(200);
        expect(res.body.dispatch?.successful).toBeUndefined();

        appConfig.notification = origNotificationConfig;
        appConfig.email = origEmailConfig;
      });
    },
  );

  it(
    'should set envelope address when bounce is enabled and ' +
      'inboundSmtpServer.domain is defined',
    async () => {
      await runAsSuperAdmin(async () => {
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
        expect(res.status).toEqual(200);
        expect(
          (CommonService.prototype.sendEmail as unknown as jest.SpyInstance)
            .mock.calls[0][0].envelope.from,
        ).toEqual(`bn-${promiseAllRes[0].id}-54321@invalid.local`);
      });
    },
  );

  it('should not set envelope address when bounce is disabled', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origEmailConfig = appConfig.email;
      const newEmailConfig = merge({}, origEmailConfig, {
        bounce: { enabled: false },
      });
      appConfig.email = newEmailConfig;

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
      expect(res.status).toEqual(200);
      expect(
        (CommonService.prototype.sendEmail as unknown as jest.SpyInstance).mock
          .calls[0][0].envelope,
      ).toBeUndefined();
      appConfig.email = origEmailConfig;
    });
  });

  it('should not set envelope address when inboundSmtpServer.domain is undefined', async () => {
    await runAsSuperAdmin(async () => {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origEmailConfig = appConfig.email;
      const newEmailConfig = merge({}, origEmailConfig, {
        inboundSmtpServer: {
          domain: null,
        },
      });
      appConfig.email = newEmailConfig;
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
      expect(res.status).toEqual(200);
      expect(
        (CommonService.prototype.sendEmail as unknown as jest.SpyInstance).mock
          .calls[0][0].envelope,
      ).toBeUndefined();
      appConfig.email = origEmailConfig;
    });
  });

  it(
    'should handle batch broadcast request error ' +
      'when guaranteedBroadcastPushDispatchProcessing is false',
    async () => {
      await runAsSuperAdmin(async () => {
        const appConfig = app.get<AppConfigService>(AppConfigService).get();
        const origNotificationConfig = appConfig.notification;
        const newNotificationConfig = merge({}, origNotificationConfig, {
          broadcastSubscriberChunkSize: 1,
          broadcastSubRequestBatchSize: 2,
          guaranteedBroadcastPushDispatchProcessing: false,
        });
        appConfig.notification = newNotificationConfig;
        jest
          .spyOn(
            NotificationQueueConsumer.prototype,
            'broadcastToSubscriberChunk',
          )
          .mockRejectedValue({});
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
        expect(res.status).toEqual(200);
        expect(res.body.dispatch.candidates).toContain(promiseAllRes[2].id);
        expect(res.body.dispatch.failed).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              subscriptionId: promiseAllRes[2].id,
            }),
          ]),
        );
        expect(res.body.dispatch.candidates).toContain(promiseAllRes[3].id);
        expect(res.body.dispatch.failed).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              subscriptionId: promiseAllRes[3].id,
            }),
          ]),
        );
        appConfig.notification = origNotificationConfig;
      });
    },
  );

  it('should handle async broadcastCustomFilterFunctions', async () => {
    await runAsSuperAdmin(async () => {
      await subscriptionsService.create({
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
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toBeCalledTimes(1);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'broadcastCustomFilterFunctionsTest',
          },
        },
        undefined,
      );
      expect(data[0].state).toEqual('sent');
    });
  });

  it(
    'should reject notification with invalid ' +
      'string broadcastPushNotificationSubscriptionFilter',
    async () => {
      await runAsSuperAdmin(async () => {
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
        expect(res.status).toEqual(400);
      });
    },
  );

  it('should handle broadcastPushNotificationSubscriptionFilter', async () => {
    await runAsSuperAdmin(async () => {
      await subscriptionsService.create({
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
          broadcastPushNotificationSubscriptionFilter:
            "contains_ci(name,'FOO')",
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(
        CommonService.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toBeCalledTimes(1);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'broadcastCustomFilterFunctionsTest',
          },
        },
        undefined,
      );
      expect(data[0].state).toEqual('sent');
    });
  });
});

describe('PATCH /notifications/{id}', () => {
  let notificationId;
  beforeEach(async function () {
    const res = await notificationsService.create({
      channel: 'inApp',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'myService',
      state: 'new',
    });
    notificationId = res.id;
  });

  it('should set readBy field of broadcast inApp notifications for sm users', async () => {
    const res = await client
      .patch(`/api/notifications/${notificationId}`)
      .send({
        serviceName: 'myService',
        state: 'read',
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).toEqual(204);
    const data = await notificationsService.findById(notificationId);
    expect(data.readBy).toContain('bar');
    expect(data.state).toEqual('new');
  });

  it('should set state field of broadcast inApp notifications for admin users', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .patch(`/api/notifications/${notificationId}`)
        .send({
          state: 'deleted',
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(204);
      const data = await notificationsService.findById(notificationId);
      expect(data.state).toEqual('deleted');
    });
  });

  it('should deny anonymous user', async () => {
    const res = await client
      .patch(`/api/notifications/${notificationId}`)
      .send({
        serviceName: 'myService',
        state: 'read',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });
});

describe('DELETE /notifications/{id}', () => {
  let notificationId;
  beforeEach(async function () {
    const res = await notificationsService.create({
      channel: 'inApp',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'myService',
      state: 'new',
    });
    notificationId = res.id;
  });

  it('should set deletedBy field of broadcast inApp notifications for sm users', async () => {
    const res = await client
      .delete(`/api/notifications/${notificationId}`)
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).toEqual(204);
    const data = await notificationsService.findById(notificationId);
    expect(data.deletedBy).toContain('bar');
    expect(data.state).toEqual('new');
  });

  it('should set state field of broadcast inApp notifications for admin users', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .delete(`/api/notifications/${notificationId}`)
        .set('Accept', 'application/json');
      expect(res.status).toEqual(204);
      const data = await notificationsService.findById(notificationId);
      expect(data.state).toEqual('deleted');
    });
  });

  it('should deny anonymous user', async () => {
    const res = await client
      .delete(`/api/notifications/${notificationId}`)
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });
});
