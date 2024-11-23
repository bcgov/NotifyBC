---
permalink: /docs/memory-dump/
---

# Memory Dump

To troubleshoot memory related issues, Super-admin can get a memory dump of _NotifyBC_ by querying `/memory` API end point. For example

```sh
$ curl -s http://localhost:3000/api/memory
Heap.20240513.114015.22037.0.001.heapsnapshot
```

The output is the file name of the memory dump. The dump file can be loaded by, for example, Chrome DevTools.

_fileName_ query parameter can be used to specify the file path and name

```sh
$ curl -s http://localhost:3000/api/memory?fileName=/tmp/my.heapsnapshot
/tmp/my.heapsnapshot
```

::: tip How to get memory dump of a particular node?
If you call `/memory` from a client-facing URL end point, which is usually load balanced, the memory dump occurs only on node handling your request. To perform it on the node you want to troubleshoot, in particular the _primary_ node, run the command from the node. Make sure 127.0.0.1 is in _adminIps_.
