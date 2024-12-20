---
permalink: /docs/config-middleware/
---

# Middleware

_NotifyBC_ pre-installed following [Express](https://expressjs.com/) middleware as defined in _src/middleware.ts_

- [compression](https://www.npmjs.com/package/compression)
- [helmet](https://www.npmjs.com/package/helmet)
- [morgan](https://www.npmjs.com/package/morgan) (disabled by default)

_src/middleware.ts_ contains following default middleware settings

```ts
import path from 'path';
module.exports = {
  all: {
    compression: {},
  },
  apiOnly: {
    helmet: {},
    morgan: {
      params: [
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status ":req[X-Forwarded-For]"',
      ],
      enabled: false,
    },
  },
};
```

_src/middleware.ts_ has following structure

```ts
module.exports = {
  all: {
    '<middlewareName>': {params: [], enabled: <boolean>},
  },
  apiOnly: {
    '<middlewareName>': {params: [], enabled: <boolean>},
  },
};
```

Middleware defined under _all_ applies to both API and web console requests, as opposed to _apiOnly_, which applies to API requests only. _params_ are passed to middleware function as arguments. _enabled_ toggles the middleware on or off.

To change default settings defined in _src/middleware.ts_, create file _src/middleware.local.ts_ or _src/middleware.\<env\>.ts_ to override. For example, to enable access log,

```ts
module.exports = {
  apiOnly: {
    morgan: {
      enabled: true,
    },
  },
};
```
