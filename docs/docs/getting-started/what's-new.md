---
permalink: /docs/what's-new/
---

# What's New

::: tip Why v2?
_NotifyBC_ has been built on Node.js [LoopBack](https://loopback.io/) framework since 2017. LoopBack v4, which was released in 2019, is backward incompatible. To keep software stack up-to-date, unless rewriting from scratch, it is necessary to port _NotifyBC_ to LoopBack v4. Great care has been taken to minimize upgrade effort.
:::

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

## v2.0.0

See [Upgrade Guide](../upgrade/) for more information.

- Runs on LoopBack v4
- All code is converted to TypeScript
- Upgraded [OAS](https://swagger.io/specification/) from v2 to v3
- Docs is converted from Jekyll to VuePress
