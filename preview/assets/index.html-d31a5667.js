import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "admin-ip-list",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#admin-ip-list",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Admin IP List")
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
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "localhost",
  -1
  /* HOISTED */
);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "adminIps",
  -1
  /* HOISTED */
);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "/src/config.ts",
  -1
  /* HOISTED */
);
const _hoisted_6 = /* @__PURE__ */ createStaticVNode('<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  adminIps<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>to modify, create config object <em>adminIps</em> with updated list in file <em>/src/config.local.js</em> instead. For example, to add ip range <em>192.168.0.0/24</em> to the list</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">adminIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;192.168.0.0/24&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>It should be noted that <em>NotifyBC</em> may generate http requests sending to itself. These http requests are expected to be admin requests. If you have created an app cluster such as in Kubernetes, you should add the cluster ip range to <em>adminIps</em>. In Kubernetes, this ip range is a private ip range. For example, in BCGov&#39;s OpenShift cluster OCP4, the ip range starts with octet 10.</p>', 4);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("By "),
      createVNode(_component_RouterLink, { to: "/docs/overview/#architecture" }, {
        default: withCtx(() => [
          createTextVNode("design")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(", "),
      _hoisted_2,
      createTextVNode(" classifies incoming requests into four types. For a request to be classified as super-admin, the request's source ip must be in admin ip list. By default, the list contains "),
      _hoisted_3,
      createTextVNode(" only as defined by "),
      _hoisted_4,
      createTextVNode(" in "),
      _hoisted_5
    ]),
    _hoisted_6
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-d31a5667.js.map
