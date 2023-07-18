import { _ as _export_sfc, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, u as unref, e as createStaticVNode, f as useThemeData } from "./app-fffec9eb.js";
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="welcome" tabindex="-1"><a class="header-anchor" href="#welcome" aria-hidden="true">#</a> Welcome</h1><p>This site aims to be a comprehensive guide to <em>NotifyBC</em>. We’ll cover topics such as getting your instance up and running, interacting with browser or other server components, deployment, and give you some advice on participating in the future development of <em>NotifyBC</em> itself.</p><h2 id="helpful-hints" tabindex="-1"><a class="header-anchor" href="#helpful-hints" aria-hidden="true">#</a> Helpful Hints</h2><p>Throughout this guide there are a number of small-but-handy pieces of information that can make using <em>NotifyBC</em> easier, more interesting, and less hazardous. Here’s what to look out for.</p><div class="custom-container tip"><p class="custom-container-title">General information</p><p>These are tips and tricks that will help you become a NotifyBC wizard!</p></div><div class="custom-container warning"><p class="custom-container-title">Important information</p><p>These are tidbits you might want to keep in mind.</p></div><div class="custom-container danger"><p class="custom-container-title">Warnings</p><p>Be aware of these messages if you wish to avoid disaster.</p></div>', 7);
const _hoisted_8 = ["href"];
const _sfc_main = {
  __name: "index.html",
  setup(__props) {
    const themeData = useThemeData();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        _hoisted_1,
        createBaseVNode("p", null, [
          createTextVNode("If you come across anything along the way that we haven’t covered, or if you know of a tip you think others would find handy, please "),
          createBaseVNode("a", {
            target: "_blank",
            rel: "noopener noreferrer",
            href: unref(themeData).repo + "/issues/new"
          }, "file an issue", 8, _hoisted_8),
          createTextVNode(" and we’ll see about including it in this guide.")
        ])
      ]);
    };
  }
};
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-8b2683d4.js.map
