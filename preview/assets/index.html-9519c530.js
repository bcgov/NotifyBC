import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "reverse-proxy-ip-lists",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#reverse-proxy-ip-lists",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Reverse Proxy IP Lists")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = {
  href: "https://en.wikipedia.org/wiki/Dot-decimal_notation",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_3 = {
  href: "https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "siteMinderReverseProxyIps"),
    /* @__PURE__ */ createTextVNode(" contains a list of ips or ranges of SiteMinder Web Agents. If set, then the SiteMinder HTTP headers are trusted only if the request is routed from the listed nodes.")
  ],
  -1
  /* HOISTED */
);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "trustedReverseProxyIps",
  -1
  /* HOISTED */
);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_7 = {
  href: "https://expressjs.com/en/guide/behind-proxies.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_8 = /* @__PURE__ */ createStaticVNode('<p>By default <em>trustedReverseProxyIps</em> is empty and <em>siteMinderReverseProxyIps</em> contains only localhost as defined in <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  siteMinderReverseProxyIps<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To modify, add following objects to file /src/config.local.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">siteMinderReverseProxyIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;130.32.12.0&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token literal-property property">trustedReverseProxyIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;172.17.0.0/16&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The rule to determine if the incoming request is authenticated by SiteMinder is</p>', 5);
const _hoisted_13 = {
  href: "https://expressjs.com/en/guide/behind-proxies.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_14 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("if the real client ip is contained in "),
    /* @__PURE__ */ createBaseVNode("em", null, "siteMinderReverseProxyIps"),
    /* @__PURE__ */ createTextVNode(", then the request is from SiteMinder, and its SiteMinder headers are trusted; otherwise, the request is considered as directly from internet, and its SiteMinder headers are ignored.")
  ],
  -1
  /* HOISTED */
);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("SiteMinder, being a gateway approached SSO solution, expects the backend HTTP access point of the web sites it protests to be firewall restricted, otherwise the SiteMinder injected HTTP headers can be easily spoofed. However, the restriction cannot be easily implemented on PAAS such as OpenShift. To mitigate, two configuration objects are introduced to create an application-level firewall, both are arrays of ip addresses in the format of "),
      createBaseVNode("a", _hoisted_2, [
        createTextVNode("dot-decimal"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" or "),
      createBaseVNode("a", _hoisted_3, [
        createTextVNode("CIDR"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" notation")
    ]),
    createBaseVNode("ul", null, [
      _hoisted_4,
      createBaseVNode("li", null, [
        _hoisted_5,
        createTextVNode(" contains a list of ips or ranges of trusted reverse proxies between the SiteMinder Web Agents and "),
        _hoisted_6,
        createTextVNode(" application. When running on OpenShift, this is usually the OpenShift router. Express.js "),
        createBaseVNode("a", _hoisted_7, [
          createTextVNode("trust proxy"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(" is set to this config object.")
      ])
    ]),
    _hoisted_8,
    createBaseVNode("ol", null, [
      createBaseVNode("li", null, [
        createTextVNode("obtain the real client ip address by filtering out trusted proxy ips according to "),
        createBaseVNode("a", _hoisted_13, [
          createTextVNode("Express behind proxies"),
          createVNode(_component_ExternalLinkIcon)
        ])
      ]),
      _hoisted_14
    ])
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-9519c530.js.map
