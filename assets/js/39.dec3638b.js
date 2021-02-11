(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{434:function(e,t,a){"use strict";a.r(t);var s=a(42),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"basic-usage"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#basic-usage"}},[e._v("#")]),e._v(" Basic Usage")]),e._v(" "),a("p",[e._v("After "),a("a",{attrs:{href:"../installation"}},[e._v("installing")]),e._v(" "),a("em",[e._v("NotifyBC")]),e._v(", you can start exploring "),a("em",[e._v("NotifyBC")]),e._v(" resources by opening web console at "),a("a",{attrs:{href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer"}},[e._v("http://localhost:3000"),a("OutboundLink")],1),e._v(". You can further explore APIs by clicking the API explorer in web console and expand the data models.")]),e._v(" "),a("p",[e._v("Consult the "),a("RouterLink",{attrs:{to:"/docs/api-overview/"}},[e._v("API docs")]),e._v(" for valid inputs and expected outcome while you are exploring the APIs. Once you are familiar with the APIs, you can start writing code to call the APIs from either user browser or from a server application.")],1),e._v(" "),a("p",[e._v("What you see and what you get depend on which of the following four types the request is authenticated to.")]),e._v(" "),a("h2",{attrs:{id:"super-admin"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#super-admin"}},[e._v("#")]),e._v(" Super-admin")]),e._v(" "),a("p",[e._v("The API calls you made with API explorer as well as API calls made by web console from localhost are by default authenticated as "),a("RouterLink",{attrs:{to:"/docs/overview/#architecture"}},[e._v("super-admin requests")]),e._v(". Super-admin authentication status is indicated by the "),a("span",{staticClass:"material-icons"},[e._v("verified_user")]),e._v("\nicon on top right corner of web console.")],1),e._v(" "),a("p",[e._v("To see the result of non super-admin requests, you can choose one of the following methods")]),e._v(" "),a("ul",[a("li",[e._v("customize "),a("RouterLink",{attrs:{to:"/docs/config-adminIpList/"}},[e._v("admin ip list")]),e._v(" to omit localhost (127.0.0.1)")],1),e._v(" "),a("li",[e._v("access web console from another ip not in the admin ip list")])]),e._v(" "),a("h2",{attrs:{id:"anonymous-user"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#anonymous-user"}},[e._v("#")]),e._v(" Anonymous user")]),e._v(" "),a("p",[e._v("If you access web console from a client that is not in the admin ip list, you are by default anonymous user.\nAnonymous authentication status is indicated by the LOGIN"),a("span",{staticClass:"material-icons"},[e._v("login")]),e._v(" button on top right corner of web console. If you click the button and login successfully, you become an admin user.")]),e._v(" "),a("h2",{attrs:{id:"admin-user"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#admin-user"}},[e._v("#")]),e._v(" Admin user")]),e._v(" "),a("p",[e._v("If you are an authorized "),a("em",[e._v("NotifyBC")]),e._v(" administrator and it's not always feasible to access "),a("em",[e._v("NotifyBC")]),e._v(" from a client in admin ip list, you can authenticate using an access token. The procedure to obtain and apply access token is documented in "),a("RouterLink",{attrs:{to:"/docs/api/administrator.html"}},[e._v("Administrator API")]),e._v(". Access token authentication status is indicated by the "),a("em",[e._v("Access Token")]),e._v(" text field on top right corner of web console. You can edit the text field. If the new access token you entered is invalid, you are essentially logging yourself out. In such case "),a("em",[e._v("Access Token")]),e._v(" text field is replaced by the LOGIN"),a("span",{staticClass:"material-icons"},[e._v("login")]),e._v(" button.")],1),e._v(" "),a("p",[e._v("The access token in API Explorer is integrated with web console. Therefore if you change access token in API Explorer GUI, it will be reflected in web console upon page refresh, and vice versa.")]),e._v(" "),a("h2",{attrs:{id:"siteminder-authenticated-user"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#siteminder-authenticated-user"}},[e._v("#")]),e._v(" SiteMinder authenticated user")]),e._v(" "),a("p",[e._v("To get results of a SiteMinder authenticated user, do one of the following")]),e._v(" "),a("ul",[a("li",[e._v("access the API via a SiteMinder proxy if you have configured SiteMinder properly")]),e._v(" "),a("li",[e._v("use a tool such as "),a("em",[e._v("curl")]),e._v(" that allows to specify custom headers, and supply SiteMinder header "),a("em",[e._v("SM_USER")]),e._v(":")])]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[e._v("curl")]),e._v(" -X GET --header "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v('"Accept: application/json"')]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n    --header "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v('"SM_USER: foo"')]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("\\")]),e._v("\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v('"http://localhost:3000/api/notifications"')]),e._v("\n")])])])])}),[],!1,null,null,null);t.default=o.exports}}]);