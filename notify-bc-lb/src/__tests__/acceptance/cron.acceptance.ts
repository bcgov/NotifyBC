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

import {ApplicationConfig, CoreBindings} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {Client, SinonSpy, expect} from '@loopback/testlab';
import {fail} from 'assert';
import _ from 'lodash';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {BaseController} from '../../controllers/base.controller';
import {
  AccessTokenRepository,
  BounceRepository,
  ConfigurationRepository,
  NotificationRepository,
  RssRepository,
  SubscriptionRepository,
} from '../../repositories';
import {BaseCrudRepository} from '../../repositories/baseCrudRepository';
import {setupApplication, wait} from './test-helper';
const cronTasks = require('../../observers/cron-tasks');
// const parallel = require('async/parallel');
const path = require('path');
const fs = require('fs');
let app: NotifyBcApplication;
let client: Client;
let rssRepository: RssRepository;
let notificationRepository: NotificationRepository;
let subscriptionRepository: SubscriptionRepository;
let configurationRepository: ConfigurationRepository;
let bounceRepository: BounceRepository;
let accessTokenRepository: AccessTokenRepository;
// start: ported
before('setupApplication', async function () {
  ({app, client} = await setupApplication());
  rssRepository = await app.get('repositories.RssRepository');
  configurationRepository = await app.get(
    'repositories.ConfigurationRepository',
  );
  notificationRepository = await app.get('repositories.NotificationRepository');
  subscriptionRepository = await app.get('repositories.SubscriptionRepository');
  bounceRepository = await app.get('repositories.BounceRepository');
  accessTokenRepository = await app.get('repositories.AccessTokenRepository');
});

describe('CRON purgeData', function () {
  it('should deleted old non-inApp notifications', async function () {
    await notificationRepository.create({
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
    await notificationRepository.create({
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
      await (
        await cronTasks.purgeData(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    let data = await notificationRepository.find({
      where: {
        serviceName: 'futureService',
        channel: 'email',
      },
    });
    expect(data.length).equal(1);
    data = await notificationRepository.find({
      where: {
        serviceName: 'pastService',
        channel: 'email',
      },
    });
    expect(data.length).equal(0);
    return;
  });

  it('should delete all expired inApp notifications', async function () {
    await notificationRepository.create({
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
    await notificationRepository.create({
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
      await (
        await cronTasks.purgeData(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    let data = await notificationRepository.find({
      where: {
        serviceName: 'nonexpiredService',
        channel: 'inApp',
      },
    });
    expect(data.length).equal(1);
    data = await notificationRepository.find({
      where: {
        serviceName: 'expiredService',
        channel: 'inApp',
      },
    });
    expect(data.length).equal(0);
  });

  it('should delete all deleted inApp notifications', async function () {
    await notificationRepository.create({
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
      await (
        await cronTasks.purgeData(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    const data = await notificationRepository.find({
      where: {
        serviceName: 'deletedService',
        channel: 'inApp',
      },
    });
    expect(data.length).equal(0);
  });

  it('should delete all old non-confirmed subscriptions', async function () {
    const stub = sinon.stub(BaseCrudRepository.prototype, 'updateTimestamp');
    stub.resolves();
    await subscriptionRepository.create({
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
    stub.restore();
    try {
      await (
        await cronTasks.purgeData(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'unconfirmedService',
        channel: 'email',
      },
    });
    expect(data.length).equal(0);
  });

  it('should delete all old deleted bounces', async function () {
    const stub = sinon.stub(BaseCrudRepository.prototype, 'updateTimestamp');
    stub.resolves();
    await bounceRepository.create({
      channel: 'email',
      userChannelId: 'foo@invalid.local',
      state: 'deleted',
      updated: '2010-01-01',
    });
    stub.restore();
    try {
      const results = await (await cronTasks.purgeData(app))();
      expect(results[4].count).equal(1);
    } catch (err: any) {
      fail(err);
    }
    let data;
    try {
      data = await bounceRepository.findById('1');
    } catch (ex) {}
    expect(data).undefined();
  });

  it('should not delete any newly deleted bounces', async function () {
    const stub = sinon.stub(BaseCrudRepository.prototype, 'updateTimestamp');
    stub.resolves();
    let data = await bounceRepository.create({
      channel: 'email',
      userChannelId: 'foo@invalid.local',
      state: 'deleted',
      // updated: default to now
    });
    stub.restore();
    try {
      const results = await (await cronTasks.purgeData(app))();
      expect(results[4].count).equal(0);
    } catch (err: any) {
      fail(err);
    }
    data = await bounceRepository.findById('1');
    expect(data).not.equal(null);
  });

  it('should delete all expired access tokens', async function () {
    await accessTokenRepository.create({
      ttl: 0,
      created: '2020-02-10T20:22:05.045Z',
      userId: '1',
    });
    await accessTokenRepository.create({
      created: '2020-02-10T20:22:05.045Z',
      userId: '2',
    });
    try {
      await (
        await cronTasks.purgeData(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    let data = await accessTokenRepository.find({
      where: {
        userId: '1',
      },
    });
    expect(data.length).equal(0);
    data = await accessTokenRepository.find({
      where: {
        userId: '2',
      },
    });
    expect(data.length).equal(1);
  });
});
// end: ported

describe('CRON dispatchLiveNotifications', function () {
  beforeEach(async function () {
    await Promise.all([
      (async () => {
        return notificationRepository.create({
          channel: 'email',
          message: {
            from: 'admin@foo.com',
            subject: 'test',
            textBody: 'this is a test {http_host}',
          },
          isBroadcast: true,
          serviceName: 'myService',
          httpHost: 'http://foo.com',
          asyncBroadcastPushNotification: false,
          invalidBefore: '2010-01-01',
          state: 'new',
        });
      })(),
      (async () => {
        return notificationRepository.create({
          channel: 'email',
          message: {
            from: 'admin@foo.com',
            subject: 'test',
            textBody: 'this is another test {http_host}',
          },
          serviceName: 'myService',
          httpHost: 'http://foo.com',
          userChannelId: 'bar@foo.com',
          invalidBefore: '3010-01-01',
          state: 'new',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
      })(),
    ]);
  });

  it('should send all live push notifications', async function () {
    sinon.stub(BaseCrudRepository.prototype, 'isAdminReq').resolves(true);
    sinon
      .stub(global, 'fetch')
      .withArgs(sinon.match.string, sinon.match({method: 'PUT'}))
      .callsFake(async function (url, options) {
        const r = await client
          .put(url.toString())
          .send(JSON.parse(options?.body as string));
        return new Response(JSON.stringify(r.body));
      });

    try {
      const results = await cronTasks.dispatchLiveNotifications(app)();
      expect(results.length).equal(1);
    } catch (err: any) {
      fail(err);
    }
    await wait(3000);
    sinon.assert.calledOnceWithMatch(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      {
        from: 'admin@foo.com',
        to: 'bar@foo.com',
        subject: 'test',
        text: 'this is a test http://foo.com',
        html: undefined,
        list: {
          id: 'http://foo.com/myService',
          unsubscribe: [
            [
              'un-1-12345@invalid.local',
              'http://foo.com/api/subscriptions/1/unsubscribe?unsubscriptionCode=12345',
            ],
          ],
        },
      },
    );
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
        channel: 'email',
        state: 'sent',
      },
    });
    expect(data.length).equal(1);
  });
});

describe('CRON checkRssConfigUpdates', function () {
  beforeEach(async function () {
    sinon
      .stub(global, 'fetch')
      .withArgs(sinon.match.string)
      .callsFake(async function () {
        const output = fs.createReadStream(__dirname + path.sep + 'rss.xml');
        return new Response(output, {
          status: 200,
        });
      });
    // sinon
    //   .spy(global, 'fetch')
    //   .withArgs(sinon.match.any, sinon.match({method: 'POST'}));
    const res = await Promise.all([
      configurationRepository.create({
        name: 'notification',
        serviceName: 'myService',
        value: {
          rss: {
            url: 'http://myService/rss',
            timeSpec: '0 0 1 0 0',
            outdatedItemRetentionGenerations: 1,
            includeUpdatedItems: false,
            fieldsToCheckForUpdate: ['title'],
          },
          messageTemplates: {
            email: {
              from: 'no_reply@invlid.local',
              subject: '{title}',
              textBody: '{description}',
              htmlBody: '{description}',
            },
          },
          httpHost: 'http://foo',
        },
      }),
      subscriptionRepository.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        unsubscriptionCode: '12345',
      }),
    ]);
    return res;
  });

  afterEach(() => {
    const rssTasks = cronTasks.getRssTasks();
    if (!rssTasks) return;
    for (const idx in rssTasks) {
      rssTasks[idx].stop();
      delete rssTasks[idx];
    }
  });

  it('should create rss task and post notifications at initial run', async function () {
    try {
      const rssTasks = await cronTasks.checkRssConfigUpdates(app, true);
      expect(rssTasks['1']).not.null();
    } catch (err: any) {
      fail(err);
    }
    await wait(1000);
    sinon.assert.calledOnce(
      (fetch as sinon.SinonStub).withArgs(
        sinon.match.string,
        sinon.match({method: 'POST'}),
      ),
    );
    sinon.assert.calledOnceWithMatch(
      (fetch as sinon.SinonStub).withArgs(
        sinon.match.string,
        sinon.match({method: 'POST'}),
      ),
      'http://foo/api/notifications',
      sinon.match({body: sinon.match('"httpHost":"http://foo"')}),
    );
    const results = (await rssRepository.find()) as AnyObject;
    expect(results[0].items[0].author).equal('foo');
  });

  it('should avoid sending notification for unchanged items', async function () {
    const data: any = {
      serviceName: 'myService',
      items: [
        {
          title: 'Item 2',
          description: 'lorem ipsum',
          summary: 'lorem ipsum',
          pubDate: '1970-01-01T00:00:00.000Z',
          link: 'http://myservice/2',
          guid: '2',
          author: 'foo',
          _notifyBCLastPoll: '1970-01-01T00:00:00.000Z',
        },
        {
          title: 'Item 1',
          description: 'lorem ipsum',
          summary: 'lorem ipsum',
          pubDate: '1970-01-01T00:00:00.000Z',
          link: 'http://myservice/1',
          guid: '1',
          author: 'foo',
          _notifyBCLastPoll: '1970-01-01T00:00:00.000Z',
        },
      ],
      lastPoll: '1970-01-01T00:00:00.000Z',
    };
    await rssRepository.create(data);
    await cronTasks.checkRssConfigUpdates(app, true);
    await wait(2000);
    sinon.assert.notCalled(
      (fetch as sinon.SinonStub).withArgs(
        sinon.match.string,
        sinon.match({method: 'POST'}),
      ),
    );
    const results = (await rssRepository.find()) as AnyObject;
    expect(results[0].items[0].author).equal('foo');
  });

  it('should send notification for updated item', async function () {
    const res = await configurationRepository.findById('1');
    const newVal = res.value;
    newVal.rss.includeUpdatedItems = true;
    newVal.rss.outdatedItemRetentionGenerations = 100;
    await configurationRepository.updateById(res.id, {value: newVal});
    const data: any = {
      serviceName: 'myService',
      items: [
        {
          title: 'Item',
          description: 'lorem ipsum',
          pubDate: '1970-01-01T00:00:00.000Z',
          link: 'http://myservice/1',
          guid: '1',
          author: 'foo',
          _notifyBCLastPoll: '1970-01-01T00:00:00.000Z',
        },
      ],
      lastPoll: '1970-01-01T00:00:00.000Z',
    };
    await rssRepository.create(data);
    await cronTasks.checkRssConfigUpdates(app, true);
    await wait(2000);
    sinon.assert.calledOnce(
      (fetch as sinon.SinonStub).withArgs(
        sinon.match.string,
        sinon.match({method: 'POST'}),
      ),
    );
  });

  it('should handle error', async function () {
    (fetch as sinon.SinonStub).restore();
    sinon
      .stub(global, 'fetch')
      .withArgs(sinon.match.string)
      .callsFake(async function () {
        return new Response(null, {
          status: 300,
        });
      });
    sinon.spy(console, 'error');
    await cronTasks.checkRssConfigUpdates(app, true);
    await wait(2000);
    sinon.assert.calledWithMatch(console.error as SinonSpy, {
      message: 'Bad status code',
    });
  });
});

describe('CRON deleteBounces', function () {
  it('should delete bounce records in which no messages since latestNotificationStarted', async function () {
    await bounceRepository.create({
      channel: 'email',
      userChannelId: 'foo@invalid.local',
      hardBounceCount: 6,
      state: 'active',
      latestNotificationStarted: '2018-09-30T17:27:44.501Z',
      latestNotificationEnded: '2018-07-30T17:27:45.261Z',
      bounceMessages: [
        {
          date: '2018-08-30T17:27:45.784Z',
          message: 'blah',
        },
      ],
    } as AnyObject);
    try {
      await (
        await cronTasks.deleteBounces(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    const item = await bounceRepository.findById('1');
    expect(item.state).equal('deleted');
  });
  it('should not delete bounce records in which there are messages since latestNotificationStarted', async function () {
    await bounceRepository.create({
      channel: 'email',
      userChannelId: 'foo@invalid.local',
      hardBounceCount: 6,
      state: 'active',
      latestNotificationStarted: '2018-07-30T17:27:44.501Z',
      latestNotificationEnded: '2018-07-30T17:27:45.261Z',
      bounceMessages: [
        {
          date: '2018-08-30T17:27:45.784Z',
          message: 'blah',
        },
      ],
    } as AnyObject);
    try {
      await (
        await cronTasks.deleteBounces(app)
      )();
    } catch (err: any) {
      fail(err);
    }
    const item = await bounceRepository.findById('1');
    expect(item.state).equal('active');
  });
});

describe('CRON reDispatchBroadcastPushNotifications', function () {
  beforeEach(async function () {
    sinon.stub(BaseCrudRepository.prototype, 'updateTimestamp').resolves();
    await Promise.all([
      notificationRepository.create({
        channel: 'email',
        message: {
          from: 'admin@foo.com',
          subject: 'test',
          textBody: 'this is a test http://foo.com',
        },
        isBroadcast: true,
        serviceName: 'myService',
        httpHost: 'http://foo.com',
        asyncBroadcastPushNotification: false,
        state: 'sending',
        updated: new Date(new Date().valueOf() - 601000).toUTCString(),
        dispatch: {
          candidates: ['1'],
        },
      }),
      subscriptionRepository.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        unsubscriptionCode: '12345',
      }),
    ]);
  });

  it('should reDispatch broadcast push notifications', async function () {
    sinon.stub(BaseCrudRepository.prototype, 'isAdminReq').resolves(true);
    sinon
      .stub(global, 'fetch')
      .withArgs(sinon.match.string, sinon.match({method: 'PUT'}))
      .callsFake(async function (url, options) {
        const r = await client
          .put(url.toString())
          .send(JSON.parse(options?.body as string));
        return new Response(JSON.stringify(r.body));
      });

    try {
      const results = await cronTasks.reDispatchBroadcastPushNotifications(
        app,
      )();
      expect(results.length).equal(1);
    } catch (err: any) {
      fail(err);
    }

    sinon.assert.calledOnceWithMatch(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      {
        from: 'admin@foo.com',
        to: 'bar@foo.com',
        subject: 'test',
        text: 'this is a test http://foo.com',
        html: undefined,
        list: {
          id: 'http://foo.com/myService',
          unsubscribe: [
            [
              'un-1-12345@invalid.local',
              'http://foo.com/api/subscriptions/1/unsubscribe?unsubscriptionCode=12345',
            ],
          ],
        },
      },
    );
    await wait(3000);
    const data = await notificationRepository.find({
      where: {
        serviceName: 'myService',
        channel: 'email',
        state: 'sent',
      },
    });
    expect(data.length).equal(1);
    expect(data[0].dispatch?.successful).containEql('1');
  });
});

describe('CRON clearRedisDatastore', function () {
  let ready: sinon.SinonStub;
  let disconnect: sinon.SinonStub;
  let origConfig: ApplicationConfig;
  beforeEach(async function () {
    origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        email: {throttle: {enabled: true, datastore: 'ioredis'}},
        sms: {throttle: {enabled: true, datastore: 'ioredis'}},
      }),
    );
    ready = sinon.stub().resolves(null);
    disconnect = sinon.stub().resolves(null);
    sinon.stub(cronTasks, 'Bottleneck').returns({
      ready,
      disconnect,
    });
  });
  afterEach(async function () {
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  it('should not clear datastore when there is sending notification', async function () {
    await Promise.all([
      notificationRepository.create({
        channel: 'sms',
        message: {
          textBody: 'this is a test http://foo.com',
        },
        isBroadcast: true,
        serviceName: 'myService',
        state: 'sending',
      }),
      notificationRepository.create({
        channel: 'email',
        isBroadcast: true,
        serviceName: 'myService',
        state: 'sending',
      }),
    ]);
    await cronTasks.clearRedisDatastore(app)();
    sinon.assert.notCalled(cronTasks.Bottleneck);
    sinon.assert.notCalled(ready);
    sinon.assert.notCalled(disconnect);
  });

  it('should clear datastore when no sending notification', async function () {
    await cronTasks.clearRedisDatastore(app)();
    sinon.assert.alwaysCalledWithMatch(cronTasks.Bottleneck, {
      clearDatastore: true,
    });
    sinon.assert.calledTwice(ready);
    sinon.assert.calledTwice(disconnect);
  });
});
