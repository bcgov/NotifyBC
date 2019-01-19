- move/rename /server/datasources.\*.(json|js) to /src/datasources/db.datasource.\*.(json|js)
- move /server/config.\*.(json|js) to /src/config.\*.(json|js)
- move following properties in file _config.\*.(json|js)_

  ```
  {
    "restApiRoot": "/api",
    "host": "0.0.0.0",
    "port": 3000
  }
  ```

  to _rest_ property

  ```
  {
    "rest":{
      "restApiRoot": "/api",
      "host": "0.0.0.0",
      "port": 3000
    }
  }
  ```
