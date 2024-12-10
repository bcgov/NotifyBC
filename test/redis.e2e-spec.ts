import { NestExpressApplication } from '@nestjs/platform-express';
import { Queue } from 'bullmq';
import dns from 'dns';
import mailer from 'nodemailer/lib/mailer';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { CommonService } from 'src/common/common.service';
import supertest from 'supertest';
import { runAsSuperAdmin, setupApplication, wait } from './test-helper';

let app: NestExpressApplication;
let client: supertest.SuperTest<supertest.Test>;
let notificationsService: NotificationsService;
let subscriptionsService: SubscriptionsService;
let mockedFetch;

describe('', () => {
  beforeEach(async () => {
    ({ app, client } = await setupApplication({
      adminIps: ['127.0.0.1'],
      email: {
        throttle: {
          enabled: true,
        },
      },
      sms: {
        throttle: {
          enabled: true,
          max: 1,
          duration: 2000,
        },
      },
    }));
    subscriptionsService = app.get<SubscriptionsService>(SubscriptionsService);
    notificationsService = app.get<NotificationsService>(NotificationsService);
  }, Number(process.env.notifyBcJestTestTimeout) || 99999);

  afterEach(async () => {
    await app.close();
  });

  let promiseAllRes;
  beforeEach(async () => {
    (
      CommonService.prototype.sendSMS as unknown as jest.SpyInstance
    ).mockRestore();
    mockedFetch = jest.spyOn(global, 'fetch').mockResolvedValue(new Response());

    promiseAllRes = await Promise.all([
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
        serviceName: 'smsNoThrottle',
        channel: 'sms',
        userChannelId: '12345',
        state: 'confirmed',
      }),
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
      }),
    ]);
  });

  describe('POST /notifications', () => {
    it('should throttle sms broadcast push notification with redis', async () => {
      const res = await client
        .post('/api/notifications')
        .send({
          serviceName: 'smsThrottle',
          message: {
            textBody:
              'This is a broadcast test {confirmation_code} {service_name} ' +
              '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
          },
          channel: 'sms',
          isBroadcast: true,
          asyncBroadcastPushNotification: true,
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      await wait(1000);
      expect(mockedFetch).toHaveBeenCalledTimes(1);
      await wait(3000);
      expect(mockedFetch).toHaveBeenCalledTimes(2);
      const data = await notificationsService.findAll(
        {
          where: {
            serviceName: 'smsThrottle',
            $or: [{ state: 'sending' }, { state: 'sent' }],
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });

    it('should perform throttled client-retry', async () => {
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
        const originalDnsLookup = dns.lookup;
        jest.spyOn(dns, 'lookup').mockImplementation((...args) => {
          // bypass testcontainers calling dns.lookup
          if ((args as any[])[1]?.all !== true) {
            return originalDnsLookup(...args);
          }
          const cb: any = args[args.length - 1];
          cb(null, [{ address: '127.0.0.2' }, { address: '127.0.0.1' }]);
        });
        const spiedQueueAdd = jest.spyOn(Queue.prototype, 'add');
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
        expect(data[0].dispatch?.successful).toContain(promiseAllRes[3].id);
        expect(spiedQueueAdd).toHaveBeenCalledTimes(3);
        expect(spiedQueueAdd.mock.calls[2][2]).toMatchObject({
          priority: 5,
        });
      });
    });
  });

  describe('POST /subscriptions', () => {
    it(
      'should take higher priority than notification',
      async () => {
        let res = await client
          .post('/api/notifications')
          .send({
            serviceName: 'smsThrottle',
            message: {
              textBody:
                'This is a broadcast test {confirmation_code} {service_name} ' +
                '{http_host} {rest_api_root} {subscription_id} {unsubscription_code}',
            },
            channel: 'sms',
            isBroadcast: true,
            asyncBroadcastPushNotification: true,
          })
          .set('Accept', 'application/json');
        expect(res.status).toEqual(200);
        await wait(200);
        res = await client
          .post('/api/subscriptions')
          .send({
            serviceName: 'myService',
            channel: 'sms',
            userChannelId: '12345',
          })
          .set('Accept', 'application/json');
        expect(res.status).toEqual(200);
        expect(mockedFetch).toHaveBeenCalledTimes(2);
        const data = await subscriptionsService.findAll(
          {
            where: {
              serviceName: 'myService',
              userChannelId: '12345',
            },
          },
          undefined,
        );
        expect(data[0].unsubscriptionCode).toMatch(/\d{5}/);
        await wait(2500);
        expect(mockedFetch).toHaveBeenCalledTimes(3);
      },
      Number(process.env.notifyBcJestTestTimeout) || 10000,
    );
  });
});
