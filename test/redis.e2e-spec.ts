import { NestExpressApplication } from '@nestjs/platform-express';
import Redis from 'ioredis';
import { RedisMemoryServer } from 'redis-memory-server';
import { BaseController } from 'src/api/common/base.controller';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import supertest from 'supertest';
import { setupApplication, wait } from './test-helper';

let app: NestExpressApplication;
let client: supertest.SuperTest<supertest.Test>;
let notificationsService: NotificationsService;
let subscriptionsService: SubscriptionsService;
let con, redisServer;
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
  await BaseController.smsLimiter.disconnect();
  await app.close();
  await redisServer.stop();
});

describe('POST /notifications', () => {
  beforeEach(async () => {
    return Promise.all([
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
    ]);
  });

  it('should throttle sms broadcast push notification with redis', async () => {
    (
      BaseController.prototype.sendSMS as unknown as jest.SpyInstance
    ).mockRestore();
    const mockedFetch = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response());
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
});
