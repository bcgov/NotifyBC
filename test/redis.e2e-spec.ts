import { NestExpressApplication } from '@nestjs/platform-express';
import Bottleneck from 'bottleneck';
import dns from 'dns';
import Redis from 'ioredis';
import { merge } from 'lodash';
import mailer from 'nodemailer/lib/mailer';
import { RedisMemoryServer } from 'redis-memory-server';
import { BaseController } from 'src/api/common/base.controller';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { AppConfigService } from 'src/config/app-config.service';
import { CronTasksService } from 'src/observers/cron-tasks.service';
import supertest from 'supertest';
import { runAsSuperAdmin, setupApplication, wait } from './test-helper';

let app: NestExpressApplication;
let client: supertest.SuperTest<supertest.Test>;
let notificationsService: NotificationsService;
let subscriptionsService: SubscriptionsService;
let con, redisServer, mockedFetch;
beforeEach(async () => {
  redisServer = new RedisMemoryServer();
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  con = new Redis({
    host,
    port,
  });

  ({ app, client } = await setupApplication({
    adminIps: ['127.0.0.1'],
    email: {
      throttle: {
        enabled: true,
        datastore: 'ioredis',
        clientOptions: {
          host,
          port,
        },
      },
    },
    sms: {
      throttle: {
        enabled: true,
        minTime: 2000,
        datastore: 'ioredis',
        clientOptions: {
          host,
          port,
        },
      },
    },
  }));
  subscriptionsService = app.get<SubscriptionsService>(SubscriptionsService);
  notificationsService = app.get<NotificationsService>(NotificationsService);
}, Number(process.env.notifyBcJestTestTimeout) || 99999);

afterEach(async () => {
  await con.quit();
  await BaseController.smsLimiter?.disconnect();
  delete BaseController.smsLimiter;
  await BaseController.emailLimiter?.disconnect();
  delete BaseController.emailLimiter;
  await app.close();
  await redisServer.stop();
});

let promiseAllRes;
beforeEach(async () => {
  (
    BaseController.prototype.sendSMS as unknown as jest.SpyInstance
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
    expect(mockedFetch).toBeCalledTimes(1);
    let redisRes = await con.hgetall('b_notifyBCSms_job_clients');
    expect(Object.keys(redisRes)).toHaveLength(1);

    await wait(3000);
    redisRes = await con.hgetall('b_notifyBCSms_job_clients');
    expect(Object.keys(redisRes)).toHaveLength(0);

    expect(mockedFetch).toBeCalledTimes(2);
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
        BaseController.prototype.sendEmail as unknown as jest.SpyInstance
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
      const spiedBottleneckSchedule = jest.spyOn(
        Bottleneck.prototype,
        'schedule',
      );
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
      expect(spiedBottleneckSchedule).toBeCalledTimes(3);
      expect(spiedBottleneckSchedule.mock.calls[2][0]).toMatchObject({
        priority: 5,
        expiration: 120000,
      });
    });
  });
});

describe('CRON clearRedisDatastore', () => {
  it('should update config', async () => {
    const res = await client
      .post('/api/notifications')
      .send({
        serviceName: 'smsNoThrottle',
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
    let redisRes = await con.hgetall('b_notifyBCSms_settings');
    expect(redisRes.minTime).toEqual('2000');

    const appConfig = app.get<AppConfigService>(AppConfigService).get();
    const origSmsConfig = appConfig.sms;
    const newSmsConfig = merge({}, origSmsConfig, {
      throttle: { minTime: 1000 },
    });
    appConfig.sms = newSmsConfig;

    const cronTasksService = app.get<CronTasksService>(CronTasksService);
    await cronTasksService.clearRedisDatastore()();
    redisRes = await con.hgetall('b_notifyBCSms_settings');
    expect(redisRes.minTime).toEqual('1000');
    appConfig.sms = origSmsConfig;
  });
});

describe('POST /subscriptions', () => {
  it(
    'should take higher priority than notification',
    async () => {
      const subs = [];
      for (let i = 0; i < 2; i++) {
        subs.push(
          subscriptionsService.create({
            serviceName: 'smsThrottle',
            channel: 'sms',
            userChannelId: '12345',
            state: 'confirmed',
          }),
        );
      }
      await Promise.all(subs);
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
      await wait(1);
      res = await client
        .post('/api/subscriptions')
        .send({
          serviceName: 'myService',
          channel: 'sms',
          userChannelId: '12345',
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      const redisRes = await con.hgetall('b_notifyBCSms_client_num_queued');
      expect(Object.values(redisRes)[0]).toEqual('1');
      expect(mockedFetch).toBeCalledTimes(3);
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
      await wait(4000);
      expect(mockedFetch).toBeCalledTimes(5);
    },
    Number(process.env.notifyBcJestTestTimeout) || 10000,
  );
});
