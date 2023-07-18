---
permalink: /docs/what's-new/
next: /docs/config-overview/
---

# What's New

_NotifyBC_ uses [semantic versioning](https://semver.org/).

## v4.1.0

- Issue [#50](https://github.com/bcgov/NotifyBC/issues/50): Email message throttle
- applied sms throttle to all sms messages rather than just broadcast push notification.
- docs updates

## v4.0.0

See [v3 to v4 upgrade guide](../upgrade/#v3-to-v4) for more information.

- Issue [#48](https://github.com/bcgov/NotifyBC/issues/48): SMS message throttle
- Re-ordered config file precedence
- Re-organized Email and SMS configs
- docs updates

## v3.1.0

- Issue [#45](https://github.com/bcgov/NotifyBC/issues/45): Reliability - Log skipped dispatches for broadcast push notifications
- docs updates

## v3.0.0

See [v2 to v3 upgrade guide](../upgrade/#v2-to-v3) for more information.

- Reliability improvements - issues [#36](https://github.com/bcgov/NotifyBC/issues/36),[#37](https://github.com/bcgov/NotifyBC/issues/37),[#38](https://github.com/bcgov/NotifyBC/issues/38),[#39](https://github.com/bcgov/NotifyBC/issues/39),[#40](https://github.com/bcgov/NotifyBC/issues/40),[#41](https://github.com/bcgov/NotifyBC/issues/41),[#42](https://github.com/bcgov/NotifyBC/issues/42)
- docs updates

## v2.9.0

- Issue [#34](https://github.com/bcgov/NotifyBC/issues/34): Helm - add k8s cronJob to backup MongoDB
- docs updates

## v2.8.0

- Issue [#28](https://github.com/bcgov/NotifyBC/issues/28): Allow subscription data be used by mail merge dynamic tokens
- Issue [#32](https://github.com/bcgov/NotifyBC/issues/32): Allow escape mail merge delimiter
- docs updates

## v2.7.0

- Issue [#26](https://github.com/bcgov/NotifyBC/issues/26): Allow filter specified in a notification
- docs updates

## v2.6.0

- Helm chart updates
- docs updates

## v2.5.0

- added [helm chart](https://github.com/bcgov/NotifyBC/tree/main/helm). See [OpenShift template to Helm upgrade guide](../miscellaneous/upgrade.md#openshift-template-to-helm)
- docs updates

## v2.4.0

- Issue [#16](https://github.com/bcgov/NotifyBC/issues/16): Support client certificate authentication
- misc web console adjustments
- docs updates

## v2.3.0

- Issue [#15](https://github.com/bcgov/NotifyBC/issues/15): Support OIDC authentication for both admin and non-admin user
- misc web console adjustments
- docs updates

## v2.2.0

- Issue [#14](https://github.com/bcgov/NotifyBC/issues/14): Support Administrator login, changing password, obtain access token in web console
- misc web console adjustments
- docs updates

## v2.1.0

- Issue [#13](https://github.com/bcgov/NotifyBC/issues/13): Upgraded Vuetify from v0.16.9 to v2.4.3
- misc web console adjustments
- docs updates

::: tip Why v2?
_NotifyBC_ has been built on Node.js [LoopBack](https://loopback.io/) framework since 2017. LoopBack v4, which was released in 2019, is backward incompatible. To keep software stack up-to-date, unless rewriting from scratch, it is necessary to port _NotifyBC_ to LoopBack v4. Great care has been taken to minimize upgrade effort.
:::

## v2.0.0

See [Upgrade Guide](../upgrade/) for more information.

- Runs on LoopBack v4
- All code is converted to TypeScript
- Upgraded [OAS](https://swagger.io/specification/) from v2 to v3
- Docs is converted from Jekyll to VuePress
