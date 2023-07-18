import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="database" tabindex="-1"><a class="header-anchor" href="#database" aria-hidden="true">#</a> Database</h1><p>By default <em>NotifyBC</em> uses in-memory database backed up by file in <em>/server/database/data.json</em> for local and docker deployment and MongoDB for Kubernetes deployment. To use MongoDB for non-Kubernetes deployment, add file <em>/src/datasources/db.datasource.local.json</em> with MongoDB connection information such as following:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;db&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;connector&quot;</span><span class="token operator">:</span> <span class="token string">&quot;mongodb&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;host&quot;</span><span class="token operator">:</span> <span class="token string">&quot;127.0.0.1&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;database&quot;</span><span class="token operator">:</span> <span class="token string">&quot;notifyBC&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;port&quot;</span><span class="token operator">:</span> <span class="token number">27017</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 3);
const _hoisted_4 = {
  href: "https://loopback.io/doc/en/lb4/MongoDB-connector.html#creating-a-mongodb-data-source",
  target: "_blank",
  rel: "noopener noreferrer"
};
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("See "),
      createBaseVNode("a", _hoisted_4, [
        createTextVNode("LoopBack MongoDB data source"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" for more configurable properties.")
    ])
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-4c67cef1.js.map
