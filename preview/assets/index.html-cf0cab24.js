import{_ as e,o as t,c as o,e as r}from"./app-c47379d7.js";const n={},s=r('<h1 id="worker-process-count" tabindex="-1"><a class="header-anchor" href="#worker-process-count" aria-hidden="true">#</a> Worker Process Count</h1><p>When <em>NotifyBC</em> runs on a host with multiple CPUs, by default it creates a cluster of worker processes of which the count matches CPU count. You can override the number with the environment variable <em>NOTIFYBC_WORKER_PROCESS_COUNT</em>.</p><div class="custom-container warning"><p class="custom-container-title">A note about worker process count on OpenShift</p><p>It has been observed that on OpenShift Node.js returns incorrect CPU count. The template therefore sets <i>NOTIFYBC_WORKER_PROCESS_COUNT</i> to 1. After all, on OpenShift <i>NotifyBC</i> is expected to be horizontally scaled by pods rather by CPUs.</p></div>',3),c=[s];function a(i,h){return t(),o("div",null,c)}const d=e(n,[["render",a],["__file","index.html.vue"]]);export{d as default};
