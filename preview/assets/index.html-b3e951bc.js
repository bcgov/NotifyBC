import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="developer-notes" tabindex="-1"><a class="header-anchor" href="#developer-notes" aria-hidden="true">#</a> Developer Notes</h1><h2 id="setup-development-environment" tabindex="-1"><a class="header-anchor" href="#setup-development-environment" aria-hidden="true">#</a> Setup development environment</h2><p>Install Visual Studio Code and following extensions:</p><ul><li>Prettier</li><li>ESLint</li><li>Vetur</li><li>Code Spell Checker</li><li>Debugger for Chrome</li></ul><p>Multiple run configs have been created to facilitate debugging server, client, test and docs.</p><div class="custom-container warning"><p class="custom-container-title">Client certificate authentication doesn&#39;t work in client debugger</p><p>Because Vue cli webpack dev server cannot proxy passthrough HTTPS connections, client certificate authentication doesn&#39;t work in client debugger. If testing client certificate authentication in web console is needed, run <code>yarn build</code> to generate prod client distribution and launch server debugger on https://localhost:3000</p></div><h2 id="automated-testing" tabindex="-1"><a class="header-anchor" href="#automated-testing" aria-hidden="true">#</a> Automated Testing</h2>', 7);
const _hoisted_8 = {
  href: "https://loopback.io/doc/en/lb4/Testing-your-application.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_9 = /* @__PURE__ */ createBaseVNode(
  "code",
  null,
  "yarn test",
  -1
  /* HOISTED */
);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "Test",
  -1
  /* HOISTED */
);
const _hoisted_11 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "Github Actions runs tests as part of the build. All test scripts should be able to run unattended, headless, quickly and depend only on local resources.",
  -1
  /* HOISTED */
);
const _hoisted_12 = /* @__PURE__ */ createBaseVNode(
  "h3",
  {
    id: "writing-test-specs",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#writing-test-specs",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Writing Test Specs")
  ],
  -1
  /* HOISTED */
);
const _hoisted_13 = {
  href: "https://github.com/visionmedia/supertest",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_14 = {
  href: "https://loopback.io/doc/en/lb4/Memory-connector.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_15 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "sendMail",
  -1
  /* HOISTED */
);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "sendSMS",
  -1
  /* HOISTED */
);
const _hoisted_17 = /* @__PURE__ */ createStaticVNode('<ul><li>start at a processing phase as early as possible. For example, to test a REST end point, start with the HTTP user request.</li><li>assert outcome of a processing phase as late and down below as possible - the HTTP response body/code, the database record created, for example.</li><li>avoid asserting middleware function input/output to facilitate code refactoring.</li><li>mock email/sms sending function (implemented by default). Inspect the input of the function, or at least assert the function has been called.</li></ul><h2 id="code-coverage" tabindex="-1"><a class="header-anchor" href="#code-coverage" aria-hidden="true">#</a> Code Coverage</h2><p>After running <code>yarn test</code>, nyc code coverage report is generated in git ignored folder <em>/coverage</em>.</p><h2 id="install-docs-website" tabindex="-1"><a class="header-anchor" href="#install-docs-website" aria-hidden="true">#</a> Install Docs Website</h2><p>If you want to contribute to <em>NotifyBC</em> docs beyond simple fix ups, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">yarn</span> <span class="token parameter variable">--cwd</span> docs <span class="token function">install</span>\n<span class="token function">yarn</span> <span class="token parameter variable">--cwd</span> docs dev\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>If everything goes well, the last line of the output will be</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&gt; VuePress dev server listening at http://localhost:8080/NotifyBC/\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 8);
const _hoisted_25 = {
  href: "http://localhost:8080/NotifyBC/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_26 = /* @__PURE__ */ createBaseVNode(
  "h2",
  {
    id: "publish-version-checklist",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#publish-version-checklist",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Publish Version Checklist")
  ],
  -1
  /* HOISTED */
);
const _hoisted_27 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "Before adding a release,",
  -1
  /* HOISTED */
);
const _hoisted_28 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("update "),
    /* @__PURE__ */ createBaseVNode("em", null, "version"),
    /* @__PURE__ */ createTextVNode(" in "),
    /* @__PURE__ */ createBaseVNode("em", null, "package.json")
  ],
  -1
  /* HOISTED */
);
const _hoisted_29 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("update "),
    /* @__PURE__ */ createBaseVNode("em", null, "version"),
    /* @__PURE__ */ createTextVNode(),
    /* @__PURE__ */ createBaseVNode("em", null, "appVersion"),
    /* @__PURE__ */ createTextVNode(" in "),
    /* @__PURE__ */ createBaseVNode("em", null, "helm/Chart.yaml"),
    /* @__PURE__ */ createTextVNode(" (major/minor only)")
  ],
  -1
  /* HOISTED */
);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("Test framework is created by LoopBack lb4 CLI, using LoopBack provided tool set and following LoopBack "),
      createBaseVNode("a", _hoisted_8, [
        createTextVNode("best practices"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". To launch test, run "),
      _hoisted_9,
      createTextVNode(". A "),
      _hoisted_10,
      createTextVNode(" launch config is provided to debug in VS Code.")
    ]),
    _hoisted_11,
    _hoisted_12,
    createBaseVNode("p", null, [
      createTextVNode("Thanks to "),
      createBaseVNode("a", _hoisted_13, [
        createTextVNode("supertest"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" and LoopBack's "),
      createBaseVNode("a", _hoisted_14, [
        createTextVNode("memory database connector"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(", test specs can be written to cover nearly end-to-end request processing workflow (only "),
      _hoisted_15,
      createTextVNode(" and "),
      _hoisted_16,
      createTextVNode(" need to be mocked). This allows test specs to anchor onto business requirements rather than program units such as functions or files, resulting in regression tests that are more resilient to code refactoring. Whenever possible, a test spec should be written to")
    ]),
    _hoisted_17,
    createBaseVNode("p", null, [
      createTextVNode("You can now browse to the local docs site "),
      createBaseVNode("a", _hoisted_25, [
        createTextVNode("http://localhost:8080/NotifyBC"),
        createVNode(_component_ExternalLinkIcon)
      ])
    ]),
    _hoisted_26,
    _hoisted_27,
    createBaseVNode("ol", null, [
      _hoisted_28,
      _hoisted_29,
      createBaseVNode("li", null, [
        createTextVNode("update "),
        createVNode(_component_RouterLink, { to: "/docs/getting-started/what's-new.html" }, {
          default: withCtx(() => [
            createTextVNode("What's new")
          ]),
          _: 1
          /* STABLE */
        }),
        createTextVNode(" (major/minor only)")
      ])
    ])
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-b3e951bc.js.map
