import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "oidc",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#oidc",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" OIDC")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "NotifyBC"),
    /* @__PURE__ */ createTextVNode(" currently can only authenticate RSA signed OIDC access token if the token is a JWT. OIDC providers such as Keycloak meet the requirement.")
  ],
  -1
  /* HOISTED */
);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createTextVNode("To enable OIDC authentication strategy, add "),
    /* @__PURE__ */ createBaseVNode("em", null, "oidc"),
    /* @__PURE__ */ createTextVNode(" configuration object to "),
    /* @__PURE__ */ createBaseVNode("em", null, "/src/config.local.js"),
    /* @__PURE__ */ createTextVNode(". The object supports following properties")
  ],
  -1
  /* HOISTED */
);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "discoveryUrl",
  -1
  /* HOISTED */
);
const _hoisted_5 = {
  href: "https://openid.net/specs/openid-connect-discovery-1_0.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = /* @__PURE__ */ createStaticVNode("<li><em>clientId</em> - OIDC client id</li><li><em>isAdmin</em> - a predicate function to determine if authenticated user is <em>NotifyBC</em> administrator. The function takes the decoded OIDC access token JWT payload as input user object and should return either a boolean or a promise of boolean, i.e. the function can be both sync or async.</li><li><em>isAuthorizedUser</em> - an optional predicate function to determine if authenticated user is an authorized <em>NotifyBC</em> user. If omitted, any authenticated user is authorized <em>NotifyBC</em> user. This function has same signature as <em>isAdmin</em></li>", 3);
const _hoisted_9 = /* @__PURE__ */ createStaticVNode('<p>A example of complete OIDC configuration looks like</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token operator">...</span>\n  <span class="token literal-property property">oidc</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">discoveryUrl</span><span class="token operator">:</span>\n      <span class="token string">&#39;https://op.example.com/auth/realms/foo/.well-known/openid-configuration&#39;</span><span class="token punctuation">,</span>\n    <span class="token literal-property property">clientId</span><span class="token operator">:</span> <span class="token string">&#39;NotifyBC&#39;</span><span class="token punctuation">,</span>\n    <span class="token function">isAdmin</span><span class="token punctuation">(</span><span class="token parameter">user</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> roles <span class="token operator">=</span> user<span class="token punctuation">.</span>resource_access<span class="token punctuation">.</span>NotifyBC<span class="token punctuation">.</span>roles<span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>roles <span class="token keyword">instanceof</span> <span class="token class-name">Array</span><span class="token punctuation">)</span> <span class="token operator">||</span> roles<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      <span class="token keyword">return</span> roles<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">&#39;admin&#39;</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token function">isAuthorizedUser</span><span class="token punctuation">(</span><span class="token parameter">user</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> user<span class="token punctuation">.</span>realm_access<span class="token punctuation">.</span>roles<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">&#39;offline_access&#39;</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In <em>NotifyBC</em> web console and only in the web console, OIDC authentication takes precedence over built-in admin user, meaning if OIDC is configured, the login button goes to OIDC provider rather than the login form.</p><p>There is no default OIDC configuration in <em>/src/config.ts</em>.</p>', 4);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    _hoisted_2,
    _hoisted_3,
    createBaseVNode("ol", null, [
      createBaseVNode("li", null, [
        _hoisted_4,
        createTextVNode(" - "),
        createBaseVNode("a", _hoisted_5, [
          createTextVNode("OIDC discovery"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(" url")
      ]),
      _hoisted_6
    ]),
    _hoisted_9
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-aee2c883.js.map
