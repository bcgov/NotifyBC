---
permalink: /docs/config-notification/
---

# Notification

Configs in this section customize the handling of notification request or generating notifications from RSS feeds. They are all sub-properties of config object _notification_. Service-agnostic configs are static and service-dependent configs are dynamic.

## RSS Feeds

_NotifyBC_ can generate broadcast push notifications automatically by polling RSS feeds periodically and detect changes by comparing with an internally maintained history list. The polling frequency, RSS url, RSS item change detection criteria, and message template can be defined in dynamic configs.

::: danger Only first page is retrieved for paginated RSS feeds
If a RSS feed is paginated, <i>NotifyBC</i> only retrieves the first page rather than auto-fetch subsequent pages. Hence paginated RSS feeds should be sorted descendingly by last modified timestamp. Refresh interval should be adjusted small enough such that all new or updated items are contained in first page.
:::

For example, to notify subscribers of _myService_ on updates to feed _http://my-serivce/rss_, create following config item using [POST configuration API](../api-config/#create-a-configuration)

```json
{
  "name": "notification",
  "serviceName": "myService",
  "value": {
    "rss": {
      "url": "http://my-serivce/rss",
      "timeSpec": "* * * * *",
      "itemKeyField": "guid",
      "outdatedItemRetentionGenerations": 1,
      "includeUpdatedItems": true,
      "fieldsToCheckForUpdate": ["title", "pubDate", "description"]
    },
    "httpHost": "http://localhost:3000",
    "messageTemplates": {
      "email": {
        "from": "no_reply@invlid.local",
        "subject": "{title}",
        "textBody": "{description}",
        "htmlBody": "{description}"
      },
      "sms": {
        "textBody": "{description}"
      }
    }
  }
}
```

The config items in the _value_ field are

- rss
  - url: RSS url
  - <a name="timeSpec"></a>timeSpec: RSS poll frequency, a space separated fields conformed to [unix crontab format](<https://www.freebsd.org/cgi/man.cgi?crontab(5)>) with an optional left-most seconds field. See [allowed ranges](https://github.com/kelektiv/node-cron#cron-ranges) of each field
  - itemKeyField: rss item's unique key field to identify new items. By default _guid_
  - outdatedItemRetentionGenerations: number of last consecutive polls from which results an item has to be absent before the item can be removed from the history list. This config is designed to prevent multiple notifications triggered by the same item because RSS poll returns inconsistent results, usually due to a combination of pagination and lack of sorting. By default 1, meaning the history list only keeps the last poll result
  - includeUpdatedItems: whether to notify also updated items or just new items. By default _false_
  - fieldsToCheckForUpdate: list of fields to check for updates if _includeUpdatedItems_ is _true_. By default _["pubDate"]_
- httpHost: the http protocol, host and port used by [mail merge](../overview/#mail-merge). If missing, the value is auto-populated based on the REST request that creates this config item.
- messageTemplates: channel-specific message templates with channel name as the key. _NotifyBC_ generates a notification for each channel specified in the message templates. Message template fields are the same as those in [notification api](../api-notification/#field-message). Message template fields support dynamic token.

## Broadcast Push Notification Task Concurrency

To achieve horizontal scaling, when a broadcast push notification request is received, _NotifyBC_ divides subscribers into chunks and submits a BullMQ job for each chunk. The chunk size is defined by config _broadcastSubscriberChunkSize_. All subscribers in a chunk are processed concurrently.

The default value for _broadcastSubscriberChunkSize_ is defined in _src/config.ts_

```ts
module.exports = {
  notification: {
    broadcastSubscriberChunkSize: 1000,
  },
};
```

To customize, create the config with updated value in file _src/config.local.js_.

::: tip When to adjust chunk size?

Redis memory footprint is inversely proportional to chunk size. Increase chunk size if Redis memory usage is approaching physical limit.

:::

## Broadcast Push Notification Custom Filter Functions

::: warning Advanced Topic

Defining custom function requires knowledge of JavaScript and understanding how external libraries are added and referenced in Node.js. Setting a development environment to test the custom function is also recommended.

:::

To support rule-based notification event filtering, _NotifyBC_ uses a [modified version](https://github.com/f-w/jmespath.js) of [jmespath](http://jmespath.org/) to implement json query. The modified version allows defining custom functions that can be used in [broadcastPushNotificationFilter](../api-subscription#broadcastPushNotificationFilter) field of subscription API and [broadcastPushNotificationSubscriptionFilter](../api-notification#broadcastPushNotificationSubscriptionFilter) field of subscription API. The functions must be implemented using JavaScript in config _notification.broadcastCustomFilterFunctions_. The functions can even be _async_. For example, the case-insensitive string matching function _contains_ci_ shown in the example of that field can be created in file _src/config.local.js_

```js
const _ = require('lodash')
module.exports = {
  ...
  notification: {
    broadcastCustomFilterFunctions: {
      contains_ci: {
        _func: async function(resolvedArgs) {
          if (!resolvedArgs[0] || !resolvedArgs[1]) {
            return false
          }
          return _.toLower(resolvedArgs[0]).indexOf(_.toLower(resolvedArgs[1])) >= 0
        },
        _signature: [
          {
            types: [2]
          },
          {
            types: [2]
          }
        ]
      }
    }
  }
}
```

Consult jmespath.js source code on the [functionTable syntax](https://github.com/f-w/jmespath.js/blob/master/jmespath.js#L1127) and [type constants](https://github.com/f-w/jmespath.js/blob/master/jmespath.js#L132) used by above code. Note the function can use any Node.js modules (_[lodash](https://lodash.com/)_ in this case).

::: tip install additional Node.js modules
The recommended way to install additional Node.js modules is by running command <i><a href="https://docs.npmjs.com/cli/install">npm install &lt;your_module&gt;</a></i> from the directory one level above <i>NotifyBC</i> root. For example, if
<i>NotifyBC</i> is installed on <i>/data/notifyBC</i>, then run the command from directory <i>/data</i>. The command will then install the module to <i>/data/node_modules/&lt;your_module&gt;</i>.

:::

## Guaranteed Broadcast Push Dispatch Processing

As a major enhancement in v3, by default _NotifyBC_ guarantees all subscribers
of a broadcast push notification will be processed in spite of
node failures during dispatching. Node failure is a concern because
the time takes to dispatch broadcast push notification is proportional
to number of subscribers, which is potentially large.

_NotifyBC_ is not only resilient to failures of _NotifyBC_ application nodes, but also
entire _Redis_ cluster.

The guarantee is achieved by

1. logging the dispatch result to database individually right after each dispatch
2. when subscribers are divided into chunks and a chunk job fails, the job is re-processed by BullMQ
3. a chunk job periodically updates the notification _updated_ timestamp field as heartbeat
4. if redis cluster fails, a cron job detects the failure from the stale timestamp, and re-submits the notification request

Guaranteed processing doesn't mean notification will be dispatched to every
intended subscriber, however. Dispatch can still be rejected by smtp/sms
server. Furthermore, even if dispatch is successful,
it only means the sending is successful. It doesn't guarantee the
recipient receives the notification. [Bounce](../config/email.md#bounce)
may occur for a successful dispatch, for instance; or the recipient may not
read the message.

The guarantee comes at a performance penalty because result of each
dispatch is written to database one by one, taking a toll on the database.
It should be noted that the [benchmarks](../miscellaneous/benchmarks.md) were conducted
without the guarantee.

If performance is a higher priority to you, disable both the guarantee and
bounce handling by setting config
_notification.guaranteedBroadcastPushDispatchProcessing_ and _email.bounce.enabled_ to
_false_ in file _src/config.local.js_

```js
module.exports = {
  notification: {
    guaranteedBroadcastPushDispatchProcessing: false,
  },
  email: {
    bounce: { enabled: false },
  },
};
```

In such case only failed dispatches are written to _dispatch.failed_ field of the notification.

### Also log skipped dispatches for broadcast push notifications

When _guaranteedBroadcastPushDispatchProcessing_ is _true_, by default only successful and failed dispatches are logged, along with dispatch candidates. Dispatches that are skipped by filters defined at subscription (_broadcastPushNotificationFilter_) or notification (_broadcastPushNotificationSubscriptionFilter_) are not logged for performance reason. If you also want skipped dispatches to be logged to _dispatch.skipped_ field of the notification, set _logSkippedBroadcastPushDispatches_ to _true_ in file _src/config.local.js_

```js
module.exports = {
  ...
  notification: {
    ...
    logSkippedBroadcastPushDispatches: true,
  }
}
```

Setting _logSkippedBroadcastPushDispatches_ to _true_ only has effect when _guaranteedBroadcastPushDispatchProcessing_ is _true_.
