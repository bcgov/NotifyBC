---
permalink: /docs/health-check/
prev: /docs/api-bounce/
---

# Health Check

Health status of _NotifyBC_ can be obtained by querying `/health` API end point. For example

```json
$ curl -s http://localhost:3000/api/health | jq
{
  "status": "ok",
  "info": {
    "MongoDB": {
      "status": "up"
    },
    "config": {
      "status": "up",
      "count": 2
    },
    "redis": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "MongoDB": {
      "status": "up"
    },
    "config": {
      "status": "up",
      "count": 2
    },
    "redis": {
      "status": "up"
    }
  }
}
```

If overall health status is OK, the HTTP response code is 200, otherwise 503.
The response payload shows status of following indicators and health criteria

1. MongoDB - MongoDB must be reachable
2. config - There must be at least 2 items in MongoDB configuration collection
3. Redis - Redis must be reachable

`/health` API end point is also reachable in _API Explorer_ of _NotifyBC_ web console.
