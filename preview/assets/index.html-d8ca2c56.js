import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, d as createVNode, w as withCtx, b as createTextVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "bounce",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#bounce",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Bounce")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createStaticVNode('<h2 id="model-schema" tabindex="-1"><a class="header-anchor" href="#model-schema" aria-hidden="true">#</a> Model Schema</h2><p>The API operates on following data model fields:</p><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">channel</p><p class="description">name of the delivery channel. Valid values: email, sms.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">userChannelId</p><div class="description">user&#39;s delivery channel id, for example, email address. </div></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">hardBounceCount</p><p class="description">number of hard bounces recorded so far</p></td><td><table><tr><td>type</td><td>integer</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">state</p><p class="description">bounce record state. Valid values: <i>active, deleted</i>.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">bounceMessages</p><p class="description">array of recorded bounce messages. Each element is an object containing the date bounce message was received and the message itself.</p></td><td><table><tr><td>type</td><td>array</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">latestNotificationStarted</p><p class="description">latest notification started date.</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">latestNotificationEnded</p><p class="description">latest notification ended date.</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">created</p><p class="description">date and time bounce record was created</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">updated</p><p class="description">date and time of bounce record was last updated</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">id</p><p class="description">config id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr></table>', 3);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createVNode(_component_RouterLink, { to: "/docs/config/email.html#bounce" }, {
        default: withCtx(() => [
          createTextVNode("Bounce")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" handling involves recording bounce messages into bounce records, which are implemented using this bounce API and model. Administrator can view bounce records in web console or through API explorer. Bounce record is for internal use and should be read-only under normal circumstances.")
    ]),
    _hoisted_2
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-d8ca2c56.js.map
