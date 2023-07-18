import { _ as _export_sfc, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "node-roles",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#node-roles",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Node Roles")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createTextVNode("In a multi-node deployment, some tasks should only be run by one node. That node is designated as "),
    /* @__PURE__ */ createBaseVNode("em", null, "master"),
    /* @__PURE__ */ createTextVNode(". The distinction is made using environment variable "),
    /* @__PURE__ */ createBaseVNode("em", null, "NOTIFYBC_NODE_ROLE"),
    /* @__PURE__ */ createTextVNode(". Setting to anything other than "),
    /* @__PURE__ */ createBaseVNode("em", null, "slave"),
    /* @__PURE__ */ createTextVNode(", including not set, will be regarded as "),
    /* @__PURE__ */ createBaseVNode("em", null, "master"),
    /* @__PURE__ */ createTextVNode(".")
  ],
  -1
  /* HOISTED */
);
const _hoisted_3 = [
  _hoisted_1,
  _hoisted_2
];
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", null, _hoisted_3);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-47ef5480.js.map
