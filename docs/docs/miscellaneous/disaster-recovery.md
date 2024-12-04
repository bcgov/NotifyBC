---
permalink: /docs/disaster-recovery/
---

# Disaster Recovery

_NotifyBC_ api server consists of three runtime components

1. app server
2. MongoDB server
3. Redis server

Each runtime component is horizontally scalable to form a high-availability cluster. Such HA cluster is resilient to the failure of individual node.

Under disastrous circumstances, however, entire HA cluster may fail. Recovery should be performed in this order

1. MongoDB server
2. Redis server
3. app server
