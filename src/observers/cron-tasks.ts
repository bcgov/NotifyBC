import {Application, CoreBindings} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {NotificationController} from '../controllers';
import {
  BounceRepository,
  NotificationRepository,
  SubscriptionRepository,
} from '../repositories';

const parallel = require('async/parallel');
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
            cronConfig.pushNotificationRetentionDays ||
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
            cronConfig.expiredInAppNotificationRetentionDays ||
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
            cronConfig.nonConfirmedSubscriptionRetentionDays ||
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
            cronConfig.deletedBounceRetentionDays ||
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
    const notificationController: NotificationController = await app.get(
      'controllers.NotificationController',
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
        const ctx: AnyObject = {};
        ctx.args = {};
        ctx.args.data = livePushNotification;
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

/*
let lastConfigCheck = 0;
const rssTasks: AnyObject = {};
module.exports.checkRssConfigUpdates = async (
  app: Application,
  runOnInit = false,
) => {
  const CronJob = require('cron').CronJob;
  const configurationRepo: ConfigurationRepository = await app.get(
    'repositories.ConfigurationRepository',
  );

  return async () => {
    const rssNtfctnConfigItems = await configurationRepo.find({
      where: {
        name: 'notification',
        'value.rss': {
          neq: null,
        },
      },
    });
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
          onTick: function () {
            app.models.Rss.findOrCreate(
              {
                where: {
                  serviceName: rssNtfctnConfigItem.serviceName,
                },
              },
              {
                serviceName: rssNtfctnConfigItem.serviceName,
                items: [],
              },
              (
                _err: any,
                lastSavedRssData: {
                  items: any[];
                  lastPoll: Date;
                  save: (arg0: () => void) => void;
                },
              ) => {
                let lastSavedRssItems: any[] = [];
                try {
                  lastSavedRssItems = lastSavedRssData.items;
                } catch (ex) {}
                const feedparser = new FeedParser({
                  addmeta: false,
                });
                module.exports
                  .request({
                    method: 'get',
                    url: rssNtfctnConfigItem.value.rss.url,
                    responseType: 'stream',
                  })
                  .then(function (res: {
                    status: number;
                    data: {pipe: (arg0: any) => void};
                  }) {
                    if (res.status !== 200) {
                      reject(new Error('Bad status code'));
                    } else {
                      res.data.pipe(feedparser);
                    }
                  })
                  .catch(reject);

                feedparser.on('error', function (error: any) {
                  // always handle errors
                  console.info(error);
                });

                const items: any[] = [];
                const ts = new Date();
                feedparser.on('readable', () => {
                  // This is where the action is!
                  const stream = this; // `this` is `feedparser`, which is a stream
                  const meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
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
                    function (
                      arrVal: {[x: string]: {toString: () => any}},
                      othVal: {[x: string]: {toString: () => any}},
                    ) {
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
                      .outdatedItemRetentionGenerations || 1;
                  let lastPollInterval = ts.getTime();
                  try {
                    lastPollInterval =
                      ts.getTime() - lastSavedRssData.lastPoll.getTime();
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
                  newOrUpdatedItems.forEach(function (newOrUpdatedItem: any) {
                    for (const channel in rssNtfctnConfigItem.value
                      .messageTemplates) {
                      if (
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
                        app.get('internalHttpHost') ||
                        rssNtfctnConfigItem.value.httpHost;
                      const url =
                        httpHost + app.get('restApiRoot') + '/notifications';
                      const options = {
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      };
                      module.exports.request.post(
                        url,
                        notificationObject,
                        options,
                      );
                    }
                  });
                  lastSavedRssData.items = items.concat(retainedOutdatedItems);
                  lastSavedRssData.lastPoll = ts;
                  lastSavedRssData.save(() => {
                    resolve(rssTasks);
                  });
                });
              },
            );
          },
          start: true,
          runOnInit: runOnInit,
        });
      }
    });
    lastConfigCheck = Date.now();
  };
};

module.exports.deleteBounces = function (app: Application) {
  return new Promise((resolve, reject) => {
    app.models.Bounce.find(
      {
        where: {
          state: 'active',
          latestNotificationEnded: {
            lt:
              Date.now() -
              app.get('cron').deleteBounces
                .minLapsedHoursSinceLatestNotificationEnded *
                3600000,
          },
          latestNotificationStarted: {
            neq: null,
          },
          bounceMessages: {
            neq: null,
          },
        },
      },
      (err: any, activeBounces: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        let deleteTasks: ((cb: any) => any)[] = [];
        if (activeBounces instanceof Array) {
          deleteTasks = activeBounces.map(activeBounce => {
            return cb => {
              const latestBounceMessageDate =
                activeBounce.bounceMessages[0].date;
              if (
                latestBounceMessageDate > activeBounce.latestNotificationStarted
              ) {
                return cb();
              }
              activeBounce.state = 'deleted';
              activeBounce.save().then(() => cb(), cb);
            };
          });
        }
        parallel(deleteTasks, (err: any, results: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      },
    );
  });
};
*/
