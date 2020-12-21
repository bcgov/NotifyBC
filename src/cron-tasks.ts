import {AnyObject} from '@loopback/repository';

const parallel = require('async/parallel');
const FeedParser = require('feedparser');
const request = require('axios');
const _ = require('lodash');

module.exports.request = request;
module.exports.purgeData = async function (...args: any[]) {
  const app = args[0];
  const cronConfig = app.get('cron').purgeData || {};

  return new Promise((resolve, reject) => {
    parallel(
      [
        function (cb: (arg0: any, arg1: any) => any) {
          // delete all non-inApp old notifications
          const retentionDays =
            cronConfig.pushNotificationRetentionDays ||
            cronConfig.defaultRetentionDays;
          app.models.Notification.destroyAll(
            {
              channel: {
                neq: 'inApp',
              },
              created: {
                lt: Date.now() - retentionDays * 86400000,
              },
            },
            function (err: any, data: {count: string | number}) {
              if (!err && data && data.count > 0) {
                console.info(
                  new Date().toLocaleString() +
                    ': Deleted ' +
                    data.count +
                    ' items.',
                );
              }
              return cb(err, data);
            },
          );
        },
        function (cb: (arg0: any, arg1: any) => any) {
          // delete all expired inApp notifications
          const retentionDays =
            cronConfig.expiredInAppNotificationRetentionDays ||
            cronConfig.defaultRetentionDays;
          app.models.Notification.destroyAll(
            {
              channel: 'inApp',
              validTill: {
                lt: Date.now() - retentionDays * 86400000,
              },
            },
            function (err: any, data: {count: string | number}) {
              if (!err && data && data.count > 0) {
                console.info(
                  new Date().toLocaleString() +
                    ': Deleted ' +
                    data.count +
                    ' items.',
                );
              }
              return cb(err, data);
            },
          );
        },
        function (cb: (arg0: any, arg1: any) => any) {
          // delete all deleted inApp notifications
          app.models.Notification.destroyAll(
            {
              channel: 'inApp',
              state: 'deleted',
            },
            function (err: any, data: {count: string | number}) {
              if (!err && data && data.count > 0) {
                console.info(
                  new Date().toLocaleString() +
                    ': Deleted ' +
                    data.count +
                    ' items.',
                );
              }
              return cb(err, data);
            },
          );
        },
        function (cb: (arg0: any, arg1: any) => any) {
          // delete all old non-confirmed subscriptions
          const retentionDays =
            cronConfig.nonConfirmedSubscriptionRetentionDays ||
            cronConfig.defaultRetentionDays;
          app.models.Subscription.destroyAll(
            {
              state: {
                neq: 'confirmed',
              },
              updated: {
                lt: Date.now() - retentionDays * 86400000,
              },
            },
            function (err: any, data: {count: string | number}) {
              if (!err && data && data.count > 0) {
                console.info(
                  new Date().toLocaleString() +
                    ': Deleted ' +
                    data.count +
                    ' items.',
                );
              }
              return cb(err, data);
            },
          );
        },
        function (cb: (arg0: any, arg1: any) => any) {
          // purge deleted bounces
          const retentionDays =
            cronConfig.deletedBounceRetentionDays ||
            cronConfig.defaultRetentionDays;
          app.models.Bounce.destroyAll(
            {
              state: 'deleted',
              updated: {
                lt: Date.now() - retentionDays * 86400000,
              },
            },
            function (err: any, data: {count: string | number}) {
              if (!err && data && data.count > 0) {
                console.info(
                  new Date().toLocaleString() +
                    ': Deleted ' +
                    data.count +
                    ' items.',
                );
              }
              return cb(err, data);
            },
          );
        },
      ],
      function (err: any, results: unknown) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      },
    );
  });
};

module.exports.dispatchLiveNotifications = function (...args: any[]) {
  const app = args[0];
  return new Promise((resolve, reject) => {
    app.models.Notification.find(
      {
        where: {
          state: 'new',
          channel: {
            neq: 'inApp',
          },
          invalidBefore: {
            lt: Date.now(),
          },
        },
      },
      function (err: any, livePushNotifications: any) {
        if (
          err ||
          (livePushNotifications && livePushNotifications.length === 0)
        ) {
          // eslint-disable-next-line no-unused-expressions
          err ? reject(err) : resolve(livePushNotifications);
          return;
        }
        const notificationTasks = livePushNotifications.map(
          function (livePushNotification: {
            state: string;
            asyncBroadcastPushNotification: boolean | undefined;
            save: (arg0: (errSave: any) => any) => void;
          }) {
            return function (cb: (arg0: null, arg1?: undefined) => any) {
              livePushNotification.state = 'sending';
              if (
                livePushNotification.asyncBroadcastPushNotification ===
                undefined
              ) {
                livePushNotification.asyncBroadcastPushNotification = true;
              }
              livePushNotification.save(function (errSave) {
                if (errSave) {
                  return cb(null, errSave);
                }
                const ctx: AnyObject = {};
                ctx.args = {};
                ctx.args.data = livePushNotification;
                app.models.Notification.preCreationValidation(
                  ctx,
                  function (errPreCreationValidation: any) {
                    if (errPreCreationValidation) {
                      return cb(errPreCreationValidation);
                    }
                    app.models.Notification.dispatchNotification(
                      ctx,
                      livePushNotification,
                      function (errDispatchNotification: undefined) {
                        return cb(null, errDispatchNotification);
                      },
                    );
                  },
                );
              });
            };
          },
        );
        parallel(notificationTasks, function (err: any, results: unknown) {
          err ? reject(err) : resolve(results);
          return;
        });
      },
    );
  });
};

let lastConfigCheck = 0;
const rssTasks: AnyObject = {};
module.exports.checkRssConfigUpdates = function (...args: any[]) {
  const app = args[0];
  const CronJob = require('cron').CronJob;
  let runOnInit = false;
  if (args.length > 1) {
    runOnInit = args[args.length - 1];
  }
  return new Promise((resolve, reject) => {
    app.models.Configuration.find(
      {
        where: {
          name: 'notification',
          'value.rss': {
            neq: null,
          },
        },
      },
      function (_err: any, rssNtfctnConfigItems: any[]) {
        for (var key in rssTasks) {
          if (!rssTasks.hasOwnProperty(key)) {
            continue;
          }

          const rssNtfctnConfigItem = rssNtfctnConfigItems.find(function (e) {
            return e.id.toString() === key;
          });

          if (
            !rssNtfctnConfigItem ||
            rssNtfctnConfigItem.updated.getTime() > lastConfigCheck
          ) {
            rssTasks[key].stop();
            delete rssTasks[key];
          }
        }
        rssNtfctnConfigItems.forEach(function (rssNtfctnConfigItem) {
          if (!rssTasks[rssNtfctnConfigItem.id]) {
            rssTasks[rssNtfctnConfigItem.id] = new CronJob({
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
                      const fieldsToCheckForUpdate = rssNtfctnConfigItem.value
                        .rss.fieldsToCheckForUpdate || ['pubDate'];
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
                          if (
                            !rssNtfctnConfigItem.value.rss.includeUpdatedItems
                          ) {
                            return (
                              arrVal[itemKeyField] === othVal[itemKeyField]
                            );
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
                      newOrUpdatedItems.forEach(function (
                        newOrUpdatedItem: any,
                      ) {
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
                              rssNtfctnConfigItem.value.messageTemplates[
                                channel
                              ],
                            data: newOrUpdatedItem,
                            httpHost: rssNtfctnConfigItem.value.httpHost,
                          };
                          const httpHost =
                            app.get('internalHttpHost') ||
                            rssNtfctnConfigItem.value.httpHost;
                          const url =
                            httpHost +
                            app.get('restApiRoot') +
                            '/notifications';
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
                      lastSavedRssData.items = items.concat(
                        retainedOutdatedItems,
                      );
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
      },
    );
  });
};

module.exports.deleteBounces = function (...args: any[]) {
  const app = args[0];
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
