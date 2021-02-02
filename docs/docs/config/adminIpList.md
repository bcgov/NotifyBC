---
permalink: /docs/config-adminIpList/
---

# Admin IP List

By [design](../overview/#architecture), _NotifyBC_ classifies incoming requests into four types. For a request to be classified as super-admin, the request's source ip must be in admin ip list. By default, the list contains _localhost_ only as defined by _adminIps_ in _/src/config.ts_

```ts
module.exports = {
  adminIps: ['127.0.0.1'],
};
```

to modify, create config object _adminIps_ with updated list in file _/src/config.local.js_ instead. For example, to add ip range _192.168.0.0/24_ to the list

```js
module.exports = {
  adminIps: ['127.0.0.1', '192.168.0.0/24'],
};
```

It should be noted that _NotifyBC_ may generate http requests sending to itself. These http requests are expected to be admin requests. If you have created an app cluster such as in OpenShift, you should add the cluster ip range to _adminIps_. In OpenShift, this ip range is a private ip range. In BCGov's OpenShift cluster OCP4, the ip range starts with octet 10.
