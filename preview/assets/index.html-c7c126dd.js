import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "api-overview",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#api-overview",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" API Overview")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_3 = {
  href: "https://loopback.io/doc/en/lb4/Model.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "a",
  {
    href: "http://localhost:3000",
    target: "_blank"
  },
  "http://localhost:3000",
  -1
  /* HOISTED */
);
const _hoisted_5 = /* @__PURE__ */ createStaticVNode('<ul><li><a href="../api-subscription">Subscription</a></li><li><a href="../api-notification">Notification</a></li><li><a href="../api-config">Configuration</a></li><li><a href="../api-administrator">Administrator</a></li><li><a href="../api-bounce">Bounce</a></li></ul>', 1);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      _hoisted_2,
      createTextVNode("'s core function is implemented by two "),
      createBaseVNode("a", _hoisted_3, [
        createTextVNode("LoopBack models"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" - subscription and notification. Other models - configuration, administrator and bounces, are for administrative purposes. A LoopBack model determines the underlying database schema and the API. The APIs displayed in the web console (by default "),
      _hoisted_4,
      createTextVNode(") and API explorer are also grouped by the LoopBack models. Click on a LoopBack model in API explorer, say notification, to explore the operations on that model. Model specific APIs are available here:")
    ]),
    _hoisted_5
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-c7c126dd.js.map
