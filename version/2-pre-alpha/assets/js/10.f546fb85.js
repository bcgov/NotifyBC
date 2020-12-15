(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{396:function(e,t,a){"use strict";a.r(t);var s=a(42),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"administrator"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#administrator"}},[e._v("#")]),e._v(" Administrator")]),e._v(" "),a("p",[e._v("The administrator API provides knowledge factor based authentication mechanism to identify admin request, as opposed to possession factor based admin ip list. Because knowledge factor based authentication is vulnerable to brute-force attack, administrator API is less favorable than admin ip list. Administrator API should only be used in exceptional circumstances such as when obtaining the client's ip or ip range is infeasible.")]),e._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[e._v("Example Use Case")]),e._v(" "),a("p",[e._v("Administrator API was created to circumvent an OpenShift limitation - the source ip of a request initiated from an OpenShift pod cannot be exclusively allocated to the pod's project, rather it has to be shared by all OpenShift projects. Therefore it's difficult to impose granular access control based on source ip.")])]),e._v(" "),a("p",[e._v("To enable knowledge factor based authentication, a super-admin manually calls "),a("em",[e._v("POST /administrators")]),e._v(" API to create an admin user. Next, the super-admin calls "),a("em",[e._v("POST /administrators/login")]),e._v(" API to login the admin user. If both calls are successful, the "),a("em",[e._v("POST /administrators/login")]),e._v(" API returns an access token. The super-admin gives the access token to the client, who can make authenticated requests by supplying the access token in either "),a("em",[e._v("Authorization")]),e._v(" HTTP header or "),a("em",[e._v("access_token")]),e._v(" query parameter.")]),e._v(" "),a("p",[e._v("More details on creating access token can be found "),a("a",{attrs:{href:"http://loopback.io/doc/en/lb3/Introduction-to-User-model-authentication.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),a("OutboundLink")],1),e._v(". All occurrences of "),a("em",[e._v("/Users")]),e._v(" in the referenced doc should be interpreted as "),a("em",[e._v("/administrators")]),e._v(", which is "),a("em",[e._v("NotifyBC")]),e._v("'s user model name.")]),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("ProTips™ Increase TTL")]),e._v(" "),a("p",[e._v("By default TTL of an access token is set to 14 days by LoopBack. The default time makes sense if users can login themselves. However "),a("i",[e._v("NotifyBC")]),e._v(" only allows super-admin to access Administrator API in order to reduce attack window, thus super-admin has to login on behalf of the user to obtain the access token. As a super-admin, you may want to bump up TTL significantly to reduce administrative overhead.")])]),e._v(" "),a("p",[e._v("For details and examples on making authenticated requests, see "),a("a",{attrs:{href:"http://loopback.io/doc/en/lb3/Making-authenticated-requests.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),a("OutboundLink")],1),e._v(".")])])}),[],!1,null,null,null);t.default=o.exports}}]);