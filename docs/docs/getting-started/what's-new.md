---
permalink: /docs/what's-new/
next: /docs/config-overview/
---

# What's New

_NotifyBC_ uses [semantic versioning](https://semver.org/).

## v6

- Replaced Bottleneck with BullMQ
- Redis is required
- Bitnami Redis Helm chart is updated from version 16.13.2 to 20.4.1, with corresponding Redis from 6.2.7 to 7.4.1
- Bitnami MongoDB Helm chart is updated from version 14.3.2 to 16.3.3, with corresponding MongoDB from 7.0.4 to 8.0.4
- Added `loggingLevels` config

## v5

### v5.1.0

- Issue [#85](https://github.com/bcgov/NotifyBC/issues/85): added health check
- Changed package manager from yarn to npm

### v5.0.0

See [Upgrade Guide](../upgrade/#v4-to-v5) for more information.

- Runs on _NestJS_
- Bitnami MongoDB Helm chart is updated from version 10.7.1 to 14.3.2, with corresponding MongoDB from 4.4 to 7.0.4
- Bitnami Redis Helm chart is updated from version 14.7.2 to 16.13.2, with corresponding Redis from 6.2.4 to 6.2.7

::: tip Why v5?
_NotifyBC_ was built on [LoopBack](https://loopback.io/) since the beginning. While _Loopback_ is an awesome framework at the time, it is evident by 2022 _Loopback_ is no longer actively maintained

1. features such as GraphQL have been in experimental state for years
2. recent commits are mostly chores rather than enhancements
3. core developers have ceased to contribute

To pave the way for future growth, switching platform becomes necessary. _NestJS_ was chosen because

1. both _NestJS_ and _Loopback_ are server-side Node.js frameworks
2. _NestJS_ has the closest feature set as _Loopback_. To a large extent _NestJS_ is a superset of _Loopback_
3. _NestJS_ incorporates more technologies

:::

## v4

### v4.1.0

- Issue [#50](https://github.com/bcgov/NotifyBC/issues/50): Email message throttle
- applied sms throttle to all sms messages rather than just broadcast push notification.
- docs updates

### v4.0.0

See [v3 to v4 upgrade guide](../upgrade/#v3-to-v4) for more information.

- Issue [#48](https://github.com/bcgov/NotifyBC/issues/48): SMS message throttle
- Re-ordered config file precedence
- Re-organized Email and SMS configs
- docs updates

## v3

### v3.1.0

- Issue [#45](https://github.com/bcgov/NotifyBC/issues/45): Reliability - Log skipped dispatches for broadcast push notifications
- docs updates

### v3.0.0

See [v2 to v3 upgrade guide](../upgrade/#v2-to-v3) for more information.

- Reliability improvements - issues [#36](https://github.com/bcgov/NotifyBC/issues/36),[#37](https://github.com/bcgov/NotifyBC/issues/37),[#38](https://github.com/bcgov/NotifyBC/issues/38),[#39](https://github.com/bcgov/NotifyBC/issues/39),[#40](https://github.com/bcgov/NotifyBC/issues/40),[#41](https://github.com/bcgov/NotifyBC/issues/41),[#42](https://github.com/bcgov/NotifyBC/issues/42)
- docs updates

## v2

### v2.9.0

- Issue [#34](https://github.com/bcgov/NotifyBC/issues/34): Helm - add k8s cronJob to backup MongoDB
- docs updates

### v2.8.0

- Issue [#28](https://github.com/bcgov/NotifyBC/issues/28): Allow subscription data be used by mail merge dynamic tokens
- Issue [#32](https://github.com/bcgov/NotifyBC/issues/32): Allow escape mail merge delimiter
- docs updates

### v2.7.0

- Issue [#26](https://github.com/bcgov/NotifyBC/issues/26): Allow filter specified in a notification
- docs updates

### v2.6.0

- Helm chart updates
- docs updates

### v2.5.0

- added [helm chart](https://github.com/bcgov/NotifyBC/tree/main/helm). See [OpenShift template to Helm upgrade guide](../miscellaneous/upgrade.md#openshift-template-to-helm)
- docs updates

### v2.4.0

- Issue [#16](https://github.com/bcgov/NotifyBC/issues/16): Support client certificate authentication
- misc web console adjustments
- docs updates

### v2.3.0

- Issue [#15](https://github.com/bcgov/NotifyBC/issues/15): Support OIDC authentication for both admin and non-admin user
- misc web console adjustments
- docs updates

### v2.2.0

- Issue [#14](https://github.com/bcgov/NotifyBC/issues/14): Support Administrator login, changing password, obtain access token in web console
- misc web console adjustments
- docs updates

### v2.1.0

- Issue [#13](https://github.com/bcgov/NotifyBC/issues/13): Upgraded Vuetify from v0.16.9 to v2.4.3
- misc web console adjustments
- docs updates

### v2.0.0

See [Upgrade Guide](../upgrade/#v1-to-v2) for more information.

- Runs on LoopBack v4
- All code is converted to TypeScript
- Upgraded [OAS](https://swagger.io/specification/) from v2 to v3
- Docs is converted from Jekyll to VuePress

::: tip Why v2?
_NotifyBC_ has been built on Node.js [LoopBack](https://loopback.io/) framework since 2016. LoopBack v4, which was released in 2019, is backward incompatible. To keep software stack up-to-date, unless rewriting from scratch, it is necessary to port _NotifyBC_ to LoopBack v4. Great care has been taken to minimize upgrade effort.
:::
