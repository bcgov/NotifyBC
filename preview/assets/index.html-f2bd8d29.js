import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "middleware",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#middleware",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Middleware")
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
  href: "https://expressjs.com/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "/src/middleware.ts",
  -1
  /* HOISTED */
);
const _hoisted_5 = {
  href: "https://www.npmjs.com/package/serve-favicon",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = {
  href: "https://www.npmjs.com/package/compression",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_7 = {
  href: "https://www.npmjs.com/package/helmet",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_8 = {
  href: "https://www.npmjs.com/package/morgan",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_9 = /* @__PURE__ */ createStaticVNode('<p><em>/src/middleware.ts</em> contains following default middleware settings</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span><span class="token punctuation">;</span>\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  all<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string-property property">&#39;serve-favicon&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>params<span class="token operator">:</span> <span class="token punctuation">[</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&#39;..&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;favicon.ico&#39;</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    compression<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    helmet<span class="token operator">:</span> <span class="token punctuation">{</span>\n      params<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          hsts<span class="token operator">:</span> <span class="token punctuation">{</span>\n            maxAge<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n          <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  apiOnly<span class="token operator">:</span> <span class="token punctuation">{</span>\n    morgan<span class="token operator">:</span> <span class="token punctuation">{</span>\n      params<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">&#39;:remote-addr - :remote-user [:date[clf]] &quot;:method :url HTTP/:http-version&quot; :status &quot;:req[X-Forwarded-For]&quot;&#39;</span><span class="token punctuation">,</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      enabled<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>/src/middleware.ts</em> has following structure</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  all<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string-property property">&#39;&lt;middlewareName&gt;&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>params<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  apiOnly<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string-property property">&#39;&lt;middlewareName&gt;&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>params<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Middleware defined under <em>all</em> applies to both API and web console requests, as opposed to <em>apiOnly</em>, which applies to API requests only. <em>params</em> are passed to middleware function as arguments. <em>enabled</em> toggles the middleware on or off.</p><p>To change default settings defined in <em>/src/middleware.ts</em>, create file <em>/src/middleware.local.ts</em> or <em>/src/middleware.&lt;env&gt;.ts</em> to override. For example, to enable access log,</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  apiOnly<span class="token operator">:</span> <span class="token punctuation">{</span>\n    morgan<span class="token operator">:</span> <span class="token punctuation">{</span>\n      enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 7);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      _hoisted_2,
      createTextVNode(" pre-installed following "),
      createBaseVNode("a", _hoisted_3, [
        createTextVNode("Express"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" middleware as defined in "),
      _hoisted_4
    ]),
    createBaseVNode("ul", null, [
      createBaseVNode("li", null, [
        createBaseVNode("a", _hoisted_5, [
          createTextVNode("serve-favicon"),
          createVNode(_component_ExternalLinkIcon)
        ])
      ]),
      createBaseVNode("li", null, [
        createBaseVNode("a", _hoisted_6, [
          createTextVNode("compression"),
          createVNode(_component_ExternalLinkIcon)
        ])
      ]),
      createBaseVNode("li", null, [
        createBaseVNode("a", _hoisted_7, [
          createTextVNode("helmet"),
          createVNode(_component_ExternalLinkIcon)
        ])
      ]),
      createBaseVNode("li", null, [
        createBaseVNode("a", _hoisted_8, [
          createTextVNode("morgan"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(" (disabled by default)")
      ])
    ]),
    _hoisted_9
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-f2bd8d29.js.map
