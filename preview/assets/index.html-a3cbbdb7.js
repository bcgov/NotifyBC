import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "bulk-import",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#bulk-import",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Bulk Import")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createTextVNode("To facilitate migrating subscriptions from other notification systems, "),
    /* @__PURE__ */ createBaseVNode("em", null, "NotifyBC"),
    /* @__PURE__ */ createTextVNode(" provides a utility script to bulk import subscription data from a .csv file. To use the utility, you need")
  ],
  -1
  /* HOISTED */
);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("Software installed "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "Node.js"),
      /* @__PURE__ */ createBaseVNode("li", null, "Git")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_5 = {
  href: "https://github.com/bcgov/NotifyBC/tree/main/src/utils/bulk-import/sample-subscription.csv",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "confirmationRequest.sendRequest",
  -1
  /* HOISTED */
);
const _hoisted_7 = /* @__PURE__ */ createStaticVNode('<p>To run the utility</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git\n<span class="token builtin class-name">cd</span> NotifyBC\n<span class="token function">npm</span> i <span class="token parameter variable">-g</span> <span class="token function">yarn</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build\n<span class="token function">node</span> dist/utils/bulk-import/subscription.js <span class="token parameter variable">-a</span> <span class="token operator">&lt;</span>api-url-prefix<span class="token operator">&gt;</span> <span class="token parameter variable">-c</span> <span class="token operator">&lt;</span>concurrency<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>csv-file-path<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Here &lt;csv-file-path&gt; is the path to csv file and &lt;api-url-prefix&gt; is the <em>NotifyBC</em> api url prefix , default to <em>http://localhost:3000/api</em>.</p><p>The script parses the csv file and generates a HTTP post request for each row. The concurrency of HTTP request is controlled by option <em>-c</em> which is default to 10 if omitted. A successful run should output the number of rows imported without any error message</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>success row count = ***\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="field-parsers" tabindex="-1"><a class="header-anchor" href="#field-parsers" aria-hidden="true">#</a> Field Parsers</h3>', 6);
const _hoisted_13 = {
  href: "https://github.com/Keyang/node-csvtojson#custom-parsers",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_14 = {
  href: "https://github.com/bcgov/NotifyBC/tree/main/src/utils/bulk-import/subscription.ts",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_15 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "src/utils/bulk-import/subscription.ts",
  -1
  /* HOISTED */
);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "myCustomIntegerField",
  -1
  /* HOISTED */
);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "colParser",
  -1
  /* HOISTED */
);
const _hoisted_18 = /* @__PURE__ */ createStaticVNode('<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>  <span class="token literal-property property">colParser</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token operator">...</span>\n    <span class="token punctuation">,</span> <span class="token function-variable function">myCustomIntegerField</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">item<span class="token punctuation">,</span> head<span class="token punctuation">,</span> resultRow<span class="token punctuation">,</span> row<span class="token punctuation">,</span> colIdx</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 1);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    _hoisted_2,
    createBaseVNode("ul", null, [
      _hoisted_3,
      createBaseVNode("li", null, [
        createTextVNode("Admin Access to a "),
        _hoisted_4,
        createTextVNode(" instance by adding your client ip to the "),
        createVNode(_component_RouterLink, { to: "/docs/config-adminIpList/" }, {
          default: withCtx(() => [
            createTextVNode("Admin IP List")
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      createBaseVNode("li", null, [
        createTextVNode("a csv file with header row matching "),
        createVNode(_component_RouterLink, { to: "/docs/api-subscription/#model-schema" }, {
          default: withCtx(() => [
            createTextVNode("subscription model schema")
          ]),
          _: 1
          /* STABLE */
        }),
        createTextVNode(". A sample csv file is "),
        createBaseVNode("a", _hoisted_5, [
          createTextVNode("provided"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(". Compound fields (of object type) should be dot-flattened as shown in the sample for field "),
        _hoisted_6
      ])
    ]),
    _hoisted_7,
    createBaseVNode("p", null, [
      createTextVNode("The utility script takes care of type conversion for built-in fields. If you need to import proprietary fields, by default the fields are imported as strings. To import non-string fields or manipulating json output, you need to define "),
      createBaseVNode("a", _hoisted_13, [
        createTextVNode("custom parsers"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" in file "),
      createBaseVNode("a", _hoisted_14, [
        _hoisted_15,
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". For example, to parse "),
      _hoisted_16,
      createTextVNode(" to integer, add in the "),
      _hoisted_17,
      createTextVNode(" object")
    ]),
    _hoisted_18
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-a3cbbdb7.js.map
