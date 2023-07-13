---
permalink: /docs/api-administrator/
---

# Administrator

The administrator API provides knowledge factor authentication to identify admin request by access token (aka API token in other literatures) associated with a registered administrator maintained in _NotifyBC_ database. Because knowledge factor authentication is vulnerable to brute-force attack, administrator API based access token authentication is less favorable than admin ip list, client certificate, or OIDC authentication.

::: warning Avoid Administrator API
Administrator API was created to circumvent an OpenShift limitation - the source ip of a request initiated from an OpenShift pod cannot be exclusively allocated to the pod's project, rather it has to be shared by all OpenShift projects. Therefore it's difficult to impose granular access control based on source ip.

With the introduction client certificate in v2.4.0, most use cases, if not all, that need Administrator API including the OpenShift use case mentioned above can be addressed by client certificate. Therefore only use Administrator API sparingly as last resort.
:::

To enable access token authentication,

1. a super-admin [signs up](#sign-up) an administrator

   For example,

   ```sh
   curl -X POST "http://localhost:3000/api/administrators" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"username\":\"Foo\",\"email\":\"user@example.com\",\"password\":\"secret\"}"
   ```

   The step can also be completed in web console using <span style="vertical-align: text-bottom;" class="material-icons">add</span> button in Administrators panel.

2. Either super-admin or the user [login](#login) to generate an access token

   For example,

   ```sh
   curl -X POST "http://localhost:3000/api/administrators/login" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"secret\",\"tokenName\":\"myApp\"}"
   ```

   The step can also be completed in web console GUI by an anonymous user using <span style="vertical-align: text-bottom;" class="material-icons">login</span> button at top right corner. Access token generated by GUI is valid for 12hrs.

3. Apply access token to either _Authorization_ header or _access_token_ query parameter to make authenticated requests. For example, to get a list of notifications

   ```sh
   ACCESS_TOKEN=6Nb2ti5QEXIoDBS5FQGWIz4poRFiBCMMYJbYXSGHWuulOuy0GTEuGx2VCEVvbpBK

   # Authorization Header
   curl -X GET -H "Authorization: $ACCESS_TOKEN" \
   http://localhost:3000/api/notifications

   # Query Parameter
   curl -X GET http://localhost:3000/api/notifications?access_token=$ACCESS_TOKEN
   ```

   In web console, once login as administrator, the access token is automatically applied.

## Model Schemas

The _Administrator_ API operates on three related sub-models - _Administrator_, _UserCredential_ and _AccessToken_. An administrator has one and only one user credential and zero or more access tokens. Their relationship is diagramed as

<img :src="$withBase('/img/admin-data-models.svg')" alt="administrator model diagram">

### Administrator

<table>
  <tr>
    <th>Name</th>
    <th>Attributes</th>
  </tr>
  <tr>
    <td>
      <p class="name">id</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string, format depends on db</td></tr>
        <tr><td>auto-generated</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">email</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>true</td></tr>
        <tr><td>unique</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">username</p>
      <p class="description">user name</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>false</td></tr>
      </table>
    </td>
  </tr>
</table>

### UserCredential

<table>
  <tr>
    <th>Name</th>
    <th>Attributes</th>
  </tr>
  <tr>
    <td>
      <p class="name">id</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string, format depends on db</td></tr>
        <tr><td>auto-generated</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">password</p>
      <p class="description">hashed password</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">userId</p>
      <p class="description">foreign key to Administrator model</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>true</td></tr>
      </table>
    </td>
  </tr>
</table>

### AccessToken

<table>
  <tr>
    <th>Name</th>
    <th>Attributes</th>
  </tr>
  <tr>
    <td>
      <p class="name">id</p>
      <p class="description">64-byte random alphanumeric characters</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>auto-generated</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">userId</p>
      <p class="description">foreign key to Administrator model</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">ttl</p>
      <p class="description">Time-to-live in seconds. If absent, access token never expires.</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>number</td></tr>
        <tr><td>required</td><td>false</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">name</p>
      <p class="description">Name of the access token. Can be used to identify applications that use the token.</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>false</td></tr>
      </table>
    </td>
  </tr>
</table>

## Sign Up

```
POST /administrators
```

This API allows a super-admin to create an admin.

- permissions required, one of
  - super admin
- inputs

  - user information

    ```json
    {
      "email": "string",
      "password": "string",
      "username": "string"
    }
    ```

    <a name="password-complexity"></a>Password must meet following complexity rules:

    - contains at least 10 characters
    - contains at least one lower case character a-z
    - contains at least one upper case character A-Z
    - contains at least one numeric character 0-9
    - contains at lease one special character in !\_@#\$&\*

    _email_ must be unique. _username_ is optional.

    - required: true
    - parameter type: request body
    - data type: object

- outcome
  - for super-admin requests,
    - an _Administrator_ is generated, populated with _email_ and _username_
    - a _UserCredential_ is generated, populated with hashed _password_
    - _Administrator_ is returned
  - forbidden otherwise

## Login

```
POST /administrators/login
```

This API allows an admin to login and create an access token

- inputs

  - user information

    ```json
    {
      "email": "user@example.com",
      "password": "string",
      "tokenName": "string",
      "ttl": 0
    }
    ```

    _tokenName_ and _ttl_ are optional. If _ttl_ is _absent_, access token never expires.

    - required: true
    - parameter type: request body
    - data type: object

- outcome
  - if login is successful
    - a new _AccessToken_ is generated with _tokenName_ is saved to _AccessToken.name_ and _ttl_ is saved to _AccessToken.ttl_.
    - the new access token is returned
      ```json
      {
        "token": "string"
      }
      ```
  - forbidden otherwise

## Set Password

```
POST /administrators/{id}/user-credential
```

This API allows a super-admin or admin to create or update password by id. An admin can only create/update own record.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - password

    ```json
    {
      "password": "string"
    }
    ```

    The password must meet complexity rules specified in [Sign Up](#sign-up).

    - required: true
    - parameter type: request body
    - data type: object

* outcome
  - for super-admins or admin,
    1. hash the input password
    2. remove any existing _UserCredential.password_ for the _Administrator_
    3. create a new _UserCredential.password_
  - forbidden otherwise

## Get Administrators

```
GET /administrators
```

This API allows a super-admin or admin to search for administrators. An admin can only search for own record

- permissions required, one of
  - super admin
  - admin
- inputs
  - a filter defining fields, where, include, order, offset, and limit. See [Loopback Querying Data](https://loopback.io/doc/en/lb4/Querying-data.html) for valid syntax and examples
    - parameter name: filter
    - required: false
    - parameter type: query
    - data type: object
- outcome
  - for super-admins, returns an array of _Administrators_ matching the filter
  - for admins, returns an array of one element - own record if the record matches the filter; empty array otherwise
  - forbidden otherwise

## Update Administrators

```
PATCH /administrators
```

This API allows a super-admin or admin to update administrators. An admin can only update own record

- permissions required, one of
  - super admin
  - admin
- inputs

  - a [where filter](https://loopback.io/doc/en/lb4/Where-filter.html)
    - parameter name: where
    - required: false
    - parameter type: query
    - data type: object
  - user information

    ```json
    {
      "username": "string",
      "email": "string"
    }
    ```

    - required: true
    - parameter type: request body
    - data type: object

- outcome
  - for super-admins or admin, successful count
  - forbidden otherwise

## Count Administrators

```
GET /administrators/count
```

This API allows a super-admin or admin to count administrators by filter. An admin can only count own record therefore the number is at most 1.

- permissions required, one of
  - super admin
  - admin
- inputs

  - a [where filter](https://loopback.io/doc/en/lb4/Where-filter.html)
    - parameter name: where
    - required: false
    - parameter type: query
    - data type: object

- outcome
  - for super-admins or admin, a count matching the filter
  - forbidden otherwise

## Delete an Administrator

```
DELETE /administrators/{id}
```

This API allows a super-admin or admin to delete administrator by id. An admin can only delete own record.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string

- outcome
  - for super-admins or admin
    - all _AccessToken_ of the _Administrator_ are deleted
    - the corresponding _UserCredential_ is deleted
    - the _Administrator_ is deleted
  - forbidden otherwise

## Get an Administrator

```
GET /administrators/{id}
```

This API allows a super-admin or admin to get administrator by id. An admin can only get own record.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string

- outcome
  - for super-admins or admin, returns the _Administrator_
  - forbidden otherwise

## Update an Administrator

```
PATCH /administrators/{id}
```

This API allows a super-admin or admin to update administrator fields by id. An admin can only update own record.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - user information

    ```json
    {
      "username": "string",
      "email": "string"
    }
    ```

    - required: true
    - parameter type: request body
    - data type: object

* outcome
  - for super-admins or admin, updates the _Administrator_
  - forbidden otherwise

## Replace an Administrator

```
PUT /administrators/{id}
```

This API allows a super-admin or admin to replace administrator records by id. An admin can only replace own record. This API is different from [Update an Administrator](#update-an-administrator) in that update/patch needs only to contain fields that are changed, ie the delta, whereas replace/put needs to contain all fields to be saved.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - user information

    ```json
    {
      "username": "string",
      "email": "string"
    }
    ```

    - required: true
    - parameter type: request body
    - data type: object

* outcome
  - for super-admins or admin, updates the _Administrator_. If _password_ is also supplied, the password is handled same way as [Set Password](#set-password) API
  - forbidden otherwise

## Get an Administrator's AccessTokens

```
GET /administrators/{id}/access-tokens
```

This API allows a super-admin or admin to get access tokens by _Administrator_ id. An admin can only get own records.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - a _AccessToken_ filter defining fields, where, include, order, offset, and limit. See [Loopback Querying Data](https://loopback.io/doc/en/lb4/Querying-data.html) for valid syntax and examples
    - parameter name: filter
    - required: false
    - parameter type: query
    - data type: object

* outcome
  - for super-admins or admin, a list of *AccessToken*s matching the filter
  - forbidden otherwise

## Update an Administrator's AccessTokens

```
PATCH /administrators/{id}/access-tokens
```

This API allows a super-admin or admin to update access tokens by _Administrator_ id. An admin can only update own records.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - a [where filter](https://loopback.io/doc/en/lb4/Where-filter.html)
    - parameter name: where
    - required: false
    - parameter type: query
    - data type: object
  - _AccessToken_ information

    ```json
    {
      "ttl": 0,
      "name": "string"
    }
    ```

    - required: true
    - parameter type: request body
    - data type: object

* outcome
  - for super-admins or admin, success count
  - forbidden otherwise

## Create an Administrator's AccessToken

```
POST /administrators/{id}/access-tokens
```

This API allows a super-admin or admin to create an access token by _Administrator_ id. An admin can only create own records.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - _AccessToken_ information

    ```json
    {
      "ttl": 0,
      "name": "string"
    }
    ```

    - required: true
    - parameter type: request body
    - data type: object

* outcome
  - for super-admins or admin
    - Create and save _AccessToken_
    - return _AccessToken_ created
  - forbidden otherwise

## Delete an Administrator's AccessTokens

```
DELETE /administrators/{id}/access-tokens
```

This API allows a super-admin or admin to delete access tokens by _Administrator_ id. An admin can only delete own records.

- permissions required, one of
  - super admin
  - admin
- inputs

  - _Administrator_ id
    - required: true
    - parameter type: path
    - data type: string
  - an _AccessToken_ [where filter](https://loopback.io/doc/en/lb4/Where-filter.html)
    - parameter name: where
    - required: false
    - parameter type: query
    - data type: object

* outcome
  - for super-admins or admin
    - delete all _AccessToken_ under the _Administrator_ matching the filter
    - return success count
  - forbidden otherwise