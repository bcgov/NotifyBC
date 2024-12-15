---
permalink: /docs/config-queue/
---

# Queue

_NotifyBC_ uses [BullMQ](https://docs.bullmq.io/) for notification processing, email and sms throttling. BullMQ is built on top of Redis. Redis connection is defined in config _queue.connection_ with following defaults

```js
module.exports = {
  // ...
  queue: {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
};
```

To override the defaults, set the config in _src/config.local.js_.

If you deployed _NotifyBC_ using Helm chart, this config is taken care of.
