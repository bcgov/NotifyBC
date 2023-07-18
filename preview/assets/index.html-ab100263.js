import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "rsa-keys",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#rsa-keys",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" RSA Keys")
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
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "cURL",
  -1
  /* HOISTED */
);
const _hoisted_4 = /* @__PURE__ */ createStaticVNode('<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token string">&#39;http://localhost:3000/api/configurations?filter=%7B%22where%22%3A%20%7B%22name%22%3A%20%22rsa%22%7D%7D&#39;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>or you can open API explorer, expand <code>GET /configurations</code> and set filter to</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span><span class="token property">&quot;where&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;rsa&quot;</span><span class="token punctuation">}</span><span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The response should be something like</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;rsa&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">&quot;private&quot;</span><span class="token operator">:</span> <span class="token string">&quot;-----BEGIN RSA PRIVATE KEY-----\\nMIIEpgIBAAKCAQEA8Hl+/cF3AOxKVRHtZpeSDM+LLGc2hkDkKxRXe72maUAzDUoO\\noNd6wd02Cf6iO7kj0RSDHXUyINxCgvXy2Q7gME4zRN5WG4ItWZ7FITeNgJJW1r+J\\nshDjTwKVpMvcKHy0vyUl25ah7hnwGK6PbJvFWMmtIBw6Rs5DaERAlmilgkuUgdri\\naA4YhhS4pCJLvO2p9wZd+dLWUT+tpsOZGeecC8If3fyShgrocMbd8pYYDzf65oCt\\nVaLaNdERaIJSDcmbHxFpeBdEQEzxw2qRPbUCnSgQb8cVFLJ2eOEn5LylWhU96A1S\\n3w1IlRm5N2zG0En58Vruo26gEtl5KFu0zivlawIDAQABAoIBAQCAawFsFcKtVYIk\\nh9xVax/tg2/5GG0/qKuwbb6CMDcMAeLBeAjzz96YZL+U+sw8RJRh9ShHtOw+LCHA\\nugMj8xO5+Cjc4DbvnccGEwmGwZnpTTzelY687tPUv7aWON+rJ12GrhnXeEulUWis\\nZZvmDhGHZrvzZ9+fLEtHBRvQtrWcLCN0G5l1Z1KEWUj23vn1HZpfNvqigIbC05Pq\\nWUewRZShHUklhzky6DwLklWUKv2951ypd5CHhYfXn0eXjeyqcoYeZzoCSGqtvZar\\nVVOCPBKPn3cLZVKzYd02WO4CV07SpHCBtYPWf4OvXbOY6wV1Vc92S0K+ijASDDc0\\nB7Vjgb8RAoGBAPg4dSbn9GWNHydveidi2Zt4kftEW18C9xHbJ3t+QkhpLjq2kwcY\\no0iOWkEd4d1l0lKAVanBQazrazKiSyq1PJSJDyL3osHItA7Twq+gCXOfXw/0LbJh\\napK5DH3S2ZTM42wOdZLYIHvSqRuYUmnzhy9+Ads87b/ICCctUMCLz1afAoGBAPgC\\n4/zE/Au/A3wb48AywfmJ5kqPO0V7lqLrn/aBwdF1H/DHQ95cSuKrTEIysZxz52bh\\n7mAHjnWnY4zFNaUvcruHw78NOxUJvje8cDIUsrTefh+qmctiGR119z7iso9FlsxR\\np/o5BVT/K8q76xtkpOln2A0rc8sBNwtCoeeUzfm1AoGBAInH/O99raF49iQTswCN\\n1DCCerW4uedBZBebSI06BlzfVXPtyCsWN/ycV+jxR2B3lomJBwPVbDkp7DUM9SBd\\nvaTNd4N3ZfafC6N3VAfck6KEgmX+qibsABY1dYOaOIBqQorGc+jw4wcYZhoVMRny\\nvcVU8n7ZkTb1N+FXPA3FDXANAoGBAOuSg0/TI71cgEjgjOJA1DLco1vq1NfY3mp9\\n+QFCmwEDiYVBINwTOiY3o0W1tTLwfLoinDOmudBTYKGTqLLwcMBj4rCUNqxzBrUW\\nTlOjiWN3esFFYLPoyAZNyL14wzaHWQdWAIISq1fi0IvPFzB71pDFTFimD2SiENCn\\nR/YaR9OJAoGBAM21MRvTEMHF/EvqZ/X6t2zm9dtA22L2LeVy68aEdo82F/1RFvCM\\nGBWjGS7G7fXk/tV/YHbjibhgktvLu3Rss1wlHfGEjtDAIdp9dqH0cNxMgy/eTfoy\\nFfzV3l7pNSdILn1bNqoMz9CaYK7CGIYpBWCbRJlRSYw2FHJwl5tzgmkk\\n-----END RSA PRIVATE KEY-----&quot;</span><span class="token punctuation">,</span>\n      <span class="token property">&quot;public&quot;</span><span class="token operator">:</span> <span class="token string">&quot;-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8Hl+/cF3AOxKVRHtZpeS\\nDM+LLGc2hkDkKxRXe72maUAzDUoOoNd6wd02Cf6iO7kj0RSDHXUyINxCgvXy2Q7g\\nME4zRN5WG4ItWZ7FITeNgJJW1r+JshDjTwKVpMvcKHy0vyUl25ah7hnwGK6PbJvF\\nWMmtIBw6Rs5DaERAlmilgkuUgdriaA4YhhS4pCJLvO2p9wZd+dLWUT+tpsOZGeec\\nC8If3fyShgrocMbd8pYYDzf65oCtVaLaNdERaIJSDcmbHxFpeBdEQEzxw2qRPbUC\\nnSgQb8cVFLJ2eOEn5LylWhU96A1S3w1IlRm5N2zG0En58Vruo26gEtl5KFu0zivl\\nawIDAQAB\\n-----END PUBLIC KEY-----&quot;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;591cda5d6c7adec42a1874bc&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;updated&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2017-05-17T23:18:53.385Z&quot;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The public key is the string <code>-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----</code></p>', 6);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode(
  "div",
  { class: "custom-container danger" },
  [
    /* @__PURE__ */ createBaseVNode("p", { class: "custom-container-title" }, "Expose RSA public key to only trusted party"),
    /* @__PURE__ */ createBaseVNode("p", null, "Despite of the adjective public, NotifyBC's public key should only be distributed to trusted third party. The trusted third party should only use the public key at server backend. Using the public key in client-side JavaScript poses a security loophole.")
  ],
  -1
  /* HOISTED */
);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("When "),
      _hoisted_2,
      createTextVNode(" starts up, it checks if an RSA key pair exists in database as dynamic config. If not it will generate the dynamic config and save it to database. This RSA key pair is used to exchange confidential information with third party server applications through user's browser. For an example of use case, see "),
      createVNode(_component_RouterLink, { to: "/docs/api-subscription/" }, {
        default: withCtx(() => [
          createTextVNode("Subscription API")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(". To make it work, send the public key to the third party and have their server app encrypt the data using the public key. To obtain public key, call the REST "),
      createVNode(_component_RouterLink, { to: "/docs/config/..api-config/#get-configurations" }, {
        default: withCtx(() => [
          createTextVNode("Configuration API")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" from an admin ip, for example, by running "),
      _hoisted_3,
      createTextVNode(" command")
    ]),
    _hoisted_4,
    createBaseVNode("p", null, [
      createTextVNode("In a multi-node deployment, when the cluster is first started up, database is empty and rsa key pair doesn't exist. To prevent multiple rsa keys being generated by different nodes, only the "),
      createVNode(_component_RouterLink, { to: "/docs/config-nodeRoles/" }, {
        default: withCtx(() => [
          createTextVNode("master node")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" can generate the rsa key pair. other nodes will wait for the key pair available in database before proceeding with rest bootstrap.")
    ]),
    _hoisted_10
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-ab100263.js.map
