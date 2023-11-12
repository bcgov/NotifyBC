---
permalink: /docs/config-database/
---

# Database

By default _NotifyBC_ uses in-memory database backed up by folder _/server/database/_ for local and docker deployment and MongoDB for Kubernetes deployment. To use MongoDB for non-Kubernetes deployment, add file _/src/datasources/db.datasource.(local|\<env\>).(json|js|ts)_ with MongoDB connection information such as following:

```js
module.exports = {
  uri: 'mongodb://127.0.0.1:27017/notifyBC?replicaSet=rs0',
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
};
```

See [Mongoose connection options](https://mongoosejs.com/docs/connections.html#options) for more configurable properties.
