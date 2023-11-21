import { NestExpressApplication } from '@nestjs/platform-express';
import { BouncesService } from 'src/api/bounces/bounces.service';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import supertest from 'supertest';
import { getAppAndClient } from './test-helper';

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

describe('GET /notifications', function () {
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
