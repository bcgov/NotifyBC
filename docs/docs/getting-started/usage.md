---
permalink: /docs/usage/
---

# Basic Usage

After [installing](../installation) _NotifyBC_, you can start exploring _NotifyBC_ resources by opening web console at [http://localhost:3000](http://localhost:3000). You can further explore APIs by clicking the API explorer in web console and expand the data models.

Consult the [API docs](../api-overview/) for valid inputs and expected outcome while you are exploring the APIs. Once you are familiar with the APIs, you can start writing code to call the APIs from either user browser or from a server application.

What you see and what you get depend on which of the following four types the request is authenticated to.

## Super-admin

The API calls you made with API explorer as well as API calls made by web console from localhost are by default authenticated as [super-admin requests](../overview/#architecture). Super-admin authentication status is indicated by the <span class="material-icons">verified_user</span>
icon on top right corner of web console.

To see the result of non super-admin requests, you can choose one of the following methods

- [define admin ip list](../config-adminIpList/) and avoid putting localhost (127.0.0.1) in the list
- access the API explorer from another ip not in the admin ip list

## Anonymous user

If you access web console from a client that is not in the admin ip list, you are by default anonymous user.
Anonymous authentication status is indicated by the LOGIN<span class="material-icons">login</span> button on top right corner of web console. If you click the button and login successfully, you become an admin user.

## Admin user

If you are an authorized _NotifyBC_ administrator and it's not always feasible for you to access _NotifyBC_ from a client in admin ip list, you can authenticate using an access token. The procedure to obtain and apply access token is documented in [Administrator API](../api/administrator.md). Access token authentication status is indicated by the _Access Token_ text field on top right corner of web console. You can edit the text field. If the new access token you entered is invalid, you are essentially logging yourself out. In such case _Access Token_ text field is replaced by the LOGIN<span class="material-icons">login</span> button.

## SiteMinder authenticated user

To get results of a SiteMinder authenticated user, do one of the following

- access the API via a SiteMinder proxy if you have configured SiteMinder properly
- use a tool such as _curl_ that allows to specify custom headers, and supply SiteMinder header _SM_USER_:

```sh
curl -X GET --header "Accept: application/json" \
    --header "SM_USER: foo" \
    "http://localhost:3000/api/notifications"
```
