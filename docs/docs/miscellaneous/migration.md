# Migration Guide

To migrate from v1 to v2

- move _server/config.local.(js|json)_ to _src/_
- move _server/datasources.local.(js|json)_ to _src/datasources/db.datasource.local.(js|json)_
- move _server/middleware.\*.(js|json) to \_src/_ if exists. Reorganize top level properties to _all_ or _apiOnly_, where _all_ applies to all requests including web admin console and _apiOnly_ applies to API requests only. For example, given

  ```js
  module.exports = {
    initial: {
      compression: {},
    },
    'routes:before': {
      morgan: {
        enabled: false,
      },
    },
  };
  ```

  if _compression_ middleware will be applied to all requests and _morgan_ will be applied to API requests only, then change the file to

  ```js
  module.exports = {
    all: {
      compression: {},
    },
    apiOnly: {
      morgan: {
        enabled: false,
      },
    },
  };
  ```

## Incompatible API Changes

### Query parameter array syntax

In v1 array can be specified in query parameter using two formats

1. by enclosing array elements in square brackets such as `&additionalServices=["s1","s2]` in one query parameter
2. by repeating the query parameters, for example `&additionalServices=s1&additionalServices=s2`

In v2 only the latter format is supported.

### Date-Time fields

In v1 date-time fields can be specified in date-only string such as 2020-01-01. In v2 the field must be specified in ISO 8601 extended format such as 2020-01-01T00:00:00Z.

### Return status codes

HTTP response code of success calls to some APIs that don't return important information are changed from 200 to 204

- PATCH /notifications/
- DELETE /notifications/
