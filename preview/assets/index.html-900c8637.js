import { _ as _export_sfc, o as openBlock, c as createElementBlock, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="worker-process-count" tabindex="-1"><a class="header-anchor" href="#worker-process-count" aria-hidden="true">#</a> Worker Process Count</h1><p>When <em>NotifyBC</em> runs on a host with multiple CPUs, by default it creates a cluster of worker processes of which the count matches CPU count. You can override the number with the environment variable <em>NOTIFYBC_WORKER_PROCESS_COUNT</em>.</p><div class="custom-container warning"><p class="custom-container-title">A note about worker process count on OpenShift</p><p>It has been observed that on OpenShift Node.js returns incorrect CPU count. The template therefore sets <i>NOTIFYBC_WORKER_PROCESS_COUNT</i> to 1. After all, on OpenShift <i>NotifyBC</i> is expected to be horizontally scaled by pods rather by CPUs.</p></div>', 3);
const _hoisted_4 = [
  _hoisted_1
];
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", null, _hoisted_4);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-900c8637.js.map
