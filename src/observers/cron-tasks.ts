import {Application, Context, CoreBindings} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {RestBindings} from '@loopback/rest';
import {NotificationController} from '../controllers';
import {Rss, RssItem, RssRelations} from '../models';
import {
  AccessTokenRepository,
  BounceRepository,
  ConfigurationRepository,
  NotificationRepository,
  RssRepository,
  SubscriptionRepository,
} from '../repositories';

const FeedParser = require('feedparser');
const request = require('axios');
const _ = require('lodash');

module.exports.request = request;
module.exports.purgeData = async (app: Application) => {
  const cronConfig: AnyObject =
    (await app.getConfig(
      CoreBindings.APPLICATION_INSTANCE,
      'cron.purgeData',
    )) ?? {};

  return async () => {
    const notificationRepository: NotificationRepository = await app.get(
      'repositories.NotificationRepository',
    );
    try {
      const res = await Promise.all([
        (async () => {
          // delete all non-inApp old notifications
          const retentionDays =
            cronConfig.pushNotificationRetentionDays ??
            cronConfig.defaultRetentionDays;
          const data = await notificationRepository.deleteAll({
            channel: {
              neq: 'inApp',
            },
            created: {
              lt: Date.now() - retentionDays * 86400000,
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
          const data = await notificationRepository.deleteAll({
            channel: 'inApp',
            validTill: {
              lt: Date.now() - retentionDays * 86400000,
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
          const data = await notificationRepository.deleteAll({
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
          const subscriptionRepository: SubscriptionRepository = await app.get(
            'repositories.SubscriptionRepository',
          );
          const data = await subscriptionRepository.deleteAll({
            state: {
              neq: 'confirmed',
            },
            updated: {
              lt: Date.now() - retentionDays * 86400000,
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
          const bounceRepository: BounceRepository = await app.get(
            'repositories.BounceRepository',
          );
          const data = await bounceRepository.deleteAll({
            state: 'deleted',
            updated: {
              lt: Date.now() - retentionDays * 86400000,
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
          const accessTokenRepository: AccessTokenRepository = await app.get(
            'repositories.AccessTokenRepository',
          );

          const data = await accessTokenRepository.find({
            where: {
              ttl: {gte: 0},
              created: {
                lt: Date.now() - retentionDays * 86400000,
              },
            },
          });
          if (data.length === 0) {
            return;
          }
          let count = 0;
          for (const e of data) {
            if (
              Date.parse(e.created as string) <
              Date.now() - retentionDays * 86400000 - (e.ttl as number) * 1000
            ) {
              await accessTokenRepository.deleteById(e.id);
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
};

module.exports.dispatchLiveNotifications = function (app: Application) {
  return async () => {
    const notificationRepo: NotificationRepository = await app.get(
      'repositories.NotificationRepository',
    );

    const livePushNotifications = await notificationRepo.find({
      where: {
        state: 'new',
        channel: {
          neq: 'inApp',
        },
        invalidBefore: {
          lt: Date.now(),
        },
      },
    });
    if (livePushNotifications && livePushNotifications.length === 0) {
      return livePushNotifications;
    }
    return Promise.all(
      livePushNotifications.map(async livePushNotification => {
        livePushNotification.state = 'sending';
        if (
          livePushNotification.asyncBroadcastPushNotification === undefined ||
          livePushNotification.asyncBroadcastPushNotification === null
        ) {
          livePushNotification.asyncBroadcastPushNotification = true;
        }
        await notificationRepo.updateById(
          livePushNotification.id,
          livePushNotification,
        );
        const ctx: Context = new Context();
        ctx.bind('args').to({data: livePushNotification});
        app.bind(RestBindings.Http.CONTEXT).to(ctx);
        const notificationController: NotificationController = await app.get(
          'controllers.NotificationController',
        );
        await notificationController.preCreationValidation(
          livePushNotification,
        );
        return notificationController.dispatchNotification(
          livePushNotification,
        );
      }),
    );
  };
};

let lastConfigCheck = 0;
const rssTasks: AnyObject = {};
module.exports.getRssTasks = () => {
  return rssTasks;
};
module.exports.checkRssConfigUpdates = async (
  app: Application,
  runOnInit = false,
) => {
  const CronJob = require('cron').CronJob;
  const configurationRepository: ConfigurationRepository = await app.get(
    'repositories.ConfigurationRepository',
  );
  const rssRepository: RssRepository = await app.get(
    'repositories.RssRepository',
  );
  return new Promise((resolve, reject) => {
    configurationRepository
      .find({
        where: {
          name: 'notification',
          'value.rss': {
            neq: null,
          },
        },
      })
      .then(rssNtfctnConfigItems => {
        for (const key in rssTasks) {
          // eslint-disable-next-line no-prototype-builtins
          if (!rssTasks.hasOwnProperty(key)) {
            continue;
          }

          const rssNtfctnConfigItem = rssNtfctnConfigItems.find(function (e) {
            return e.id?.toString() === key;
          });

          if (
            !rssNtfctnConfigItem ||
            Date.parse(rssNtfctnConfigItem.updated ?? '') > lastConfigCheck
          ) {
            rssTasks[key].stop();
            delete rssTasks[key];
          }
        }
        rssNtfctnConfigItems.forEach(function (rssNtfctnConfigItem) {
          if (!rssTasks[rssNtfctnConfigItem.id as string]) {
            rssTasks[rssNtfctnConfigItem.id as string] = new CronJob({
              cronTime: rssNtfctnConfigItem.value.rss.timeSpec,
              onTick: async () => {
                let lastSavedRssData: (Rss & RssRelations) | null = null;
                try {
                  lastSavedRssData = await rssRepository.findOne({
                    where: {
                      serviceName: rssNtfctnConfigItem.serviceName,
                    },
                  });
                } catch (ex) {}
                if (!lastSavedRssData) {
                  lastSavedRssData = await rssRepository.create({
                    serviceName: rssNtfctnConfigItem.serviceName,
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
                try {
                  const res = await module.exports.request({
                    method: 'get',
                    url: rssNtfctnConfigItem.value.rss.url,
                    responseType: 'stream',
                  });
                  if (res.status !== 200) {
                    reject(new Error('Bad status code'));
                  } else {
                    res.data.pipe(feedparser);
                  }
                } catch (ex) {
                  reject(ex);
                }

                feedparser.on('error', function (error: any) {
                  // always handle errors
                  console.info(error);
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
                feedparser.on('end', function () {
                  const itemKeyField =
                    rssNtfctnConfigItem.value.rss.itemKeyField || 'guid';
                  const fieldsToCheckForUpdate = rssNtfctnConfigItem.value.rss
                    .fieldsToCheckForUpdate || ['pubDate'];
                  const newOrUpdatedItems = _.differenceWith(
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
                    rssNtfctnConfigItem.value.rss
                      .outdatedItemRetentionGenerations ?? 1;
                  let lastPollInterval = ts.getTime();
                  try {
                    lastPollInterval =
                      ts.getTime() -
                      Date.parse(lastSavedRssData?.lastPoll ?? '0');
                  } catch (ex) {}
                  const retainedOutdatedItems = _.differenceWith(
                    lastSavedRssItems,
                    items,
                    function (
                      arrVal: {
                        [x: string]: any;
                        _notifyBCLastPoll: {getTime: () => number};
                      },
                      othVal: {[x: string]: any},
                    ) {
                      try {
                        const age =
                          ts.getTime() - arrVal._notifyBCLastPoll.getTime();
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
                    for (const channel in rssNtfctnConfigItem.value
                      .messageTemplates) {
                      if (
                        // eslint-disable-next-line no-prototype-builtins
                        !rssNtfctnConfigItem.value.messageTemplates.hasOwnProperty(
                          channel,
                        )
                      ) {
                        continue;
                      }
                      const notificationObject = {
                        serviceName: rssNtfctnConfigItem.serviceName,
                        channel: channel,
                        isBroadcast: true,
                        message:
                          rssNtfctnConfigItem.value.messageTemplates[channel],
                        data: newOrUpdatedItem,
                        httpHost: rssNtfctnConfigItem.value.httpHost,
                      };
                      const httpHost =
                        (await app.getConfig(
                          CoreBindings.APPLICATION_INSTANCE,
                          'internalHttpHost',
                        )) || rssNtfctnConfigItem.value.httpHost;
                      const url =
                        httpHost +
                        (await app.getConfig(
                          CoreBindings.APPLICATION_INSTANCE,
                          'restApiRoot',
                        )) +
                        '/notifications';
                      const options = {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      };
                      try {
                        await module.exports.request.post(
                          url,
                          notificationObject,
                          options,
                        );
                      } catch (ex) {
                        console.error(new Error(ex.message));
                      }
                    }
                  });
                  if (!lastSavedRssData) {
                    return;
                  }
                  lastSavedRssData.items = items.concat(retainedOutdatedItems);
                  lastSavedRssData.lastPoll = ts.toISOString();
                  rssRepository
                    .updateById(lastSavedRssData.id, lastSavedRssData)
                    .then(() => {
                      resolve(rssTasks);
                    })
                    .catch(reject);
                });
              },
              start: true,
              runOnInit: runOnInit,
            });
          }
        });
        lastConfigCheck = Date.now();
      })
      .catch(reject);
  });
};

module.exports.deleteBounces = async (app: Application) => {
  return async () => {
    const bounceRepository: BounceRepository = await app.get(
      'repositories.BounceRepository',
    );

    const minHrs: number = parseInt(
      (await app.getConfig(
        CoreBindings.APPLICATION_INSTANCE,
        'cron.deleteBounces.minLapsedHoursSinceLatestNotificationEnded',
      )) ?? '0',
    );
    const activeBounces = await bounceRepository.find({
      where: {
        state: 'active',
        latestNotificationEnded: {
          lt: Date.now() - minHrs * 3600000,
        },
        latestNotificationStarted: {
          neq: null,
        },
        bounceMessages: {
          neq: null,
        },
      },
    });
    return Promise.all(
      activeBounces.map(async activeBounce => {
        const latestBounceMessageDate = activeBounce.bounceMessages?.[0].date;
        if (
          !activeBounce.latestNotificationStarted ||
          !latestBounceMessageDate ||
          Date.parse(latestBounceMessageDate) >
            Date.parse(activeBounce.latestNotificationStarted)
        ) {
          return;
        }
        activeBounce.state = 'deleted';
        await bounceRepository.updateById(activeBounce.id, activeBounce);
      }),
    );
  };
};
