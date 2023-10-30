import { HttpException, Injectable, Logger } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { CronJob } from 'cron';
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
  private readonly logger = new Logger(CronTasksService.name);
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
    return async (): Promise<void> => {
      try {
        const res = await Promise.all([
          (async () => {
            // delete all non-inApp old notifications
            const retentionDays =
              cronConfig.pushNotificationRetentionDays ??
              cronConfig.defaultRetentionDays;
            const data = await this.notificationsService.removeAll(
              {
                channel: {
                  $ne: 'inApp',
                },
                state: { $nin: ['new', 'sending'] },
                created: {
                  $lt: Date.now() - retentionDays * 86400000,
                },
              },
              undefined,
            );
            if (data?.count > 0) {
              this.logger.verbose(
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
            const data = await this.notificationsService.removeAll(
              {
                channel: 'inApp',
                validTill: {
                  $lt: Date.now() - retentionDays * 86400000,
                },
              },
              undefined,
            );
            if (data?.count > 0) {
              this.logger.verbose(
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
            const data = await this.notificationsService.removeAll(
              {
                channel: 'inApp',
                state: 'deleted',
              },
              undefined,
            );
            if (data?.count > 0) {
              this.logger.verbose(
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
            const data = await this.subscriptionsService.removeAll(
              {
                state: {
                  $ne: 'confirmed',
                },
                updated: {
                  $lt: Date.now() - retentionDays * 86400000,
                },
              },
              undefined,
            );
            if (data?.count > 0) {
              this.logger.verbose(
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
              this.logger.verbose(
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
              this.logger.verbose(
                new Date().toLocaleString() + ': Deleted ' + count + ' items.',
              );
            }
          })(),
        ]);
      } catch (ex) {
        this.logger.error(ex);
        throw ex;
      }
    };
  }

  dispatchLiveNotifications() {
    return async (): Promise<void> => {
      const livePushNotifications = await this.notificationsService.findAll(
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
        undefined,
      );
      if (livePushNotifications && livePushNotifications.length === 0) {
        return;
      }
      Promise.all(
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
            const res = await fetch(url, options);
            if (res.status >= 400)
              throw new HttpException(res.statusText, res.status);
          } catch (ex: any) {
            this.logger.error(ex);
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
      this.rssTasks[rssNtfctnConfigItem.id as string] = CronJob.from({
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
            this.logger.error(error);
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
          feedparser.on('end', async () => {
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
                  asyncBroadcastPushNotification: true,
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
                  const res = await fetch(url, options);
                  if (res.status >= 400)
                    throw new HttpException(res.statusText, res.status);
                } catch (ex: any) {
                  this.logger.error(ex);
                }
              }
            });
            if (!lastSavedRssData) {
              return;
            }
            await this.rssService.updateById(lastSavedRssData.id, {
              items: items.concat(retainedOutdatedItems),
              lastPoll: ts,
            });
          });
          const res = await fetch(rssNtfctnConfigItem.value.rss.url);
          if (res.status !== 200) {
            const err = new Error('Bad status code');
            this.logger.error(err);
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
    return async (): Promise<void> => {
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
      Promise.all(
        activeBounces.map(async (activeBounce) => {
          const latestBounceMessageDate =
            activeBounce.bounceMessages?.[0]?.date;
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
    return async (): Promise<void> => {
      const staleBroadcastPushNotifications =
        await this.notificationsService.findAll(
          {
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
          },
          undefined,
        );
      if (
        !staleBroadcastPushNotifications ||
        staleBroadcastPushNotifications.length === 0
      ) {
        return;
      }
      Promise.all(
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
              const res = await fetch(url, options);
              if (res.status >= 400)
                throw new HttpException(res.statusText, res.status);
            } catch (ex: any) {
              this.logger.error(ex);
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
          {
            where: {
              state: 'sending',
              channel: channel,
              isBroadcast: true,
            },
          },
          undefined,
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
