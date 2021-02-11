---
permalink: /docs/migration/
---

# Migration Guide

Migrating _NotifyBC_ from v1 to v2 involves two steps

1. Update your client code if needed
2. Migrate _NotifyBC_ server

## Update client code

_NotifyBC_ v2 introduced backward incompatible API changes documented in the rest of this section. If your client code will be impacted by the changes, update your code to address the incompatibility first.

### Query parameter array syntax

In v1 array can be specified in query parameter using two formats

1. by enclosing array elements in square brackets such as `&additionalServices=["s1","s2]` in one query parameter
2. by repeating the query parameters, for example `&additionalServices=s1&additionalServices=s2`

In v2 only the latter format is supported.

### Date-Time fields

In v1 date-time fields can be specified in date-only string such as 2020-01-01. In v2 the field must be specified in ISO 8601 extended format such as 2020-01-01T00:00:00Z.

### Return status codes

HTTP response code of success calls to following APIs are changed from 200 to 204

- most PATCH by id requests except for [Update a Subscription
  ](../api-subscription/#update-a-subscription)
- most PUT by id requests except for [Replace a Subscription](../api-subscription/#replace-a-subscription)
- most DELETE by id requests except for [Delete a Subscription (unsubscribing)](../api-subscription/#delete-a-subscription-unsubscribing)

### Administrator API

- Password is saved to _Administrator_ in v1 and _UserCredential_ in v2. Password is not migrated. New password has to be created by following [Create/Update an Administrator's UserCredential
  ](../api-administrator/#create-update-an-administrator-s-usercredential).
- [Complexity rules](../api/administrator.md#sign-up) have been applied to passwords.
- [login](../api-administrator/#login) API is open to non-admin

## Migrate _NotifyBC_ server

The procedure to migrate from v1 to v2 depends on how v1 was installed.

### Source-code Installation

1. Stop _NotifyBC_
2. Backup app root and database!
3. Make sure current branch is tracking correct remote branch
   ```sh
   git remote set-url origin https://github.com/bcgov/NotifyBC.git
   git branch -u origin/main
   ```
4. Make a note of any extra packages added to _package.json_
5. Run `git pull` from app root
6. Make sure _version_ property in _package.json_ is _2.x.x_
7. Add back extra packages noted in step 4
8. Move _server/config.(local|dev|production).(js|json)_ to _src/_ if exists
9. Move _server/datasources.(local|dev|production).(js|json)_ to _src/datasources/db.datasource.(local|dev|production).(js|json)_ if exists. Notice the file name has changed.
10. Move _server/middleware.\*.(js|json)_ to _src/_ if exists. Reorganize top level properties to _all_ or _apiOnly_, where _all_ applies to all requests including web console and _apiOnly_ applies to API requests only. For example, given

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

11. Run

```sh
yarn install && yarn build
```

11. Start server by running `yarn start` or Windows Service

### OpenShift Installation

1. Run
   ```sh
   git clone https://github.com/bcgov/NotifyBC.git
   cd NotifyBC
   ```
2. Follow OpenShift [Build](../installation/#build)
3. Follow OpenShift [Deploy](../installation/#deploy)
4. Follow OpenShift [Change Propagation](../installation/#change-propagation)
