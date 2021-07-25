---
permalink: /docs/config-sms/
---

# SMS

## Provider

_NotifyBC_ depends on underlying SMS service providers to deliver SMS messages. The supported service providers are

- [Twilio](https://twilio.com/) (default)
- [Swift](https://www.swiftsmsgateway.com)

Only one service provider can be chosen per installation. To change service provider, add following config to file _/src/config.local.js_

```ts
module.exports = {
  sms: {
    provider: 'swift',
  },
};
```

## Provider Settings

Provider specific settings are defined in config _sms.providerSettings_. You should have an account with the chosen service provider before proceeding.

### Twilio

Add _sms.providerSettings.twilio_ config object to file _/src/config.local.js_

```js
module.exports = {
  sms: {
    providerSettings: {
      twilio: {
        accountSid: '<AccountSid>',
        authToken: '<AuthToken>',
        fromNumber: '<FromNumber>',
      },
    },
  },
};
```

Obtain _\<AccountSid\>_, _\<AuthToken\>_ and _\<FromNumber\>_ from your Twilio account.

### Swift

Add _sms.providerSettings.swift_ config object to file _/src/config.local.js_

```js
module.exports = {
  sms: {
    providerSettings: {
      swift: {
        accountKey: '<accountKey>',
      },
    },
  },
};
```

Obtain _\<accountKey\>_ from your Swift account.

#### Unsubscription by replying a keyword

With Swift short code, sms user can unsubscribe by replying to a sms message with a keyword. The keyword must be pre-registered with Swift.

To enable this feature,

1. Generate a random string, hereafter referred to as _\<randomly-generated-string\>_
2. Add it to _sms.providerSettings.swift.notifyBCSwiftKey_ in file _/src/config.local.js_

   ```js
   module.exports = {
     sms: {
       providerSettings: {
         swift: {
           notifyBCSwiftKey: '<randomly-generated-string>',
         },
       },
     },
   };
   ```

3. Go to Swift web admin console, click _Number Management_ tab
4. Click _Launch_ button next to _Manage Short Code Keywords_
5. Click _Features_ button next to the registered keyword(s). A keyword may have multiple entries. In such case do this for each entry.
6. Click _Redirect To Webpage_ tab in the popup window
7. Enter following information in the tab
   - set _URL_ to _\<NotifyBCHttpHost\>/api/subscriptions/swift_, where _\<NotifyBCHttpHost\>_ is NotifyBC HTTP host name and should be the same as [HTTP Host](../config-httpHost/) config
   - set _Method_ to _POST_
   - set _Custom Parameter 1 Name_ to _notifyBCSwiftKey_
   - set _Custom Parameter 1 Value_ to _\<randomly-generated-string\>_
8. Click _Save Changes_ button and then _Done_

## Throttle

All supported SMS service providers impose request rate limit. _NotifyBC_ by default throttles request rate to 4/sec. To adjust the rate, create following config in file _/src/config.local.js_

```js
module.exports = {
  sms: {
    throttle: {
      // minimum request interval in ms
      minTime: 250,
    },
  },
};
```

When _NotifyBC_ is deployed from source code, by default the rate limit applies to one Node.js process only. If there are multiple processes, i.e. a cluster, the aggregated rate limit is multiplied by the number of processes. To enforce the rate limit across entire cluster, install Redis and add Redis config to _sms.throttle_

```js
module.exports = {
  sms: {
    throttle: {
      /* Redis clustering options */
      datastore: 'ioredis',
      clientOptions: {
        host: '127.0.0.1',
        port: 6379,
      },
    },
  },
};
```

If you installed Redis Sentinel,

```js
module.exports = {
  sms: {
    throttle: {
      /* Redis clustering options */
      datastore: 'ioredis',
      clientOptions: {
        name: 'mymaster',
        sentinels: [{host: '127.0.0.1', port: 26379}],
      },
    },
  },
};
```

Throttle is implemented using [Bottleneck](https://github.com/SGrondin/bottleneck) and [ioredis](https://github.com/luin/ioredis). See their documentations for more configurations.

When _NotifyBC_ is deployed to Kubernetes using Helm, by default throttle uses Redis Sentinel therefore rate limit applies to whole cluster.

To disable throttle, set _sms.throttle.enabled_ to _false_ in file /src/config.local.js

```js
module.exports = {
  sms: {
    throttle: {
      enabled: false,
    },
  },
};
```
