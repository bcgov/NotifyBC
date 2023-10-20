---
permalink: /docs/overview/
---

# Overview

_NotifyBC_ is a general purpose API Server to manage subscriptions and dispatch notifications. It aims to implement some common backend processes of a notification service without imposing any constraints on the UI frontend, nor impeding other server components' functionality. This is achieved by interacting with user browser and other server components through RESTful API and other standard protocols in a loosely coupled way.

## Features

_NotifyBC_ facilitates both anonymous and authentication-enabled secure webapps implementing notification feature. A _NotifyBC_ server instance supports multiple notification services. A service is a topic of interest that user wants to receive updates. It is used as the partition of notification messages and user subscriptions. A user may subscribe to a service in multiple push delivery channels allowed. A user may subscribe to multiple services. In-app pull notification doesn't require subscription as it's not intrusive to user.

### notification

- both in-app pull notifications (a.k.a. messages or alerts) and push notifications
- multiple push notifications delivery channels
  - email
  - sms
- unicast and broadcast message types
- future-dated notifications
- for in-app pull notifications
  - support read and deleted message states
  - message expiration
  - deleted messages are not deleted immediately for auditing and recovery purposes
- for broadcast push notifications
  - allow both sync and async _POST_ API calls. For async API call, an optional callback url is supported
  - can be auto-generated from RSS feeds
  - allow user to specify filter rules evaluated against data contained in the notification
  - allow sender to specify filter rules evaluated against data contained in the subscription
  - allow application developer to create custom filter functions used by the filter rules mentioned above

### subscription and un-subscription

- verify the ownership of push notification subscription channel:
  - generates confirmation code based on a regex input
  - send confirmation request to unconfirmed subscription channel
  - verify confirmation code
- generate random un-subscription code
- send acknowledgement message after un-subscription for anonymous subscribers
- bulk unsubscription
- list-unsubscribe by email
- track bounces and unsubscribe the recipient from all subscriptions when hard bounce count exceeds threshold
- sms user can unsubscribe by replying a shortcode keyword with Swift sms provider

### mail merge

Strings in notification or subscription message that are enclosed between curly braces _{_ _}_ are called tokens, also known as placeholders. Tokens are replaced based on the context of notification or subscription when dispatching the message. To avoid treating a string between curly braces as a token, escape the curly braces with backslash _\\_. For example _\\{i_am_not_a_token\\}_ is not a token. It will be rendered as _{i_am_not_a_token}_.

Tokens whose names are predetermined by _NotifyBC_ are called static tokens; otherwise they are called dynamic tokens.

#### static tokens

_NotifyBC_ recognizes following case-insensitive static tokens. Most of the names are self-explanatory.

- {subscription_confirmation_url}
- {subscription_confirmation_code}
- {service_name}
- {http_host} - http host in the form <i>http(s): //<host_name\>:\<port\></i>. The value is obtained from the http request that triggers the message
- {rest_api_root} - configured Loopback [REST API basePath](https://loopback.io/doc/en/lb4/Customizing-server-configuration.html#configure-the-base-path)
- {subscription_id}
- anonymous unsubscription related tokens
  - {unsubscription_url}
  - {unsubscription_all_url} - url to unsubscribe all services the user has subscribed on
    this <i>NotifyBC</i> instance
  - {unsubscription_code}
  - {unsubscription_reversion_url}
  - {unsubscription_service_names} - includes {service_name} and additional services user has unsubscribed, prefixed with conditionally pluralized word <i>service</i>.

#### dynamic tokens

Dynamic tokens are replaced with correspondingly named sub-field of _data_ field in the notification or subscription if exist. Qualify token name with _notification::_ or _subscription::_ to indicate the source of substitution. If token name is not qualified, then both notification and subscription are checked, with notification taking precedence. Nested and indexed sub-fields are supported.

Examples

- _{notification::description}_ is replaced with field _data.description_ of the notification if exist
- _{subscription::gender}_ is replaced with field _data.gender_ of the subscription if exist
- _{addresses[0].city}_ is replaced with field _data.addresses[0].city_ of the notification if exist; otherwise is replaced with field _data.addresses[0].city_ of the subscription if exist
- _{nonexistingDataField}_ is unreplaced if neither notification nor subscription contains _data.nonexistingDataField_

As exception, in order to prevent spamming by unconfirmed subscribers, dynamic tokens in subscription [confirmation request message](../config-subscription/#confirmation-request-message) and [duplicated subscription](../config-subscription/#duplicated-subscription) message are not replaced with subscription data, for example _{subscription::...}_ tokens are left unchanged.

::: tip Notification by RSS feeds relies on dynamic token
A notification created by RSS feeds relies on dynamic token to supply the context to message template. In this case the <i>data</i> field contains the RSS item.
:::

## Architecture

### Request Types

_NotifyBC_, designed to be a microservice, doesn't use full-blown ACL to secure API calls. Instead, it classifies incoming requests into admin and user types. The key difference is while both admin and user can subscribe to notifications, only admin can post notifications.

Each type has two subtypes based on following criteria

- super-admin, if the request meets both of the following two requirements

  1. The request carries one of the following two attributes

     - the source ip is in the admin ip list
     - has a client certificate that is signed using _NotifyBC_ server certificate. See [Client certificate authentication](../config/certificates.md#client-certificate-authentication) on how to sign.

  2. The request doesn't contain any of following case insensitive HTTP headers, with the first three being SiteMinder headers

     - sm_universalid
     - sm_user
     - smgov_userdisplayname
     - is_anonymous

- admin, if the request is not super-admin and meets one of the following criteria

  - has a valid access token associated with an builtin admin user created and logged in using the _administrator_ api, and the request doesn't contain any HTTP headers listed above
  - has a valid OIDC access token containing customizable admin profile attributes

  ::: tip access token disambiguation
  Here the term _access token_ has been used to refer two different things

  1. the token associated with a builtin admin user
  2. the token generated by OIDC provider.

  To reduce confusion, throughout the documentation the former is called _access token_ and the latter is called _OIDC access token_.
  :::

- authenticated user, if the request is neither super-admin nor admin, and meets one fo the following criteria
  - contains any of the 3 SiteMinder headers listed above, and comes from either trusted SiteMinder proxy or admin ip list
  - contains a valid OIDC access token
- anonymous user, if the request doesn't meet any of the above criteria

The only extra privileges that a super-admin has over admin are that super-admin can perform CRUD operations on _configuration_, _bounce_ and _administrator_ entities through REST API. In the remaining docs, when no further distinction is necessary, an admin request refers to both super-admin and admin request; a user request refers to both authenticated and anonymous request.

An admin request carries full authorization whereas user request has limited access. For example, a user request is not allowed to

- send notification
- bypass the delivery channel confirmation process when subscribing to a service
- retrieve push notifications through API (can only receive notification from push notification channel such as email)
- retrieve in-app notifications that is not targeted to the current user

The result of an API call to the same end point may differ depending on the request type. For example, the call _GET /notifications_ without a filter will return all notifications to all users for an admin request, but only non-deleted, non-expired in-app notifications for authenticated user request, and forbidden for anonymous user request. Sometimes it is desirable for a request from admin ip list, which would normally be admin request, to be voluntarily downgraded to user request in order to take advantage of predefined filters such as the ones described above. This can be achieved by adding one of the HTTP headers listed above to the request. This is also why admin request is not determined by ip or token alone.

The way _NotifyBC_ interacts with other components is diagrammed below.
<img :src="$withBase('/img/architecture.svg')" alt="architecture diagram">

### Authentication Strategies

API requests to _NotifyBC_ can be either anonymous or authenticated. As alluded in [Request Types](#request-types) above, _NotifyBC_ supports following authentication strategies

1. ip whitelisting
2. client certificate
3. access token associated with an builtin admin user
4. OpenID Connect (OIDC)
5. CA SiteMinder

Authentication is performed in above order. Once a request passed an authentication strategy, the rest strategies are skipped. A request that failed all authentication strategies is anonymous.

The mapping between authentication strategy and request type is

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#ccc;border-spacing:0;margin:0px auto;}
.tg td{background-color:#fff;border-color:#ccc;border-style:solid;border-width:1px;color:#333;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#f0f0f0;border-color:#ccc;border-style:solid;border-width:1px;color:#333;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-c3ow{border-color:inherit;text-align:center;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-btxf{background-color:#f9f9f9;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-abip{background-color:#f9f9f9;border-color:inherit;text-align:center;vertical-align:top}
</style>
<table class="tg">
<tbody>
  <tr>
    <td class="tg-0pky" rowspan="2"></td>
    <td class="tg-c3ow" colspan="2">Admin</td>
    <td class="tg-c3ow" colspan="2">User</td>
  </tr>
  <tr>
    <td class="tg-btxf">Super-admin</td>
    <td class="tg-btxf">admin</td>
    <td class="tg-btxf">authenticated</td>
    <td class="tg-btxf">anonymous</td>
  </tr>
  <tr>
    <td class="tg-0pky">ip whitelisting</td>
    <td class="tg-c3ow">✔</td>
    <td class="tg-c3ow"></td>
    <td class="tg-c3ow"></td>
    <td class="tg-c3ow"></td>
  </tr>
  <tr>
    <td class="tg-btxf">client certifcate</td>
    <td class="tg-abip">✔</td>
    <td class="tg-abip"></td>
    <td class="tg-abip"></td>
    <td class="tg-abip"></td>
  </tr>
  <tr>
    <td class="tg-0pky">access token</td>
    <td class="tg-c3ow"></td>
    <td class="tg-c3ow">✔</td>
    <td class="tg-c3ow"></td>
    <td class="tg-c3ow"></td>
  </tr>
  <tr>
    <td class="tg-btxf">OIDC</td>
    <td class="tg-abip"></td>
    <td class="tg-abip">✔</td>
    <td class="tg-abip">✔</td>
    <td class="tg-abip"></td>
  </tr>
  <tr>
    <td class="tg-0pky">SiteMinder</td>
    <td class="tg-c3ow"></td>
    <td class="tg-c3ow"></td>
    <td class="tg-c3ow">✔</td>
    <td class="tg-c3ow"></td>
  </tr>
</tbody>
</table>

::: tip Which authentication strategy to use?

Because ip whitelist doesn't expire and client certificate usually has a relatively long expiration period (say one year), they are suitable for long-running unattended server processes such as server-side code of web apps, cron jobs, IOT sensors etc. The server processes have to be trusted because once authenticated, they have full privilege to _NotifyBC_. Usually the server processes and _NotifyBC_ instance are in the same administrative domain, i.e. managed by the same admin group of an organization.

By contrast, OIDC and SiteMinder use short-lived tokens or session cookies. Therefore they are only suitable for interactive user sessions.

Access token associated with an builtin admin user should be avoided whenever possible.

Here are some common scenarios and recommendations

- For server-side code of web apps

  - use OIDC if the web app is OIDC enabled and user requests can be proxied to _NotifyBC_ by web app; otherwise
  - use ip whitelisting if obtaining ip is feasible; otherwise
  - use client certificate (requires a little more config than ip whitelisting)

- For front-end browser-based web apps such as SPAs
  - use OIDC
- For server apps that send requests spontaneously such as IOT sensors, cron jobs
  - use ip whitelisting if obtaining ip is feasible; otherwise
  - client certificate
- If _NotifyBC_ is ued by a _SiteMinder_ protected web apps and _NotifyBC_ is also protected by _SiteMinder_
  - use SiteMinder

:::

## Application Framework

_NotifyBC_ is created on Node.js [LoopBack](https://loopback.io/). Contributors to source code of _NotifyBC_ should be familiar with LoopBack. [LoopBack Docs](https://loopback.io/doc/en/lb4) serves a good complement to this documentation.
