import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "web-console",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#web-console",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Web Console")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "a",
  { href: "../installation" },
  "installing",
  -1
  /* HOISTED */
);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
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
  href: "http://localhost:3000",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "What you see in web console and what you get from API calls depend on how your requests are authenticated.",
  -1
  /* HOISTED */
);
const _hoisted_7 = /* @__PURE__ */ createBaseVNode(
  "h2",
  {
    id: "ip-whitelisting-authentication",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#ip-whitelisting-authentication",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Ip whitelisting authentication")
  ],
  -1
  /* HOISTED */
);
const _hoisted_8 = /* @__PURE__ */ createBaseVNode(
  "span",
  { class: "material-icons" },
  "verified_user",
  -1
  /* HOISTED */
);
const _hoisted_9 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "To see the result of non super-admin requests, you can choose one of the following methods",
  -1
  /* HOISTED */
);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "customize admin ip list to omit localhost (127.0.0.1)"),
    /* @__PURE__ */ createBaseVNode("li", null, "access web console from another ip not in the admin ip list")
  ],
  -1
  /* HOISTED */
);
const _hoisted_11 = /* @__PURE__ */ createBaseVNode(
  "h2",
  {
    id: "client-certificate-authentication",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#client-certificate-authentication",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Client certificate authentication")
  ],
  -1
  /* HOISTED */
);
const _hoisted_12 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_13 = /* @__PURE__ */ createBaseVNode(
  "span",
  { class: "material-icons" },
  "verified",
  -1
  /* HOISTED */
);
const _hoisted_14 = /* @__PURE__ */ createStaticVNode('<h2 id="anonymous" tabindex="-1"><a class="header-anchor" href="#anonymous" aria-hidden="true">#</a> Anonymous</h2><p>If you access web console from a client that is not in the admin ip list, you are by default anonymous user. Anonymous authentication status is indicated by the LOGIN<span class="material-icons">login</span> button on top right corner of web console. Click the button to login.</p><h2 id="access-token-authentication" tabindex="-1"><a class="header-anchor" href="#access-token-authentication" aria-hidden="true">#</a> Access token authentication</h2>', 3);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "Access Token",
  -1
  /* HOISTED */
);
const _hoisted_18 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "Access Token",
  -1
  /* HOISTED */
);
const _hoisted_19 = /* @__PURE__ */ createBaseVNode(
  "span",
  { class: "material-icons" },
  "login",
  -1
  /* HOISTED */
);
const _hoisted_20 = /* @__PURE__ */ createStaticVNode('<div class="custom-container warning"><p class="custom-container-title">Tokens are not shared between API Explorer and web console</p><p>Despite API Explorer appears to be part of web console, it is a separate application. At this point neither the access token nor the OIDC access token are shared between the two applications. You have to use API Explorer&#39;s <em>Authorize</em> button to authenticate even if you have logged into web console.</p></div><h2 id="oidc-authentication" tabindex="-1"><a class="header-anchor" href="#oidc-authentication" aria-hidden="true">#</a> OIDC authentication</h2><p>If you have configured OIDC, then the login button will direct you to OIDC provider&#39;s login page. Once login successfully, you will be redirected back to <em>NoitfyBC</em> web console. OIDC authentication status is indicated by the LOGOUT<span class="material-icons">logout</span> button.</p>', 3);
const _hoisted_23 = /* @__PURE__ */ createStaticVNode('<h2 id="siteminder-authentication" tabindex="-1"><a class="header-anchor" href="#siteminder-authentication" aria-hidden="true">#</a> SiteMinder authentication</h2><p>To get results of a SiteMinder authenticated user, do one of the following</p><ul><li>access the API via a SiteMinder proxy if you have configured SiteMinder properly</li><li>use a tool such as <em>curl</em> that allows to specify custom headers, and supply SiteMinder header <em>SM_USER</em>:</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token parameter variable">--header</span> <span class="token string">&quot;Accept: application/json&quot;</span> <span class="token punctuation">\\</span>\n    <span class="token parameter variable">--header</span> <span class="token string">&quot;SM_USER: foo&quot;</span> <span class="token punctuation">\\</span>\n    <span class="token string">&quot;http://localhost:3000/api/notifications&quot;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 4);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("After "),
      _hoisted_2,
      createTextVNode(),
      _hoisted_3,
      createTextVNode(", you can start exploring "),
      _hoisted_4,
      createTextVNode(" resources by opening web console, a curated GUI, at "),
      createBaseVNode("a", _hoisted_5, [
        createTextVNode("http://localhost:3000"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". You can further explore full-blown APIs by clicking the API explorer Swagger UI embedded in web console.")
    ]),
    createBaseVNode("p", null, [
      createTextVNode("Consult the "),
      createVNode(_component_RouterLink, { to: "/docs/api-overview/" }, {
        default: withCtx(() => [
          createTextVNode("API docs")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" for valid inputs and expected outcome while you are exploring the APIs. Once you are familiar with the APIs, you can start writing code to call the APIs from either user browser or from a server application.")
    ]),
    _hoisted_6,
    _hoisted_7,
    createBaseVNode("p", null, [
      createTextVNode("The API calls you made with API explorer as well as API calls made by web console from localhost are by default authenticated as "),
      createVNode(_component_RouterLink, { to: "/docs/overview/#architecture" }, {
        default: withCtx(() => [
          createTextVNode("super-admin requests")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" because localhost is in "),
      createVNode(_component_RouterLink, { to: "/docs/config-adminIpList/" }, {
        default: withCtx(() => [
          createTextVNode("admin ip list")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" by default. Ip whitelisting authentication status is indicated by the "),
      _hoisted_8,
      createTextVNode(" icon on top right corner of web console.")
    ]),
    _hoisted_9,
    _hoisted_10,
    _hoisted_11,
    createBaseVNode("p", null, [
      createTextVNode("If your ip is not in the admin ip list but you have setup a client certificate issued by "),
      _hoisted_12,
      createTextVNode(" server in browser, the API calls you made with API explorer as well as API calls made by web console are also authenticated as "),
      createVNode(_component_RouterLink, { to: "/docs/overview/#architecture" }, {
        default: withCtx(() => [
          createTextVNode("super-admin requests")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(". Client certificate authentication status is indicated by the "),
      _hoisted_13,
      createTextVNode(" icon on top right corner of web console.")
    ]),
    _hoisted_14,
    createBaseVNode("p", null, [
      createTextVNode("If you have not configured "),
      createVNode(_component_RouterLink, { to: "/docs/config/oidc.html" }, {
        default: withCtx(() => [
          createTextVNode("OIDC")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(", the login button opens a login form. After successful login, the login button is replaced with the "),
      _hoisted_17,
      createTextVNode(" text field on top right corner of web console. You can edit the text field. If the new access token you entered is invalid, you are essentially logging yourself out. In such case "),
      _hoisted_18,
      createTextVNode(" text field is replaced by the LOGIN"),
      _hoisted_19,
      createTextVNode(" button.")
    ]),
    createBaseVNode("p", null, [
      createTextVNode("The procedure to create an admin login account is documented in "),
      createVNode(_component_RouterLink, { to: "/docs/api/administrator.html" }, {
        default: withCtx(() => [
          createTextVNode("Administrator API")
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _hoisted_20,
    createBaseVNode("p", null, [
      createTextVNode("If you passed "),
      createVNode(_component_RouterLink, { to: "/docs/config/oidc.html" }, {
        default: withCtx(() => [
          createTextVNode("isAdmin")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" validation, you are admin; otherwise you are authenticated user.")
    ]),
    _hoisted_23
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-155e6c54.js.map
