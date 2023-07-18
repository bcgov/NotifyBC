import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h1><p>The configuration API, accessible by only super-admin requests, is used to define dynamic configurations. Dynamic configuration is needed in situations like</p><ul><li>RSA key pair generated automatically at boot time if not present</li><li>service-specific subscription confirmation request message template</li></ul><h2 id="model-schema" tabindex="-1"><a class="header-anchor" href="#model-schema" aria-hidden="true">#</a> Model Schema</h2><p>The API operates on following configuration data model fields:</p><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p><p class="description">config id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">name</p><p class="description">config name</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">value</p><div class="description">config value. </div></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">serviceName</p><p class="description">name of the service the config applicable to</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h2 id="get-configurations" tabindex="-1"><a class="header-anchor" href="#get-configurations" aria-hidden="true">#</a> Get Configurations</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /configurations\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 8);
const _hoisted_9 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_11 = {
  href: "https://loopback.io/doc/en/lb4/Querying-data.html#filters",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_12 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: filter"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_13 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "outcome"),
    /* @__PURE__ */ createBaseVNode("p", null, "For admin request, a list of config items matching the filter; forbidden for user request")
  ],
  -1
  /* HOISTED */
);
const _hoisted_14 = /* @__PURE__ */ createStaticVNode('<p>example</p><p>to retrieve config items with name <em>rsa</em>, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token parameter variable">--header</span> <span class="token string">&#39;Accept: application/json&#39;</span> <span class="token string">&#39;http://localhost:3000/api/configurations?filter=%7B%22where%22%3A%20%7B%22name%22%3A%22rsa%22%7D%7D&#39;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 3);
const _hoisted_17 = {
  href: "https://loopback.io/doc/en/lb4/Querying-data.html#using-stringified-json-in-rest-queries",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_18 = /* @__PURE__ */ createStaticVNode('<div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span><span class="token property">&quot;where&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;rsa&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 1);
const _hoisted_19 = /* @__PURE__ */ createStaticVNode('<h2 id="create-a-configuration" tabindex="-1"><a class="header-anchor" href="#create-a-configuration" aria-hidden="true">#</a> Create a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /configurations\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>an object containing configuration data model fields. At a minimum all required fields that don&#39;t have a default value must be supplied. Id field should be omitted since it&#39;s auto-generated. The API explorer only created an empty object for field <em>value</em> but you should populate the child fields. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> performs following actions in sequence</p><ol><li>if it’s a user request, error is returned</li><li>inputs are validated. For example, required fields without default values must be populated. If validation fails, error is returned</li><li>if config item is <em>notification</em> with field <em>value.rss</em> populated, and if the field <em>value.httpHost</em> is missing, it is generated using this request&#39;s HTTP protocol , host name and port.</li><li>item is saved to database</li></ol></li></ul>', 3);
const _hoisted_22 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "example",
  -1
  /* HOISTED */
);
const _hoisted_23 = /* @__PURE__ */ createStaticVNode('<h2 id="update-a-configuration" tabindex="-1"><a class="header-anchor" href="#update-a-configuration" aria-hidden="true">#</a> Update a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /configurations/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>an object containing fields to be updated. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>Similar to <em>POST</em> except field <em>update</em> is always updated with current timestamp.</p></li></ul><h2 id="delete-a-configuration" tabindex="-1"><a class="header-anchor" href="#delete-a-configuration" aria-hidden="true">#</a> Delete a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /configurations/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><p>For admin request, delete the config item requested; forbidden for user request</p></li></ul><h2 id="replace-a-configuration" tabindex="-1"><a class="header-anchor" href="#replace-a-configuration" aria-hidden="true">#</a> Replace a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /configurations/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is intended to be only used by admin web console to modify a configuration.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>configuration data <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>For admin requests, replace configuration identified by <em>id</em> with parameter <em>data</em> and save to database.</p></li></ul>', 10);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("ul", null, [
      _hoisted_9,
      createBaseVNode("li", null, [
        _hoisted_10,
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("a "),
            createBaseVNode("a", _hoisted_11, [
              createTextVNode("filter"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            createTextVNode(" defining fields, where, include, order, offset, and limit "),
            _hoisted_12
          ])
        ])
      ]),
      _hoisted_13,
      createBaseVNode("li", null, [
        _hoisted_14,
        createBaseVNode("p", null, [
          createTextVNode("the value of filter query parameter is the "),
          createBaseVNode("a", _hoisted_17, [
            createTextVNode("stringified JSON"),
            createVNode(_component_ExternalLinkIcon)
          ])
        ]),
        _hoisted_18
      ])
    ]),
    _hoisted_19,
    createBaseVNode("ul", null, [
      createBaseVNode("li", null, [
        _hoisted_22,
        createBaseVNode("p", null, [
          createTextVNode("see the cURL command on how to create a "),
          createVNode(_component_RouterLink, { to: "/docs/configuration/#subscription-confirmation-request-template" }, {
            default: withCtx(() => [
              createTextVNode("Subscription Confirmation Request Template")
            ]),
            _: 1
            /* STABLE */
          })
        ])
      ])
    ]),
    _hoisted_23
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-cd5e0b30.js.map
