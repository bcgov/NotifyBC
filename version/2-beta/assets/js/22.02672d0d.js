(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{418:function(t,e,s){"use strict";s.r(e);var n=s(42),a=Object(n.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"internal-http-host"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#internal-http-host"}},[t._v("#")]),t._v(" Internal HTTP Host")]),t._v(" "),s("p",[t._v("By default, HTTP requests submitted by "),s("em",[t._v("NotifyBC")]),t._v(" back to itself will be sent to "),s("em",[t._v("httpHost")]),t._v(" if defined or the host of the incoming HTTP request that spawns such internal requests. But if config "),s("em",[t._v("internalHttpHost")]),t._v(", which has no default value, is defined, for example in file "),s("em",[t._v("/server/config.local.js")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  internalHttpHost"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'http://notifybc:3000'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("then the HTTP request will be sent to the configured host. An internal request can be generated, for example, as a "),s("RouterLink",{attrs:{to:"/docs/config-notification/#broadcast-push-notification-task-concurrency"}},[t._v("sub-request of broadcast push notification")]),t._v(". "),s("em",[t._v("internalHttpHost")]),t._v(" shouldn't be accessible from internet.")],1),t._v(" "),s("p",[t._v("All internal requests are supposed to be admin requests. The purpose of "),s("em",[t._v("internalHttpHost")]),t._v(" is to facilitate identifying the internal server ip as admin ip.")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("ProTips™ OpenShift Use Case")]),t._v(" "),s("p",[t._v("The OpenShift deployment script has set "),s("i",[t._v("internalHttpHost")]),t._v(" to service url "),s("i",[t._v("http://notify-bc:3000")]),t._v(" in file "),s("a",{attrs:{href:"https://github.com/bcgov/NotifyBC/blob/main/.s2i/configs/config.production.json"}},[t._v("config.production.json")]),t._v(" so you shouldn't re-define it in "),s("i",[t._v("/server/config.local.js")]),t._v(". The source ip in such case would be in a private OpenShift ip range. You should add this private ip range to "),s("a",{attrs:{href:"#admin-ip-list"}},[t._v("admin ip list")]),t._v(". The private ip range varies from OpenShift installation. In BCGov's cluster, it starts with octet 172.")])])])}),[],!1,null,null,null);e.default=a.exports}}]);