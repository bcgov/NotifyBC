---
permalink: /docs/web-console/
---

# Web Console

After [installing](../installation) _NotifyBC_, you can start exploring _NotifyBC_ resources by opening web console, a curated GUI, at [http://localhost:3000](http://localhost:3000). You can further explore full-blown APIs by clicking the API explorer Swagger UI embedded in web console.

Consult the [API docs](../api-overview/) for valid inputs and expected outcome while you are exploring the APIs. Once you are familiar with the APIs, you can start writing code to call the APIs from either user browser or from a server application.

What you see in web console and what you get from API calls depend on how your requests are authenticated.

## Ip whitelisting authentication

The API calls you made with API explorer as well as API calls made by web console from localhost are by default authenticated as [super-admin requests](../overview/#architecture) because localhost is in [admin ip list](../config-adminIpList/) by default. Super-admin authentication status is indicated by the <span class="material-icons">verified_user</span>
icon on top right corner of web console.

To see the result of non super-admin requests, you can choose one of the following methods

- customize admin ip list to omit localhost (127.0.0.1)
- access web console from another ip not in the admin ip list

## Anonymous

If you access web console from a client that is not in the admin ip list, you are by default anonymous user.
Anonymous authentication status is indicated by the LOGIN<span class="material-icons">login</span> button on top right corner of web console. Click the button to login.

## Access token authentication

If you have not configured [OIDC](../config/oidc.md), the login button opens a login form. After successful login, the login button is replaced with the _Access Token_ text field on top right corner of web console. You can edit the text field. If the new access token you entered is invalid, you are essentially logging yourself out. In such case _Access Token_ text field is replaced by the LOGIN<span class="material-icons">login</span> button.

The procedure to create an admin login account is documented in [Administrator API](../api/administrator.md)

::: warning Tokens are not shared between API Explorer and web console
Despite API Explorer appears to be part of web console, it is a separate application. At this point neither the access token nor the OIDC access token are shared between the two applications. You have to use API Explorer's _Authorize_ button to authenticate even if you have logged into web console.
:::

## OIDC authentication

If you have configured OIDC, then the login button will direct you to OIDC provider's login page. Once login successfully, you will be redirected back to _NoitfyBC_ web console. OIDC authentication status is indicated by the LOGOUT<span class="material-icons">logout</span> button.

If you passed [isAdmin](../config/oidc.md) validation, you are admin; otherwise you are authenticated user.

## SiteMinder authentication

To get results of a SiteMinder authenticated user, do one of the following

- access the API via a SiteMinder proxy if you have configured SiteMinder properly
- use a tool such as _curl_ that allows to specify custom headers, and supply SiteMinder header _SM_USER_:

```sh
curl -X GET --header "Accept: application/json" \
    --header "SM_USER: foo" \
    "http://localhost:3000/api/notifications"
```
