import { NestExpressApplication } from '@nestjs/platform-express';
import { fail } from 'assert';
import mongoose from 'mongoose';
import { AccessTokenService } from 'src/api/administrators/access-token.service';
import { BouncesService } from 'src/api/bounces/bounces.service';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { CronTasksService } from 'src/observers/cron-tasks.service';
import { RssService } from 'src/rss/rss.service';
import supertest from 'supertest';
import { getAppAndClient } from './test-helper';

let client: supertest.SuperTest<supertest.Test>;
let app: NestExpressApplication;
let rssService: RssService;
let notificationsService: NotificationsService;
let subscriptionsService: SubscriptionsService;
let configurationsService: ConfigurationsService;
let bouncesService: BouncesService;
let accessTokenService: AccessTokenService;
let cronTasksService: CronTasksService;
beforeEach(() => {
  ({ app, client } = getAppAndClient());
  rssService = app.get<RssService>(RssService);
  notificationsService = app.get<NotificationsService>(NotificationsService);
  subscriptionsService = app.get<SubscriptionsService>(SubscriptionsService);
  configurationsService = app.get<ConfigurationsService>(ConfigurationsService);
  bouncesService = app.get<BouncesService>(BouncesService);
  accessTokenService = app.get<AccessTokenService>(AccessTokenService);
  cronTasksService = app.get<CronTasksService>(CronTasksService);
});

describe('CRON purgeData', function () {
  it('should deleted old non-inApp notifications', async function () {
    await notificationsService.create({
      channel: 'email',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'pastService',
      created: '2010-01-01',
      state: 'sent',
    });
    await notificationsService.create({
      channel: 'email',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'futureService',
      created: '3020-01-01',
      state: 'sent',
    });
    try {
      await cronTasksService.purgeData()();
    } catch (err: any) {
      fail(err);
    }
    let data = await notificationsService.findAll(
      {
        where: {
          serviceName: 'futureService',
          channel: 'email',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(1);
    data = await notificationsService.findAll(
      {
        where: {
          serviceName: 'pastService',
          channel: 'email',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(0);
  });

  it('should delete all expired inApp notifications', async function () {
    await notificationsService.create({
      channel: 'inApp',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'expiredService',
      validTill: '2010-01-01',
      state: 'new',
    });
    await notificationsService.create({
      channel: 'inApp',
      isBroadcast: true,
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'nonexpiredService',
      validTill: '3010-01-01',
      state: 'new',
    });
    try {
      await cronTasksService.purgeData()();
    } catch (err: any) {
      fail(err);
    }
    let data = await notificationsService.findAll(
      {
        where: {
          serviceName: 'nonexpiredService',
          channel: 'inApp',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(1);
    data = await notificationsService.findAll(
      {
        where: {
          serviceName: 'expiredService',
          channel: 'inApp',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(0);
  });

  it('should delete all deleted inApp notifications', async function () {
    await notificationsService.create({
      channel: 'inApp',
      userId: 'foo',
      message: {
        title: 'test',
        body: 'this is a test',
      },
      serviceName: 'deletedService',
      state: 'deleted',
    });
    try {
      await cronTasksService.purgeData()();
    } catch (err: any) {
      fail(err);
    }
    const data = await notificationsService.findAll(
      {
        where: {
          serviceName: 'deletedService',
          channel: 'inApp',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(0);
  });

  it('should delete all old non-confirmed subscriptions', async function () {
    await subscriptionsService.create({
      serviceName: 'unconfirmedService',
      channel: 'email',
      userChannelId: 'bar@foo.com',
      state: 'unconfirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in email!',
        confirmationCode: '53007',
      },
      updated: '2010-01-01',
    });
    try {
      await cronTasksService.purgeData()();
    } catch (err: any) {
      fail(err);
    }
    const data = await subscriptionsService.findAll(
      {
        where: {
          serviceName: 'unconfirmedService',
          channel: 'email',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(0);
  });

  it('should delete all old deleted bounces', async function () {
    await bouncesService.create({
      channel: 'email',
      userChannelId: 'foo@invalid.local',
      state: 'deleted',
      updated: '2010-01-01',
    });
    const promiseAll = jest.spyOn(Promise, 'all');
    try {
      await cronTasksService.purgeData()();
      expect((await promiseAll.mock.results[0].value)[4].count).toEqual(1);
    } catch (err: any) {
      fail(err);
    }
    let data;
    try {
      data = await bouncesService.findById('1');
    } catch (ex) {}
    expect(data).toBeUndefined();
  });

  it('should not delete any newly deleted bounces', async function () {
    let data = await bouncesService.create({
      channel: 'email',
      userChannelId: 'foo@invalid.local',
      state: 'deleted',
      updated: new Date(),
    });
    const promiseAll = jest.spyOn(Promise, 'all');
    try {
      await cronTasksService.purgeData()();
      expect((await promiseAll.mock.results[0].value)[4].count).toEqual(0);
    } catch (err: any) {
      fail(err);
    }
    data = await bouncesService.findById(data.id);
    expect(data).not.toBeNull();
  });

  it('should delete all expired access tokens', async function () {
    const id1 = new mongoose.Types.ObjectId();
    const id2 = new mongoose.Types.ObjectId();
    await accessTokenService.create({
      _id: '1',
      ttl: 0,
      created: '2020-02-10T20:22:05.045Z',
      userId: id1,
    });
    await accessTokenService.create({
      _id: '2',
      created: '2020-02-10T20:22:05.045Z',
      userId: id2,
    });
    try {
      await cronTasksService.purgeData()();
    } catch (err: any) {
      fail(err);
    }
    let data = await accessTokenService.findAll({
      where: {
        userId: id1,
      },
    });
    expect(data.length).toEqual(0);
    data = await accessTokenService.findAll({
      where: {
        userId: id2,
      },
    });
    expect(data.length).toEqual(1);
  });
});
