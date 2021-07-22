---
permalink: /docs/config-cronJobs/
---

# Cron Jobs

_NotifyBC_ runs several cron jobs described below. These jobs are controlled by sub-properties defined in config object _cron_. To change config, create the object and properties in file _/src/config.local.js_.

By default cron jobs are enabled. In a multi-node deployment, cron jobs should only run on the [master node](../config-nodeRoles/) to ensure single execution.

All cron jobs have a property named <a name="timeSpec"></a>_timeSpec_ with the value of a space separated fields conforming to [unix crontab format](<https://www.freebsd.org/cgi/man.cgi?crontab(5)>) with an optional left-most seconds field. See [allowed ranges](https://github.com/kelektiv/node-cron#cron-ranges) of each field.

## Purge Data

This cron job purges old notifications, subscriptions and notification bounces. The default frequency of cron job and retention policy are defined by _cron.purgeData_ config object in file _/src/config.ts_

```ts
module.exports = {
  cron: {
    purgeData: {
      // daily at 1am
      timeSpec: '0 0 1 * * *',
      pushNotificationRetentionDays: 30,
      expiredInAppNotificationRetentionDays: 30,
      nonConfirmedSubscriptionRetentionDays: 30,
      deletedBounceRetentionDays: 30,
      expiredAccessTokenRetentionDays: 30,
      defaultRetentionDays: 30,
    },
  },
};
```

where

- _pushNotificationRetentionDays_: the retention days of push notifications
- _expiredInAppNotificationRetentionDays_: the retention days of expired inApp notifications
- _nonConfirmedSubscriptionRetentionDays_: the retention days of non-confirmed subscriptions, i.e. all unconfirmed and deleted subscriptions
- _deletedBounceRetentionDays_: the retention days of deleted notification bounces
- expiredAccessTokenRetentionDays: the retention days of expired access tokens
- _defaultRetentionDays_: if any of the above retention day config item is omitted, default retention days is used as fall back.

To change a config item, set the config item in file _/src/config.local.js_. For example, to run cron jobs at 2am daily, add following object to _/src/config.local.js_

```js
module.exports = {
  cron: {
    purgeData: {
      timeSpec: '0 0 2 * * *',
    },
  },
};
```

## Dispatch Live Notifications

This cron job sends out future-dated notifications when the notification becomes current. The default config is defined by _cron.dispatchLiveNotifications_ config object in file _/src/config.ts_

```ts
module.exports = {
  cron: {
    dispatchLiveNotifications: {
      // minutely
      timeSpec: '0 * * * * *',
    },
  },
};
```

## Check Rss Config Updates

This cron job monitors RSS feed notification dynamic config items. If a config item is created, updated or deleted, the cron job starts, restarts, or stops the RSS-specific cron job. The default config is defined by _cron.checkRssConfigUpdates_ config object in file _/src/config.ts_

```ts
module.exports = {
  cron: {
    checkRssConfigUpdates: {
      // minutely
      timeSpec: '0 * * * * *',
    },
  },
};
```

Note _timeSpec_ doesn't control the RSS poll frequency (which is defined in dynamic configs and is service specific), instead it only controls the frequency to check for dynamic config changes.

## Delete Notification Bounces

This cron job deletes notification bounces if the latest notification is deemed delivered successfully. The criteria of successful delivery are

1. No bounce received since the latest notification started dispatching, and
2. a configured time span has lapsed since the latest notification finished dispatching

The default config is defined by _cron.deleteBounces_ config object in file _/src/config.ts_

```ts
module.exports = {
  cron: {
    deleteBounces: {
      // hourly
      timeSpec: '0 0 * * * *',
      minLapsedHoursSinceLatestNotificationEnded: 1,
    },
  },
};
```

where

- _minLapsedHoursSinceLatestNotificationEnded_ is the time span

## Re-dispatch Broadcast Push Notifications

This cron job re-dispatches a broadcast push notifications when original request failed. It is part of [guaranteed broadcast push dispatch processing](../config/notification.md#guaranteed-broadcast-push-dispatch-processing)

The default config is defined by _cron.reDispatchBroadcastPushNotifications_ config object in file _/src/config.ts_

```ts
module.exports = {
  cron: {
    reDispatchBroadcastPushNotifications: {
      // minutely
      timeSpec: '0 * * * * *',
    },
  },
};
```

## Clear Redis Datastore

This cron job clears Redis datastore, including updating settings, used for SMS [throttle](../config/sms.md#throttle). The job is enabled only if Redis is used. Datastore is cleared only when there is no SMS broadcast push notifications in _sending_ state. Without this cron job, updated throttle settings in config file will never take effect, and staled jobs in Redis datastore will not be cleaned up.

The default config is defined by _cron.clearRedisDatastore_ config object in file _/src/config.ts_

```ts
module.exports = {
  cron: {
    clearRedisDatastore: {
      // hourly
      timeSpec: '0 0 * * * *',
    },
  },
};
```
