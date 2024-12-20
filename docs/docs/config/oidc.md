---
permalink: /docs/config-oidc/
---

# OIDC

_NotifyBC_ currently can only authenticate RSA signed OIDC access token if the token is a JWT. OIDC providers such as Keycloak meet the requirement.

To enable OIDC authentication strategy, add _oidc_ configuration object to _src/config.local.js_. The object supports following properties

1. _discoveryUrl_ - [OIDC discovery](https://openid.net/specs/openid-connect-discovery-1_0.html) url
2. _clientId_ - OIDC client id
3. _isAdmin_ - a predicate function to determine if authenticated user is _NotifyBC_ administrator. The function takes the decoded OIDC access token JWT payload as input user object and should return either a boolean or a promise of boolean, i.e. the function can be both sync or async.
4. _isAuthorizedUser_ - an optional predicate function to determine if authenticated user is an authorized _NotifyBC_ user. If omitted, any authenticated user is authorized _NotifyBC_ user. This function has same signature as _isAdmin_

A example of complete OIDC configuration looks like

```js
module.exports = {
  ...
  oidc: {
    discoveryUrl:
      'https://op.example.com/auth/realms/foo/.well-known/openid-configuration',
    clientId: 'NotifyBC',
    isAdmin(user) {
      const roles = user.resource_access.NotifyBC.roles;
      if (!(roles instanceof Array) || roles.length === 0) return false;
      return roles.indexOf('admin') > -1;
    },
    isAuthorizedUser(user) {
      return user.realm_access.roles.indexOf('offline_access') > -1;
    },
  },
};
```

In _NotifyBC_ web console and only in the web console, OIDC authentication takes precedence over built-in admin user, meaning if OIDC is configured, the login button goes to OIDC provider rather than the login form.

There is no default OIDC configuration in _src/config.ts_.
