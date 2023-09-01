---
permalink: /docs/api-config/
---

# Configuration

The configuration API, accessible by only super-admin requests, is used to define dynamic configurations. Dynamic configuration is needed in situations like

- RSA key pair generated automatically at boot time if not present
- service-specific subscription confirmation request message template

## Model Schema

The API operates on following configuration data model fields:

<table>
  <tr>
    <th>Name</th>
    <th>Attributes</th>
  </tr>
  <tr>
    <td>
      <p class="name">id</p>
      <p class="description">config id</p>
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
      <p class="name">name</p>
      <p class="description">config name</p>
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
      <p class="name">value</p>
      <div class="description">config value.
      </div>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>object</td></tr>
        <tr><td>required</td><td>true</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <p class="name">serviceName</p>
      <p class="description">name of the service the config applicable to</p>
    </td>
    <td>
      <table>
        <tr><td>type</td><td>string</td></tr>
        <tr><td>required</td><td>false</td></tr>
      </table>
    </td>
  </tr>
</table>

## Get Configurations

```
GET /configurations
```

- permissions required, one of
  - super admin
  - admin
- inputs

  - !!!include(./docs/shared/filterQueryParam.md)!!!

- outcome

  For admin request, a list of config items matching the filter; forbidden for user request

- example

  to retrieve configs created in year 2023, run

  ```sh
  curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/configurations!!!include(./docs/shared/filterQueryParamCode.md)!!!'
  ```

  !!!include(./docs/shared/filterQueryParamExample.md)!!!

## Create a Configuration

```
POST /configurations
```

- permissions required, one of
  - super admin
  - admin
- inputs
  - an object containing configuration data model fields. At a minimum all required fields that don't have a default value must be supplied. Id field should be omitted since it's auto-generated. The API explorer only created an empty object for field _value_ but you should populate the child fields.
    - parameter name: data
    - required: true
    - parameter type: body
    - data type: object
- outcome

  _NotifyBC_ performs following actions in sequence

  1. if it’s a user request, error is returned
  2. inputs are validated. For example, required fields without default values must be populated. If validation fails, error is returned
  3. if config item is _notification_ with field _value.rss_ populated, and if the field _value.httpHost_ is missing, it is generated using this request's HTTP protocol , host name and port.
  4. item is saved to database

* example

  see the cURL command on how to create a [dynamic subscription config](../config-subscription#subscription-confirmation-request-template)

## Update a Configuration

```
PATCH /configurations/{id}
```

- permissions required, one of
  - super admin
  - admin
- inputs

  - configuration id
    - parameter name: id
    - required: true
    - parameter type: path
    - data type: string
  - an object containing fields to be updated.
    - parameter name: data
    - required: true
    - parameter type: body
    - data type: object

- outcome

  Similar to _POST_ except field _update_ is always updated with current timestamp.

## Delete a Configuration

```
DELETE /configurations/{id}
```

- permissions required, one of
  - super admin
  - admin
- inputs

  - configuration id
    - parameter name: id
    - required: true
    - parameter type: path
    - data type: string

- outcome

  For admin request, delete the config item requested; forbidden for user request

## Replace a Configuration

```
PUT /configurations/{id}
```

This API is intended to be only used by admin web console to modify a configuration.

- permissions required, one of
  - super admin
  - admin
- inputs
  - configuration id
    - parameter name: id
    - required: true
    - parameter type: path
    - data type: string
  - configuration data
    - parameter name: data
    - required: true
    - parameter type: body
    - data type: object
- outcome

  For admin requests, replace configuration identified by _id_ with parameter _data_ and save to database.
