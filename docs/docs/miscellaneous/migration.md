# Migration Guide

To migrate from v1 to v2

- move _server/config.local.(js|json)_ to _src/config.local.(js|json)_
- move _server/datasources.local.(js|json)_ to _src/datasources/db.datasource.local.(js|json)_

## Incompatible API Changes

### Query parameter array syntax

In v1 array can be specified in query parameter using two formats

1. by enclosing array elements in square brackets such as `&additionalServices=["s1","s2]` in one query parameter
2. by repeating the query parameters, for example `&additionalServices=s1&additionalServices=s2`

In v2 only the latter format is supported.
