---
permalink: /docs/upgrade/
---

# Upgrade Guide

## v1 to v2

Upgrading _NotifyBC_ from v1 to v2 involves two steps

1. [Update your client code](#update-your-client-code) if needed
2. [Upgrade _NotifyBC_ server](#upgrade-notifybc-server)

### Update your client code

_NotifyBC_ v2 introduced backward incompatible API changes documented in the rest of this section. If your client code will be impacted by the changes, update your code to address the incompatibility first.

#### Query parameter array syntax

In v1 array can be specified in query parameter using two formats

1. by enclosing array elements in square brackets such as `&additionalServices=["s1","s2]` in one query parameter
2. by repeating the query parameters, for example `&additionalServices=s1&additionalServices=s2`

In v2 only the latter format is supported.

#### Date-Time fields

In v1 date-time fields can be specified in date-only string such as 2020-01-01. In v2 the field must be specified in ISO 8601 extended format such as 2020-01-01T00:00:00Z.

#### Return status codes

HTTP response code of success calls to following APIs are changed from 200 to 204

- most PATCH by id requests except for [Update a Subscription
  ](../api-subscription/#update-a-subscription)
- most PUT by id requests except for [Replace a Subscription](../api-subscription/#replace-a-subscription)
- most DELETE by id requests except for [Delete a Subscription (unsubscribing)](../api-subscription/#delete-a-subscription-unsubscribing)

#### Administrator API

- Password is saved to _Administrator_ in v1 and _UserCredential_ in v2. Password is not migrated. New password has to be created by following [Create/Update an Administrator's UserCredential
  ](../api-administrator/#create-update-an-administrator-s-usercredential).
- [Complexity rules](../api/administrator.md#sign-up) have been applied to passwords.
- [login](../api-administrator/#login) API is open to non-admin

### Upgrade _NotifyBC_ server

The procedure to upgrade from v1 to v2 depends on how v1 was installed.

#### Source-code Installation

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

#### OpenShift Installation

1. Run
   ```sh
   git clone https://github.com/bcgov/NotifyBC.git
   cd NotifyBC
   ```
2. Run

   ```sh
   oc delete bc/notify-bc
   oc process -f .openshift-templates/notify-bc-build.yml | oc create -f-
   ```

   ignore _AlreadyExists_ errors

3. Follow OpenShift [Build](../installation/#build)
4. For each environment,

   1. run

      ```sh
      oc project <yourprojectname-<env>>
      oc delete dc/notify-bc-app dc/notify-bc-cron
      oc process -f .openshift-templates/notify-bc.yml | oc create -f-
      ```

      ignore _AlreadyExists_ errors

   2. copy value of environment variable _MONGODB_USER_ from _mongodb_ deployment config to the same environment variable of deployment config _notify-bc-app_ and _notify-bc-cron_, replacing existing value
   3. remove _middleware.local.json_ from configMap _notify-bc_
   4. add _middleware.local.js_ to configMap _notify-bc_ with following content
      ```js
      module.exports = {
        apiOnly: {
          morgan: {
            enabled: false,
          },
        },
      };
      ```
   5. Follow OpenShift [Deploy](../installation/#deploy) or [Change Propagation](../installation/#change-propagation) to tag image

## OpenShift template to Helm

Upgrading _NotifyBC_ on OpenShift created from OpenShift template to Helm involves 2 steps

1. [Customize and Install Helm chart](#customize-and-install-helm-chart)
2. [Upgrade MongoDB data](#upgrade-mongodb-data)

### Customize and install Helm chart

Follow [customizations](../installation/#customizations) to create file _helm/values.local.yaml_ containing customized configs such as

- _notify-bc_ configMap
- web route host name and certificates

Then run `helm install` with documented arguments to install a release.

### Upgrade MongoDB data

To backup data from source

```sh
oc exec -i <mongodb-pod> -- bash -c 'mongodump -u "$MONGODB_USER" \
-p "$MONGODB_PASSWORD" -d $MONGODB_DATABASE --gzip --archive' > notify-bc.gz
```

replace \<mongodb-pod\> with the mongodb pod name.

To restore backup to target

```sh
cat notify-bc.gz | oc exec -i <mongodb-pod-0> -- \
bash -c 'mongorestore -u "$MONGODB_USERNAME" -p"$MONGODB_PASSWORD" \
--uri="mongodb://$K8S_SERVICE_NAME" --db $MONGODB_DATABASE --gzip --drop --archive'
```

replace \<mongodb-pod-0\> with the first pod name in the mongodb stateful set.

If both source and target are in the same OpenShift cluster, the two operations can be
combined into one

```sh
oc exec -i <mongodb-pod> -- bash -c 'mongodump -u "$MONGODB_USER" \
-p "$MONGODB_PASSWORD" -d $MONGODB_DATABASE --gzip --archive' | \
oc exec -i <mongodb-pod-0> -- bash -c \
'mongorestore -u "$MONGODB_USERNAME" -p"$MONGODB_PASSWORD" \
--uri="mongodb://$K8S_SERVICE_NAME" --db $MONGODB_DATABASE --gzip --drop --archive'
```

## v2 to v3

v3 introduced following backward incompatible changes

1. Changed output-only fields _failedDispatches_ and _successDispatches_ to _dispatch.failed_ and _dispatch.successful_ respectively in _Notification_ api. If your client app depends on the fields, change accordingly.
2. Changed config _notification.logSuccessfulBroadcastDispatches_ to _notification.guaranteedBroadcastPushDispatchProcessing_ and reversed default value from _false_ to _true_. If you don't want _NotifyBC_ guarantees processing all subscriptions to a broadcast push notification in a node failure resilient way, perhaps for performance reason, set the value to _false_ in file _/src/config.local.js_.

After above changes are addressed, upgrading to v3 is as simple as

```sh
git pull
yarn install && yarn build
```
