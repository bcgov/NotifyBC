---
permalink: /docs/config-logging/
next: /docs/api-overview/
---

# Logging

Besides request logging using morgan [middleware](middleware.md), _NotifyBC_ also generates application log. Application log has following levels in descending severities

1. fatal
2. error
3. warn
4. log
5. debug
6. verbose

By default the first 4 logging levels are output to console. To override the defaults, set the `loggingLevels` config in _src/config.local.js_. For example, to include debug logs

```js
module.exports = {
  // ...
  loggingLevels: ['fatal', 'error', 'warn', 'log', 'debug'],
};
```
