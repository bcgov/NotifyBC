---
permalink: /docs/config-internalHttpHost/
---

# Internal HTTP Host

By default, HTTP requests submitted by _NotifyBC_ back to itself will be sent to _httpHost_ if defined or the host of the incoming HTTP request that spawns such internal requests. But if config _internalHttpHost_, which has no default value, is defined, for example in file _/src/config.local.js_

```js
module.exports = {
  internalHttpHost: 'http://notifybc:3000',
};
```

then the HTTP request will be sent to the configured host. An internal request can be generated, for example, as a [sub-request of broadcast push notification](../config-notification/#broadcast-push-notification-task-concurrency). _internalHttpHost_ shouldn't be accessible from internet.

All internal requests are supposed to be admin requests. The purpose of _internalHttpHost_ is to facilitate identifying the internal server ip as admin ip.

::: tip OpenShift Use Case
The OpenShift deployment script sets <i>internalHttpHost</i> to service url <i>http://notify-bc:3000</i> in config map. The source ip in such case would be in a private OpenShift ip range. You should add this private ip range to <a href="#admin-ip-list">admin ip list</a>. The private ip range varies from OpenShift installation. In BCGov's OCP4 cluster, it starts with octet 10.
:::
