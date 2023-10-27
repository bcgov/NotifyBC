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

import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import FeedParser from 'feedparser';
import { differenceWith } from 'lodash';
import { AnyObject } from 'mongoose';
import { Readable } from 'node:stream';
import { AccessTokenService } from 'src/api/administrators/access-token.service';
import { BouncesService } from 'src/api/bounces/bounces.service';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { AppConfigService } from 'src/config/app-config.service';
import { RssItem } from 'src/rss/entities/rss-item.entity';
import { Rss } from 'src/rss/entities/rss.entity';
import { RssService } from 'src/rss/rss.service';

module.exports.Bottleneck = Bottleneck;
@Injectable()
export class CronTasksService {
  constructor(
    private readonly configurationsService: ConfigurationsService,
    private readonly notificationsService: NotificationsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly appConfigService: AppConfigService,
    private readonly bouncesService: BouncesService,
    private readonly accessTokenService: AccessTokenService,
    private readonly rssService: RssService,
  ) {}

  async purgeData() {
    const cronConfig = this.appConfigService.get('cron.purgeData') ?? {};
    return async () => {
      try {
        const res = await Promise.all([
          (async () => {
            // delete all non-inApp old notifications
            const retentionDays =
              cronConfig.pushNotificationRetentionDays ??
              cronConfig.defaultRetentionDays;
            const data = await this.notificationsService.removeAll(undefined, {
              channel: {
                $ne: 'inApp',
              },
              created: {
                $lt: Date.now() - retentionDays * 86400000,
              },
            });
            if (data?.count > 0) {
              console.info(
                new Date().toLocaleString() +
                  ': Deleted ' +
                  data.count +
                  ' items.',
              );
            }
            return data;
          })(),
          (async () => {
            // delete all expired inApp notifications
            const retentionDays =
              cronConfig.expiredInAppNotificationRetentionDays ??
              cronConfig.defaultRetentionDays;
            const data = await this.notificationsService.removeAll(undefined, {
              channel: 'inApp',
              validTill: {
                $lt: Date.now() - retentionDays * 86400000,
              },
            });
            if (data?.count > 0) {
              console.info(
                new Date().toLocaleString() +
                  ': Deleted ' +
                  data.count +
                  ' items.',
              );
            }
            return data;
          })(),
          (async () => {
            // delete all deleted inApp notifications
            const data = await this.notificationsService.removeAll(undefined, {
              channel: 'inApp',
              state: 'deleted',
            });
            if (data?.count > 0) {
              console.info(
                new Date().toLocaleString() +
                  ': Deleted ' +
                  data.count +
                  ' items.',
              );
            }
            return data;
          })(),
          (async () => {
            // delete all old non-confirmed subscriptions
            const retentionDays =
              cronConfig.nonConfirmedSubscriptionRetentionDays ??
              cronConfig.defaultRetentionDays;
            const data = await this.subscriptionsService.removeAll(undefined, {
              state: {
                $ne: 'confirmed',
              },
              updated: {
                $lt: Date.now() - retentionDays * 86400000,
              },
            });
            if (data?.count > 0) {
              console.info(
                new Date().toLocaleString() +
                  ': Deleted ' +
                  data.count +
                  ' items.',
              );
            }
            return data;
          })(),
          (async () => {
            // purge deleted bounces
            const retentionDays =
              cronConfig.deletedBounceRetentionDays ??
              cronConfig.defaultRetentionDays;
            const data = await this.bouncesService.removeAll({
              state: 'deleted',
              updated: {
                $lt: Date.now() - retentionDays * 86400000,
              },
            });
            if (data?.count > 0) {
              console.info(
                new Date().toLocaleString() +
                  ': Deleted ' +
                  data.count +
                  ' items.',
              );
            }
            return data;
          })(),
          (async () => {
            // delete all expired access Tokens
            const retentionDays =
              cronConfig.expiredAccessTokenRetentionDays ??
              cronConfig.defaultRetentionDays;
            const data = await this.accessTokenService.findAll({
              where: {
                ttl: { $gte: 0 },
                created: {
                  $lt: Date.now() - retentionDays * 86400000,
                },
              },
            });
            if (data.length === 0) {
              return;
            }
            let count = 0;
            for (const e of data) {
              if (
                e.created.valueOf() <
                Date.now() - retentionDays * 86400000 - (e.ttl as number) * 1000
              ) {
                await this.accessTokenService.remove(e.id);
                count++;
              }
            }
            if (count > 0) {
              console.info(
                new Date().toLocaleString() + ': Deleted ' + count + ' items.',
              );
            }
          })(),
        ]);
        return res;
      } catch (ex) {
        console.error(ex);
        throw ex;
      }
    };
  }

  dispatchLiveNotifications() {
    return async () => {
      const livePushNotifications = await this.notificationsService.findAll(
        undefined,
        {
          where: {
            state: 'new',
            channel: {
              $ne: 'inApp',
            },
            invalidBefore: {
              $lt: Date.now(),
            },
          },
        },
      );
      if (livePushNotifications && livePushNotifications.length === 0) {
        return livePushNotifications;
      }
      return Promise.all(
        livePushNotifications.map(async (livePushNotification) => {
          livePushNotification.asyncBroadcastPushNotification =
            livePushNotification.asyncBroadcastPushNotification || true;
          livePushNotification.state = 'sending';
          const httpHost =
            this.appConfigService.get('internalHttpHost') ??
            livePushNotification.httpHost ??
            this.appConfigService.get('httpHost');
          const url =
            httpHost +
            this.appConfigService.get('restApiRoot') +
            '/notifications/' +
            livePushNotification.id;
          const options = {
            method: 'PUT',
            body: JSON.stringify(livePushNotification),
            headers: {
              'Content-Type': 'application/json',
            },
          };
          try {
            return await fetch(url, options);
          } catch (ex: any) {
            console.error(new Error(ex.message));
          }
        }),
      );
    };
  }

  lastConfigCheck = 0;
  rssTasks: AnyObject = {};
  getRssTasks() {
    return this.rssTasks;
  }

  async checkRssConfigUpdates(runOnInit = false) {
    const CronJob = require('cron').CronJob;
    const rssNtfctnConfigItems = await this.configurationsService.findAll({
      where: {
        name: 'notification',
        'value.rss': {
          $ne: null,
        },
      },
    });

    for (const [key, rssTask] of Object.entries(this.rssTasks)) {
      const rssNtfctnConfigItem = rssNtfctnConfigItems.find(function (e) {
        return e.id?.toString() === key;
      });

      if (
        !rssNtfctnConfigItem ||
        rssNtfctnConfigItem.updated?.valueOf() > this.lastConfigCheck
      ) {
        rssTask.stop();
        delete this.rssTasks[key];
      }
    }
    for (const rssNtfctnConfigItem of rssNtfctnConfigItems) {
      if (this.rssTasks[rssNtfctnConfigItem.id as string]) {
        continue;
      }
      this.rssTasks[rssNtfctnConfigItem.id as string] = new CronJob({
        cronTime: rssNtfctnConfigItem.value.rss.timeSpec,
        onTick: async () => {
          let lastSavedRssData: Rss = null;
          try {
            lastSavedRssData = await this.rssService.findOne({
              where: {
                serviceName: rssNtfctnConfigItem.serviceName,
              },
            });
          } catch (ex) {}
          if (!lastSavedRssData) {
            lastSavedRssData = await this.rssService.create({
              serviceName: rssNtfctnConfigItem.serviceName as string,
              items: [],
            });
          }
          let lastSavedRssItems: any[] = [];
          try {
            lastSavedRssItems = lastSavedRssData.items ?? [];
          } catch (ex) {}
          const feedparser = new FeedParser({
            addmeta: false,
          });

          feedparser.on('error', function (error: any) {
            // always handle errors
            console.error(error);
          });

          const items: any[] = [];
          const ts = new Date();
          feedparser.on('readable', function () {
            // This is where the action is!
            const stream = feedparser;
            let item;
            while ((item = stream.read())) {
              item._notifyBCLastPoll = ts;
              items.push(item);
            }
          });
          feedparser.on('end', async function () {
            const itemKeyField =
              rssNtfctnConfigItem.value.rss.itemKeyField || 'guid';
            const fieldsToCheckForUpdate = rssNtfctnConfigItem.value.rss
              .fieldsToCheckForUpdate || ['pubDate'];
            const newOrUpdatedItems = differenceWith(
              items,
              lastSavedRssItems,
              function (arrVal: RssItem, othVal: RssItem) {
                if (arrVal[itemKeyField] !== othVal[itemKeyField]) {
                  return false;
                }
                if (!rssNtfctnConfigItem.value.rss.includeUpdatedItems) {
                  return arrVal[itemKeyField] === othVal[itemKeyField];
                }
                return !fieldsToCheckForUpdate.some(
                  (compareField: string | number) => {
                    return (
                      arrVal[compareField] &&
                      othVal[compareField] &&
                      arrVal[compareField].toString() !==
                        othVal[compareField].toString()
                    );
                  },
                );
              },
            );
            const outdatedItemRetentionGenerations =
              rssNtfctnConfigItem.value.rss.outdatedItemRetentionGenerations ??
              1;
            let lastPollInterval = ts.getTime();
            try {
              lastPollInterval =
                ts.getTime() - lastSavedRssData?.lastPoll.valueOf();
            } catch (ex) {}
            const retainedOutdatedItems = differenceWith(
              lastSavedRssItems,
              items,
              function (
                arrVal: {
                  [x: string]: any;
                  _notifyBCLastPoll: { getTime: () => number };
                },
                othVal: { [x: string]: any },
              ) {
                try {
                  const age = ts.getTime() - arrVal._notifyBCLastPoll.getTime();
                  if (
                    Math.round(age / lastPollInterval) >=
                    outdatedItemRetentionGenerations
                  ) {
                    return true;
                  }
                } catch (ex) {}
                return arrVal[itemKeyField] === othVal[itemKeyField];
              },
            );
            // notify new or updated items
            newOrUpdatedItems.forEach(async (newOrUpdatedItem: any) => {
              for (const [channel, message] of Object.entries(
                rssNtfctnConfigItem.value.messageTemplates,
              )) {
                const notificationObject = {
                  serviceName: rssNtfctnConfigItem.serviceName,
                  channel: channel,
                  isBroadcast: true,
                  message,
                  data: newOrUpdatedItem,
                  httpHost: rssNtfctnConfigItem.value.httpHost,
                };
                const httpHost =
                  this.appConfigService.get('internalHttpHost') ||
                  rssNtfctnConfigItem.value.httpHost;
                const url =
                  httpHost +
                  this.appConfigService.get('restApiRoot') +
                  '/notifications';
                const options = {
                  method: 'POST',
                  body: JSON.stringify(notificationObject),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                };
                try {
                  await fetch(url, options);
                } catch (ex: any) {
                  console.error(new Error(ex.message));
                }
              }
            });
            if (!lastSavedRssData) {
              return;
            }
            lastSavedRssData.items = items.concat(retainedOutdatedItems);
            lastSavedRssData.lastPoll = ts;
            await this.rssService.updateById(
              lastSavedRssData.id,
              lastSavedRssData,
            );
          });
          const res = await fetch(rssNtfctnConfigItem.value.rss.url);
          if (res.status !== 200) {
            const err = new Error('Bad status code');
            console.error(err);
          } else {
            Readable.fromWeb(res.body as any).pipe(feedparser);
          }
        },
        start: true,
        runOnInit: runOnInit,
      });
    }
    this.lastConfigCheck = Date.now();
    return this.rssTasks;
  }

  async deleteBounces() {
    return async () => {
      const minHrs: number = parseInt(
        this.appConfigService.get(
          'cron.deleteBounces.minLapsedHoursSinceLatestNotificationEnded',
        ) ?? '0',
      );
      const activeBounces = await this.bouncesService.findAll({
        where: {
          state: 'active',
          latestNotificationEnded: {
            $lt: Date.now() - minHrs * 3600000,
          },
          latestNotificationStarted: {
            $ne: null,
          },
          bounceMessages: {
            $ne: null,
          },
        },
      });
      return Promise.all(
        activeBounces.map(async (activeBounce) => {
          const latestBounceMessageDate = activeBounce.bounceMessages?.[0].date;
          if (
            !activeBounce.latestNotificationStarted ||
            !latestBounceMessageDate ||
            latestBounceMessageDate > activeBounce.latestNotificationStarted
          ) {
            return;
          }
          activeBounce.state = 'deleted';
          await this.bouncesService.updateById(activeBounce.id, activeBounce);
        }),
      );
    };
  }

  reDispatchBroadcastPushNotifications() {
    return async () => {
      const staleBroadcastPushNotifications =
        await this.notificationsService.findAll(undefined, {
          where: {
            state: 'sending',
            channel: {
              $ne: 'inApp',
            },
            isBroadcast: true,
            updated: {
              $lt: Date.now() - 600000,
            },
          },
        });
      if (
        staleBroadcastPushNotifications &&
        staleBroadcastPushNotifications.length === 0
      ) {
        return staleBroadcastPushNotifications;
      }
      return Promise.all(
        staleBroadcastPushNotifications.map(
          async (staleBroadcastPushNotification) => {
            staleBroadcastPushNotification.asyncBroadcastPushNotification =
              staleBroadcastPushNotification.asyncBroadcastPushNotification ||
              true;
            const httpHost =
              this.appConfigService.get('internalHttpHost') ??
              staleBroadcastPushNotification.httpHost ??
              this.appConfigService.get('httpHost');
            const url =
              httpHost +
              this.appConfigService.get('restApiRoot') +
              '/notifications/' +
              staleBroadcastPushNotification.id;
            const options = {
              method: 'PUT',
              body: JSON.stringify(staleBroadcastPushNotification),
              headers: {
                'Content-Type': 'application/json',
              },
            };
            try {
              await fetch(url, options);
            } catch (ex: any) {
              console.error(new Error(ex.message));
            }
          },
        ),
      );
    };
  }

  clearRedisDatastore() {
    return async () => {
      for (const channel of ['sms', 'email']) {
        const throttleConfig = <Bottleneck.ConstructorOptions>(
          this.appConfigService.get(channel + '.throttle')
        );
        if (
          !throttleConfig.enabled ||
          throttleConfig.clearDatastore === true ||
          throttleConfig.datastore !== 'ioredis'
        )
          continue;
        const sendingNotification = await this.notificationsService.findOne(
          undefined,
          {
            where: {
              state: 'sending',
              channel: channel,
              isBroadcast: true,
            },
          },
        );
        if (sendingNotification) continue;
        const newThrottleConfig = Object.assign({}, throttleConfig, {
          clearDatastore: true,
        });
        delete newThrottleConfig.enabled;
        const limiter = new module.exports.Bottleneck(newThrottleConfig);
        await limiter.ready();
        await limiter.disconnect();
      }
    };
  }
}
