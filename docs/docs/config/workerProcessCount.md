---
layout: docs
title: Worker Process Count
permalink: /docs/config-workerProcessCount/
---

When *NotifyBC* runs on a host with multiple CPUs, by default it creates a cluster of worker processes of which the count matches CPU count. You can override the number with the environment variable *NOTIFYBC_WORKER_PROCESS_COUNT*.


::: warning A note about worker process count on OpenShift
It has been observed that on OpenShift Nodejs returns incorrect CPU count. The template therefore sets <i>NOTIFYBC_WORKER_PROCESS_COUNT</i> to 1. After all, on OpenShift <i>NotifyBC</i> is expected to be horizontally scaled by pods rather by CPUs.

:::
