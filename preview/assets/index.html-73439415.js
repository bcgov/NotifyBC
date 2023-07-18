import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="internal-http-host" tabindex="-1"><a class="header-anchor" href="#internal-http-host" aria-hidden="true">#</a> Internal HTTP Host</h1><p>By default, HTTP requests submitted by <em>NotifyBC</em> back to itself will be sent to <em>httpHost</em> if defined or the host of the incoming HTTP request that spawns such internal requests. But if config <em>internalHttpHost</em>, which has no default value, is defined, for example in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">internalHttpHost</span><span class="token operator">:</span> <span class="token string">&#39;http://notifybc:3000&#39;</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 3);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "internalHttpHost",
  -1
  /* HOISTED */
);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createTextVNode("All internal requests are supposed to be admin requests. The purpose of "),
    /* @__PURE__ */ createBaseVNode("em", null, "internalHttpHost"),
    /* @__PURE__ */ createTextVNode(" is to facilitate identifying the internal server ip as admin ip.")
  ],
  -1
  /* HOISTED */
);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode(
  "div",
  { class: "custom-container tip" },
  [
    /* @__PURE__ */ createBaseVNode("p", { class: "custom-container-title" }, "Kubernetes Use Case"),
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createTextVNode("The Kubernetes deployment script sets "),
      /* @__PURE__ */ createBaseVNode("i", null, "internalHttpHost"),
      /* @__PURE__ */ createTextVNode(" to "),
      /* @__PURE__ */ createBaseVNode("em", null, "notify-bc-app"),
      /* @__PURE__ */ createTextVNode(" service url in config map. The source ip in such case would be in a private Kubernetes ip range. You should add this private ip range to "),
      /* @__PURE__ */ createBaseVNode("a", { href: "#admin-ip-list" }, "admin ip list"),
      /* @__PURE__ */ createTextVNode(". The private ip range varies from Kubernetes installation. In BCGov's OCP4 cluster, it starts with octet 10.")
    ])
  ],
  -1
  /* HOISTED */
);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("then the HTTP request will be sent to the configured host. An internal request can be generated, for example, as a "),
      createVNode(_component_RouterLink, { to: "/docs/config-notification/#broadcast-push-notification-task-concurrency" }, {
        default: withCtx(() => [
          createTextVNode("sub-request of broadcast push notification")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(". "),
      _hoisted_4,
      createTextVNode(" shouldn't be accessible from internet.")
    ]),
    _hoisted_5,
    _hoisted_6
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-73439415.js.map
