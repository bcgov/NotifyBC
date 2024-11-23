---
permalink: /docs/config-nodeRoles/
---

# Node Roles

In a multi-node deployment, tasks that don't support concurrency have to be run by one node. That node is designated as _primary_. To alleviate primary node's burden, tasks that support concurrency are not assigned to the primary node.

The distinction is made using environment variable _NOTIFYBC_NODE_ROLE_. For primary node, don't set this environment variable. For secondary nodes, set it to _secondary_.

::: tip multi-CPU node
If the primary node has multiple CPUs, then only one worker has primary role. The rest have secondary role. If a secondary node has multiple CPUs, all workers have secondary role. See [Worker Process Count](./workerProcessCount.md) for multi-CPU nodes.
:::
