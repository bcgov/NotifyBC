(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{423:function(e,n,i){"use strict";i.r(n);var t=i(42),o=Object(t.a)({},(function(){var e=this,n=e.$createElement,i=e._self._c||n;return i("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[i("h1",{attrs:{id:"configuration-overview"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#configuration-overview"}},[e._v("#")]),e._v(" Configuration Overview")]),e._v(" "),i("p",[e._v("There are two types of configurations - static and dynamic. Static configurations are defined in files or environment variables, requiring restarting app server to take effect, whereas dynamic configurations are defined in databases and updates take effect immediately.")]),e._v(" "),i("p",[e._v("Most static configurations are specified in file "),i("em",[e._v("/src/config.ts")]),e._v(" conforming to Loopback "),i("a",{attrs:{href:"http://loopback.io/doc/en/lb3/config.json.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("config.json"),i("OutboundLink")],1),e._v(". "),i("em",[e._v("NotifyBC")]),e._v(" added some additional configurations. If you need to change, instead of updating "),i("em",[e._v("/src/config.ts")]),e._v(" file, create "),i("a",{attrs:{href:"http://loopback.io/doc/en/lb2/config.json.html#environment-specific-settings",target:"_blank",rel:"noopener noreferrer"}},[e._v("environment-specific file"),i("OutboundLink")],1),e._v(" such as "),i("em",[e._v("/src/config.local.js")]),e._v(". "),i("em",[e._v("Js")]),e._v(" file is preferred over "),i("em",[e._v("json")]),e._v(" because only "),i("em",[e._v("js")]),e._v(" file supports custom functions, which are needed by some advanced configs below. Code snippets hereafter assumes custom config file is "),i("em",[e._v("js")]),e._v(".")]),e._v(" "),i("p",[e._v("Dynamic configs are managed using REST "),i("RouterLink",{attrs:{to:"/docs/api-config/"}},[e._v("configuration api")]),e._v(".")],1),e._v(" "),i("div",{staticClass:"custom-block warning"},[i("p",{staticClass:"custom-block-title"},[e._v("Why Dynamic Configs?")]),e._v(" "),i("p",[e._v("Dynamic configs are needed in cases such as")]),e._v(" "),i("ul",[i("li",[e._v("to allow define service-specific configs such as message templates")]),e._v(" "),i("li",[e._v("in a multi-node deployment, configs can be generated by one node (typically master) and shared with other nodes")])])])])}),[],!1,null,null,null);n.default=o.exports}}]);