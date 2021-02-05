(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{440:function(t,a,s){"use strict";s.r(a);var e=s(42),n=Object(e.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"migration-guide"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#migration-guide"}},[t._v("#")]),t._v(" Migration Guide")]),t._v(" "),s("p",[t._v("Migrating "),s("em",[t._v("NotifyBC")]),t._v(" from v1 to v2 involves two steps")]),t._v(" "),s("ol",[s("li",[t._v("Update your client code if needed")]),t._v(" "),s("li",[t._v("Migrate "),s("em",[t._v("NotifyBC")]),t._v(" server")])]),t._v(" "),s("h2",{attrs:{id:"update-client-code"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#update-client-code"}},[t._v("#")]),t._v(" Update client code")]),t._v(" "),s("p",[s("em",[t._v("NotifyBC")]),t._v(" v2 introduced backward incompatible API changes documented in the rest of this section. If your client code will be impacted by the changes, update your code to address the incompatibility first.")]),t._v(" "),s("h3",{attrs:{id:"query-parameter-array-syntax"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#query-parameter-array-syntax"}},[t._v("#")]),t._v(" Query parameter array syntax")]),t._v(" "),s("p",[t._v("In v1 array can be specified in query parameter using two formats")]),t._v(" "),s("ol",[s("li",[t._v("by enclosing array elements in square brackets such as "),s("code",[t._v('&additionalServices=["s1","s2]')]),t._v(" in one query parameter")]),t._v(" "),s("li",[t._v("by repeating the query parameters, for example "),s("code",[t._v("&additionalServices=s1&additionalServices=s2")])])]),t._v(" "),s("p",[t._v("In v2 only the latter format is supported.")]),t._v(" "),s("h3",{attrs:{id:"date-time-fields"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#date-time-fields"}},[t._v("#")]),t._v(" Date-Time fields")]),t._v(" "),s("p",[t._v("In v1 date-time fields can be specified in date-only string such as 2020-01-01. In v2 the field must be specified in ISO 8601 extended format such as 2020-01-01T00:00:00Z.")]),t._v(" "),s("h3",{attrs:{id:"return-status-codes"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#return-status-codes"}},[t._v("#")]),t._v(" Return status codes")]),t._v(" "),s("p",[t._v("HTTP response code of success calls to following APIs are changed from 200 to 204")]),t._v(" "),s("ul",[s("li",[t._v("most PATCH by id requests except for "),s("RouterLink",{attrs:{to:"/docs/api-subscription/#update-a-subscription"}},[t._v("Update a Subscription\n")])],1),t._v(" "),s("li",[t._v("most PUT by id requests except for "),s("RouterLink",{attrs:{to:"/docs/api-subscription/#replace-a-subscription"}},[t._v("Replace a Subscription")])],1),t._v(" "),s("li",[t._v("most DELETE by id requests except for "),s("RouterLink",{attrs:{to:"/docs/api-subscription/#delete-a-subscription-unsubscribing"}},[t._v("Delete a Subscription (unsubscribing)")])],1)]),t._v(" "),s("h3",{attrs:{id:"administrator-api"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#administrator-api"}},[t._v("#")]),t._v(" Administrator API")]),t._v(" "),s("ul",[s("li",[t._v("Password is saved to "),s("em",[t._v("Administrator")]),t._v(" in v1 and "),s("em",[t._v("UserCredential")]),t._v(" in v2. Password is not migrated. New password has to be created by following "),s("RouterLink",{attrs:{to:"/docs/api-administrator/#create-update-an-administrator-s-usercredential"}},[t._v("Create/Update an Administrator's UserCredential\n")]),t._v(".")],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/docs/api-administrator.html#sign-up"}},[t._v("Complexity rules")]),t._v(" have been applied to passwords.")],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/docs/api-administrator/#login"}},[t._v("login")]),t._v(" API is open to non-admin")],1)]),t._v(" "),s("h2",{attrs:{id:"migrate-notifybc-server"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#migrate-notifybc-server"}},[t._v("#")]),t._v(" Migrate "),s("em",[t._v("NotifyBC")]),t._v(" server")]),t._v(" "),s("p",[t._v("The procedure to migrate from v1 to v2 depends on how v1 was installed.")]),t._v(" "),s("h3",{attrs:{id:"source-code-installation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#source-code-installation"}},[t._v("#")]),t._v(" Source-code Installation")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("Stop "),s("em",[t._v("NotifyBC")])])]),t._v(" "),s("li",[s("p",[t._v("Backup app root and database!")])]),t._v(" "),s("li",[s("p",[t._v("Make sure current branch is tracking correct remote branch")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("$ git remote set-url origin https://github.com/bcgov/NotifyBC.git\n$ git branch -u origin/main\n")])])])]),t._v(" "),s("li",[s("p",[t._v("Run "),s("code",[t._v("git pull")]),t._v(" from app root")])]),t._v(" "),s("li",[s("p",[t._v("Make sure "),s("em",[t._v("version")]),t._v(" property in "),s("em",[t._v("package.json")]),t._v(" is "),s("em",[t._v("2.x.x")])])]),t._v(" "),s("li",[s("p",[t._v("Move "),s("em",[t._v("server/config.(local|dev|production).(js|json)")]),t._v(" to "),s("em",[t._v("src/")]),t._v(" if exists")])]),t._v(" "),s("li",[s("p",[t._v("Move "),s("em",[t._v("server/datasources.(local|dev|production).(js|json)")]),t._v(" to "),s("em",[t._v("src/datasources/db.datasource.(local|dev|production).(js|json)")]),t._v(" if exists. Notice the file name has changed.")])]),t._v(" "),s("li",[s("p",[t._v("Move "),s("em",[t._v("server/middleware.*.(js|json)")]),t._v(" to "),s("em",[t._v("src/")]),t._v(" if exists. Reorganize top level properties to "),s("em",[t._v("all")]),t._v(" or "),s("em",[t._v("apiOnly")]),t._v(", where "),s("em",[t._v("all")]),t._v(" applies to all requests including web admin console and "),s("em",[t._v("apiOnly")]),t._v(" applies to API requests only. For example, given")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  initial"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    compression"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'routes:before'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    morgan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      enabled"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("if "),s("em",[t._v("compression")]),t._v(" middleware will be applied to all requests and "),s("em",[t._v("morgan")]),t._v(" will be applied to API requests only, then change the file to")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  all"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    compression"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  apiOnly"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    morgan"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      enabled"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])]),t._v(" "),s("li",[s("p",[t._v("Run")]),t._v(" "),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" build\n")])])])]),t._v(" "),s("li",[s("p",[t._v("Start server by running "),s("code",[t._v("yarn start")]),t._v(" or Windows Service")])])]),t._v(" "),s("h3",{attrs:{id:"openshift-installation"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#openshift-installation"}},[t._v("#")]),t._v(" OpenShift Installation")]),t._v(" "),s("ol",[s("li",[t._v("Run"),s("div",{staticClass:"language-sh extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sh"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/bcgov/NotifyBC.git\n"),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" NotifyBC\n")])])])]),t._v(" "),s("li",[t._v("Follow OpenShift "),s("RouterLink",{attrs:{to:"/docs/installation/#build"}},[t._v("Build")])],1),t._v(" "),s("li",[t._v("Follow OpenShift "),s("RouterLink",{attrs:{to:"/docs/installation/#deploy"}},[t._v("Deploy")])],1),t._v(" "),s("li",[t._v("Follow OpenShift "),s("RouterLink",{attrs:{to:"/docs/installation/#change-propagation"}},[t._v("Change Propagation")])],1)])])}),[],!1,null,null,null);a.default=n.exports}}]);