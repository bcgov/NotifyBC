import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="quick-start" tabindex="-1"><a class="header-anchor" href="#quick-start" aria-hidden="true">#</a> Quick Start</h1><p>For the impatient, here&#39;s how to get a boilerplate <em>NotifyBC</em> instance up and running if you have git and node.js installed:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git\n<span class="token builtin class-name">cd</span> NotifyBC\n<span class="token function">npm</span> i <span class="token parameter variable">-g</span> <span class="token function">yarn</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build\n<span class="token function">yarn</span> start\n<span class="token comment"># =&gt; Now browse to http://localhost:3000</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 3);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("If you're running into problems, check out full "),
      createVNode(_component_RouterLink, { to: "/docs/installation/" }, {
        default: withCtx(() => [
          createTextVNode("installation")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" guide.")
    ])
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-941714ad.js.map
