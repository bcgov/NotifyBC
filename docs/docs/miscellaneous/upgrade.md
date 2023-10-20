---
permalink: /docs/upgrade/
next: /docs/conduct/
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
5. Run `git pull && git checkout tags/v2.x.x -b <branch_name>` from app root, replace _v2.x.x_ with a v2 release, preferably latest, found in GitHub such as _v2.9.0_.
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
2. [Migrate MongoDB data](#migrate-mongodb-data)

### Customize and install Helm chart

Follow [customizations](../installation/#customizations) to create file _helm/values.local.yaml_ containing customized configs such as

- _notify-bc_ configMap
- web route host name and certificates

Then run `helm install` with documented arguments to install a release.

### Migrate MongoDB data

1. backup data from source

   ```sh
   oc exec -i <mongodb-pod> -- bash -c 'mongodump -u "$MONGODB_USER" \
   -p "$MONGODB_PASSWORD" -d $MONGODB_DATABASE --gzip --archive' > notify-bc.gz
   ```

   replace \<mongodb-pod\> with the mongodb pod name.

2. restore backup to target

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
git checkout tags/v3.x.x -b <branch_name>
yarn install && yarn build
```

or, if _NotifyBC_ is deployed to Kubernetes using Helm.

```sh
git pull
git checkout tags/v3.x.x -b <branch_name>
helm upgrade <release-name> -f helm/platform-specific/<platform>.yaml -f helm/values.local.yaml helm
```

Replace _v3.x.x_ with a v3 release, preferably latest, found in GitHub such as _v3.1.2_.

## v3 to v4

v4 introduced following backward incompatible changes that need to be addressed in this order

1. The precedence of config, middleware and datasource files has been changed. Local file takes higher precedence than environment specific file. For example, for config file, the new precedence in ascending order is

   1. default file _/src/config.ts_
   2. environment specific file _/src/config.\<env\>.js_, where \<env\> is determined by environment variable _NODE_ENV_
   3. local file _/src/config.local.js_

   To upgrade, if you have environment specific file, merge its content into the local file, then delete it.

2. Config _smtp_ is changed to _email.smtp_. See [SMTP](../config/email.md#smtp) for example.
3. Config _inboundSmtpServer_ is changed to _email.inboundSmtpServer_. See [Inbound SMTP Server](../config/email.md#inbound-smtp-server) for example.
4. Config _email.inboundSmtpServer.bounce_ is changed to _email.bounce_. See [Bounce](../config/email.md#bounce) for example.
5. Config _notification.handleBounce_ is changed to _email.bounce.enabled_.
6. Config _notification.handleListUnsubscribeByEmail_ is changed to _email.listUnsubscribeByEmail.enabled_. See [List-unsubscribe by Email](../config/email.md#list-unsubscribe-by-email) for example.
7. Config _smsServiceProvider_ is changed to _sms.provider_. See [Provider](../config/sms.md#provider) for example.
8. SMS service provider specific settings defined in config _sms_ are changed to _sms.providerSettings_. See [Provider Settings](../config/sms.md#provider-settings) for example. The config object _sms_ now encapsulates all SMS configs - _provider_, _providerSettings_ and _throttle_.
9. Legacy config _subscription.unsubscriptionEmailDomain_ is removed. If you have it defined in your file _/src/config.local.js_, replace with _email.inboundSmtpServer.domain_.
10. Helm chart added Redis that requires authentication by default. Create a new password in _helm/values.local.yaml_ to facilitate upgrading

```yaml
# in file helm/values.local.yaml
redis:
  auth:
    password: '<secret>'
```

After above changes are addressed, upgrading to v4 is as simple as

```sh
git pull
git checkout tags/v4.x.x -b <branch_name>
yarn install && yarn build
```

or, if _NotifyBC_ is deployed to Kubernetes using Helm.

```sh
git pull
git checkout tags/v4.x.x -b <branch_name>
helm upgrade <release-name> -f helm/platform-specific/<platform>.yaml -f helm/values.local.yaml helm
```

Replace _v4.x.x_ with a v4 release, preferably latest, found in GitHub such as _v4.0.0_.

## v4 to v5

v5 introduced following backward incompatible changes

1. If you use default in-memory database, data in _server/database/data.json_ will not be migrated automatically. Manually migrate if necessary.
2. Update file _src/datasources/db.datasource.local.json_

   1. rename _url_ property to _uri_
   2. for other properties, instead of following [LoopBack MongoDB data source](https://loopback.io/doc/en/lb4/MongoDB-connector.html#creating-a-mongodb-data-source), follow [Mongoose connection options](https://mongoosejs.com/docs/connections.html#options). In particular, _host_, _port_ and _database_ properties are no longer supported. Use _uri_ instead.

   For example, change

   ```json
   {
     "name": "db",
     "connector": "mongodb",
     "url": "mongodb://127.0.0.1:27017/notifyBC"
   }
   ```

   to

   ```json
   {
     "uri": "mongodb://127.0.0.1:27017/notifyBC"
   }
   ```

3. API querying operators have changed. Replace following [Loopback operators](https://loopback.io/doc/en/lb4/Where-filter.html#operators) with corresponding [MongoDB operators](https://www.mongodb.com/docs/manual/reference/operator/query/) at client-side API call.

   | Loopback operators      | MongoDB operators                               |
   | ----------------------- | ----------------------------------------------- |
   | eq                      | $eq                                             |
   | and                     | $and                                            |
   | or                      | $or                                             |
   | gt, gte                 | $gt, $gte                                       |
   | lt, lte                 | $lt, $lte                                       |
   | between                 | (no equivalent, replace with $gt, $and and $lt) |
   | inq, nin                | $in, $nin                                       |
   | near                    | $near                                           |
   | neq                     | $ne                                             |
   | like, nlike             | (replace with $regexp)                          |
   | like, nlike, options: i | (replace with $regexp)                          |
   | regexp                  | $regex                                          |

4. API _order_ filter syntax has changed. Replace syntax from [Loopback](https://loopback.io/doc/en/lb4/Order-filter.html) to [Mongoose](<https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()>) at client-side API call. For example, if your client-side code generates following API call
   ```
   GET http://localhost:3000/api/configurations?filter={"order":["serviceName asc"]}
   ```
   change to either
   ```
   GET http://localhost:3000/api/configurations?filter={"order":[["serviceName","asc"]]}
   ```
   or
   ```
   GET http://localhost:3000/api/configurations?filter={"order":"serviceName"}
   ```
5. Response code of successful bulk patch operation has changed from 200 to 204. No success count is returned. For example, `PATCH http://localhost:3000/api/configurations?where...` returns 204 with empty body upon success. If success count matters, do a `GET .../count` API call first with same _where_ filter.
6. In MongoDB administrator collection, email has changed from case-sensitively unique to case-insensitively unique. Make sure administrator emails differ not just by case.
7. When a subscription is created by anonymous user, the _data_ field is preserved. In earlier versions this field is deleted.
8. Dynamic tokens in subscription confirmation request message and duplicated subscription message are not replaced with subscription data, for example {subscription::...} tokens are left unchanged. Update the template of the two messages if dynamic tokens in them depends on subscription data.

After above changes are addressed, upgrading to v5 is as simple as

```sh
git pull
git checkout tags/v5.x.x -b <branch_name>
yarn install && yarn build
```

or, if _NotifyBC_ is deployed to Kubernetes using Helm.

```sh
git pull
git checkout tags/v5.x.x -b <branch_name>
helm upgrade <release-name> -f helm/platform-specific/<platform>.yaml -f helm/values.local.yaml helm
```

Replace _v5.x.x_ with a v5 release, preferably latest, found in GitHub such as _v5.0.0_.
