import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "sms",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#sms",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" SMS")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "h2",
  {
    id: "provider",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#provider",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Provider")
  ],
  -1
  /* HOISTED */
);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "NotifyBC"),
    /* @__PURE__ */ createTextVNode(" depends on underlying SMS service providers to deliver SMS messages. The supported service providers are")
  ],
  -1
  /* HOISTED */
);
const _hoisted_4 = {
  href: "https://twilio.com/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_5 = {
  href: "https://www.swiftsmsgateway.com",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = /* @__PURE__ */ createStaticVNode('<p>Only one service provider can be chosen per installation. To change service provider, add following config to file <em>/src/config.local.js</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  sms<span class="token operator">:</span> <span class="token punctuation">{</span>\n    provider<span class="token operator">:</span> <span class="token string">&#39;swift&#39;</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="provider-settings" tabindex="-1"><a class="header-anchor" href="#provider-settings" aria-hidden="true">#</a> Provider Settings</h2><p>Provider specific settings are defined in config <em>sms.providerSettings</em>. You should have an account with the chosen service provider before proceeding.</p><h3 id="twilio" tabindex="-1"><a class="header-anchor" href="#twilio" aria-hidden="true">#</a> Twilio</h3><p>Add <em>sms.providerSettings.twilio</em> config object to file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">providerSettings</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">twilio</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">accountSid</span><span class="token operator">:</span> <span class="token string">&#39;&lt;AccountSid&gt;&#39;</span><span class="token punctuation">,</span>\n        <span class="token literal-property property">authToken</span><span class="token operator">:</span> <span class="token string">&#39;&lt;AuthToken&gt;&#39;</span><span class="token punctuation">,</span>\n        <span class="token literal-property property">fromNumber</span><span class="token operator">:</span> <span class="token string">&#39;&lt;FromNumber&gt;&#39;</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Obtain <em>&lt;AccountSid&gt;</em>, <em>&lt;AuthToken&gt;</em> and <em>&lt;FromNumber&gt;</em> from your Twilio account.</p><h3 id="swift" tabindex="-1"><a class="header-anchor" href="#swift" aria-hidden="true">#</a> Swift</h3><p>Add <em>sms.providerSettings.swift</em> config object to file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">providerSettings</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">swift</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">accountKey</span><span class="token operator">:</span> <span class="token string">&#39;&lt;accountKey&gt;&#39;</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Obtain <em>&lt;accountKey&gt;</em> from your Swift account.</p><h4 id="unsubscription-by-replying-a-keyword" tabindex="-1"><a class="header-anchor" href="#unsubscription-by-replying-a-keyword" aria-hidden="true">#</a> Unsubscription by replying a keyword</h4><p>With Swift short code, sms user can unsubscribe by replying to a sms message with a keyword. The keyword must be pre-registered with Swift.</p><p>To enable this feature,</p>', 15);
const _hoisted_21 = /* @__PURE__ */ createStaticVNode('<li><p>Generate a random string, hereafter referred to as <em>&lt;randomly-generated-string&gt;</em></p></li><li><p>Add it to <em>sms.providerSettings.swift.notifyBCSwiftKey</em> in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">providerSettings</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">swift</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">notifyBCSwiftKey</span><span class="token operator">:</span> <span class="token string">&#39;&lt;randomly-generated-string&gt;&#39;</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Go to Swift web admin console, click <em>Number Management</em> tab</p></li><li><p>Click <em>Launch</em> button next to <em>Manage Short Code Keywords</em></p></li><li><p>Click <em>Features</em> button next to the registered keyword(s). A keyword may have multiple entries. In such case do this for each entry.</p></li><li><p>Click <em>Redirect To Webpage</em> tab in the popup window</p></li>', 6);
const _hoisted_27 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "Enter following information in the tab",
  -1
  /* HOISTED */
);
const _hoisted_28 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "URL",
  -1
  /* HOISTED */
);
const _hoisted_29 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "<NotifyBCHttpHost>/api/subscriptions/swift",
  -1
  /* HOISTED */
);
const _hoisted_30 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "<NotifyBCHttpHost>",
  -1
  /* HOISTED */
);
const _hoisted_31 = /* @__PURE__ */ createStaticVNode("<li>set <em>Method</em> to <em>POST</em></li><li>set <em>Custom Parameter 1 Name</em> to <em>notifyBCSwiftKey</em></li><li>set <em>Custom Parameter 1 Value</em> to <em>&lt;randomly-generated-string&gt;</em></li>", 3);
const _hoisted_34 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createTextVNode("Click "),
      /* @__PURE__ */ createBaseVNode("em", null, "Save Changes"),
      /* @__PURE__ */ createTextVNode(" button and then "),
      /* @__PURE__ */ createBaseVNode("em", null, "Done")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_35 = /* @__PURE__ */ createStaticVNode('<h2 id="throttle" tabindex="-1"><a class="header-anchor" href="#throttle" aria-hidden="true">#</a> Throttle</h2><p>All supported SMS service providers impose request rate limit. <em>NotifyBC</em> by default throttles request rate to 4/sec. To adjust the rate, create following config in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// minimum request interval in ms</span>\n      <span class="token literal-property property">minTime</span><span class="token operator">:</span> <span class="token number">250</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>When <em>NotifyBC</em> is deployed from source code, by default the rate limit applies to one Node.js process only. If there are multiple processes, i.e. a cluster, the aggregated rate limit is multiplied by the number of processes. To enforce the rate limit across entire cluster, install Redis and add Redis config to <em>sms.throttle</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">/* Redis clustering options */</span>\n      <span class="token literal-property property">datastore</span><span class="token operator">:</span> <span class="token string">&#39;ioredis&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">clientOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">,</span>\n        <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">6379</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you installed Redis Sentinel,</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">/* Redis clustering options */</span>\n      <span class="token literal-property property">datastore</span><span class="token operator">:</span> <span class="token string">&#39;ioredis&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">clientOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;mymaster&#39;</span><span class="token punctuation">,</span>\n        <span class="token literal-property property">sentinels</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">26379</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 7);
const _hoisted_42 = {
  href: "https://github.com/SGrondin/bottleneck",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_43 = {
  href: "https://github.com/luin/ioredis",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_44 = /* @__PURE__ */ createStaticVNode('<p>When <em>NotifyBC</em> is deployed to Kubernetes using Helm, by default throttle uses Redis Sentinel therefore rate limit applies to whole cluster.</p><p>To disable throttle, set <em>sms.throttle.enabled</em> to <em>false</em> in file /src/config.local.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 3);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    _hoisted_2,
    _hoisted_3,
    createBaseVNode("ul", null, [
      createBaseVNode("li", null, [
        createBaseVNode("a", _hoisted_4, [
          createTextVNode("Twilio"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(" (default)")
      ]),
      createBaseVNode("li", null, [
        createBaseVNode("a", _hoisted_5, [
          createTextVNode("Swift"),
          createVNode(_component_ExternalLinkIcon)
        ])
      ])
    ]),
    _hoisted_6,
    createBaseVNode("ol", null, [
      _hoisted_21,
      createBaseVNode("li", null, [
        _hoisted_27,
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("set "),
            _hoisted_28,
            createTextVNode(" to "),
            _hoisted_29,
            createTextVNode(", where "),
            _hoisted_30,
            createTextVNode(" is NotifyBC HTTP host name and should be the same as "),
            createVNode(_component_RouterLink, { to: "/docs/config-httpHost/" }, {
              default: withCtx(() => [
                createTextVNode("HTTP Host")
              ]),
              _: 1
              /* STABLE */
            }),
            createTextVNode(" config")
          ]),
          _hoisted_31
        ])
      ]),
      _hoisted_34
    ]),
    _hoisted_35,
    createBaseVNode("p", null, [
      createTextVNode("Throttle is implemented using "),
      createBaseVNode("a", _hoisted_42, [
        createTextVNode("Bottleneck"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" and "),
      createBaseVNode("a", _hoisted_43, [
        createTextVNode("ioredis"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". See their documentations for more configurations.")
    ]),
    _hoisted_44
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-121376be.js.map
