---
permalink: /docs/config-certificates/
---

# TLS Certificates

_NotifyBC_ supports HTTPS TLS to achieve end-to-end encryption. In addition, both server and client can be authenticated using certificates.

To enable HTTPS for server authentication only, you need to create two files

- _server/certs/key.pem_ - a PEM encoded private key
- _server/certs/cert.pem_ - a PEM encoded X.509 certificate chain

::: tip Use ConfigMaps on OpenShift
Create _key.pem_ and _cert.pem_ as items in ConfigMap _notify-bc_, then mount the items under _/opt/app-root/src/server/certs_ similar to how _config.local.js_ and _middleware.local.js_ are implemented.
:::

For self-signed certificate, run

```sh
openssl req -x509 -newkey rsa:4096 -keyout server/certs/key.pem -out server/certs/cert.pem -nodes -days 365 -subj "/CN=NotifyBC"
```

to generate both files in one shot.

::: warning set env NODE_TLS_REJECT_UNAUTHORIZED when using self-signed cert

Self-signed cert is intended to be used in non-production environments only to authenticate server. In such environments to allow _NotifyBC_ connecting to itself, environment variable NODE_TLS_REJECT_UNAUTHORIZED must be set to 0.
:::

To create a CSR from the private key generated above, run

```sh
openssl req -new -key server/certs/key.pem -out server/certs/csr.pem
```

Then bring your CSR to your CA to sign. Replace _server/certs/cert.pem_ with the cert signed by CA. If your CA also supplied intermediate certificate in PEM encoded format, say in a file called _intermediate.pem_, append all of the content of _intermediate.pem_ to file _server/certs/cert.pem_.

::: warning Make a copy of self-signed server/certs/cert.pem
If you want to enable [client certificate authentication](#client-certificate-authentication) documented below, make sure to copy self-signed _server/certs/cert.pem_ to _server/certs/ca.pem_ before replacing the file with the cert signed by CA.
You need the self-signed _server/certs/cert.pem_ to sign client CSR.
:::

In case you created _server/certs/key.pem_ and _server/certs/cert.pem_ but don't want to enable HTTPS, create following config in _src/config.local.js_

```js
module.exports = {
  tls: {
    enabled: false,
  },
};
```

::: warning Update URL configs after enabling HTTPS
Make sure to update the protocol of following URL configs after enabling HTTPS

- [httpHost](../config/httpHost.md)
- [internalHttpHost](../config/internalHttpHost.md)

When _NotifyBC_ is hosted on OpenShift, also update on all deployed environments

- notify-bc-app [livenessProbe httpGet scheme](https://github.com/bcgov/NotifyBC/blob/d389d260ce29beb9631dd73867870fa842fb6181/.openshift-templates/notify-bc.yml#L81)
- notify-bc-app [readinessProbe httpGet scheme](https://github.com/bcgov/NotifyBC/blob/d389d260ce29beb9631dd73867870fa842fb6181/.openshift-templates/notify-bc.yml#L96)
- notify-bc-cron [livenessProbe httpGet scheme](https://github.com/bcgov/NotifyBC/blob/d389d260ce29beb9631dd73867870fa842fb6181/.openshift-templates/notify-bc.yml#L169)
- notify-bc-cron [readinessProbe httpGet scheme](https://github.com/bcgov/NotifyBC/blob/d389d260ce29beb9631dd73867870fa842fb6181/.openshift-templates/notify-bc.yml#L182)
  :::

## Client certificate authentication

After enabling HTTPS, you can further configure such that a client request can be authenticated using client certificate. To do so, copy self-signed _server/certs/cert.pem_ to _server/certs/ca.pem_. You will use your server key to sign client certificate CSR, and advertise _server/certs/ca.pem_ as acceptable CAs during TLS handshake.

Assuming a client's CSR file is named _myClientApp_csr.pem_, to sign the CSR

```sh
openssl x509 -req -in myClientApp_csr.pem -CA server/certs/ca.pem -CAkey server/certs/key.pem -out myClientApp_cert.pem -set_serial 01 -days 365
```

Then give _myClientApp_cert.pem_ to the client. How a client app supplies the client certificate when making a request to _NotifyBC_ varies by client type. Usually the client first needs to bundle the signed client cert and client key into PKCS#12 format

```sh
openssl pkcs12 -export -clcerts -in myClientApp_cert.pem -inkey myClientApp_key.pem -out myClientApp.p12
```

To use _myClientApp.p12_, for cURL,

```sh
curl --insecure --cert myClientApp.p12 --cert-type p12 https://localhost:3000/api/administrators/whoami
```

For browsers, check browser's instruction how to import _myClientApp.p12_. When browser accessing _NotifyBC_ API endpoints such as _https://localhost:3000/api/administrators/whoami_, the browser will prompt to choose from a list certificates that are signed by the server certificate.

In case you created _server/certs/ca.pem_ but don't want to enable client certificate authentication, create following config in _src/config.local.js_

```js
module.exports = {
  tls: {
    clientCertificateEnabled: false,
  },
};
```

::: warning TLS termination has to be passthrough
For client certification authentication to work, TLS termination of all reverse proxies has to be set to passthrough rather than offload and reload. This means, for example, when _NotifyBC_ is hosted on OpenShift, router [tls termination](https://github.com/bcgov/NotifyBC/blob/d389d260ce29beb9631dd73867870fa842fb6181/.openshift-templates/notify-bc.yml#L319) has to be changed from _edge_ to _passthrough_.
:::

::: tip <i>NotifyBC</i> internal request does not use client certificate
Requests sent by a _NotifyBC_ node back to the app cluster use admin ip list authentication.
:::
