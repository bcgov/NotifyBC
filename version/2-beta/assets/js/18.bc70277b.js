(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{414:function(t,e,s){"use strict";s.r(e);var n=s(42),a=Object(n.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"cron-jobs"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#cron-jobs"}},[t._v("#")]),t._v(" Cron Jobs")]),t._v(" "),s("p",[s("em",[t._v("NotifyBC")]),t._v(" runs several cron jobs described below. These jobs are controlled by sub-properties defined in config object "),s("em",[t._v("cron")]),t._v(". To change config, create the object and properties in file "),s("em",[t._v("/src/config.local.js")]),t._v(".")]),t._v(" "),s("p",[t._v("By default cron jobs are enabled. In a multi-node deployment, cron jobs should only run on the "),s("RouterLink",{attrs:{to:"/docs/config-nodeRoles/"}},[t._v("master node")]),t._v(" to ensure single execution.")],1),t._v(" "),s("h2",{attrs:{id:"purge-data"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#purge-data"}},[t._v("#")]),t._v(" Purge Data")]),t._v(" "),s("p",[t._v("This cron job purges old notifications, subscriptions and notification bounces. The default frequency of cron job and retention policy are defined by "),s("em",[t._v("cron.purgeData")]),t._v(" config object in file "),s("em",[t._v("/src/config.json")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"cron"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"purgeData"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"timeSpec"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"0 0 1 * * *"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"pushNotificationRetentionDays"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"expiredInAppNotificationRetentionDays"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"nonConfirmedSubscriptionRetentionDays"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"deletedBounceRetentionDays"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"defaultRetentionDays"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("The config items are")]),t._v(" "),s("ul",[s("li",[s("a",{attrs:{name:"timeSpec"}}),s("em",[t._v("timeSpec")]),t._v(": a space separated fields conformed to "),s("a",{attrs:{href:"https://www.freebsd.org/cgi/man.cgi?crontab(5)",target:"_blank",rel:"noopener noreferrer"}},[t._v("unix crontab format"),s("OutboundLink")],1),t._v(" with an optional left-most seconds field. See "),s("a",{attrs:{href:"https://github.com/kelektiv/node-cron#cron-ranges",target:"_blank",rel:"noopener noreferrer"}},[t._v("allowed ranges"),s("OutboundLink")],1),t._v(" of each field.")]),t._v(" "),s("li",[s("em",[t._v("pushNotificationRetentionDays")]),t._v(": the retention days of push notifications")]),t._v(" "),s("li",[s("em",[t._v("expiredInAppNotificationRetentionDays")]),t._v(": the retention days of expired inApp notifications")]),t._v(" "),s("li",[s("em",[t._v("nonConfirmedSubscriptionRetentionDays")]),t._v(": the retention days of non-confirmed subscriptions, i.e. all unconfirmed and deleted subscriptions")]),t._v(" "),s("li",[s("em",[t._v("deletedBounceRetentionDays")]),t._v(": the retention days of deleted notification bounces")]),t._v(" "),s("li",[s("em",[t._v("defaultRetentionDays")]),t._v(": if any of the above retention day config item is omitted, default retention days is used as fall back.")])]),t._v(" "),s("p",[t._v("To change a config item, set the config item in file "),s("em",[t._v("/src/config.local.js")]),t._v(". For example, to run cron jobs at 2am daily, add following object to "),s("em",[t._v("/src/config.local.js")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  cron"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    purgeData"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      timeSpec"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0 0 2 * * *'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h2",{attrs:{id:"dispatch-live-notifications"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#dispatch-live-notifications"}},[t._v("#")]),t._v(" Dispatch Live Notifications")]),t._v(" "),s("p",[t._v("This cron job sends out future-dated notifications when the notification becomes current. The default config is defined by "),s("em",[t._v("cron.dispatchLiveNotifications")]),t._v(" config object in file "),s("em",[t._v("/src/config.json")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"cron"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"dispatchLiveNotifications"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"timeSpec"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"0 * * * * *"')]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[s("em",[t._v("timeSpec")]),t._v(" follows "),s("a",{attrs:{href:"#timeSpec"}},[t._v("same syntax described above")]),t._v(".")]),t._v(" "),s("h2",{attrs:{id:"check-rss-config-updates"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#check-rss-config-updates"}},[t._v("#")]),t._v(" Check Rss Config Updates")]),t._v(" "),s("p",[t._v("This cron job monitors RSS feed notification dynamic config items. If a config item is created, updated or deleted, the cron job starts, restarts, or stops the RSS-specific cron job. The default config is defined by "),s("em",[t._v("cron.checkRssConfigUpdates")]),t._v(" config object in file "),s("em",[t._v("/src/config.json")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"cron"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"checkRssConfigUpdates"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"timeSpec"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"0 * * * * *"')]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[s("em",[t._v("timeSpec")]),t._v(" follows "),s("a",{attrs:{href:"#timeSpec"}},[t._v("same syntax described above")]),t._v(". Note this "),s("em",[t._v("timeSpec")]),t._v(" doesn't control the RSS poll frequency (which is defined in dynamic configs and is service specific), instead it only controls the frequency to check for dynamic config changes.")]),t._v(" "),s("h2",{attrs:{id:"delete-notification-bounces"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#delete-notification-bounces"}},[t._v("#")]),t._v(" Delete Notification Bounces")]),t._v(" "),s("p",[t._v("This cron job deletes notification bounces if the latest notification is deemed delivered successfully. The criteria of successful delivery are")]),t._v(" "),s("ol",[s("li",[t._v("No bounce received since the latest notification started dispatching, and")]),t._v(" "),s("li",[t._v("a configured time span has lapsed since the latest notification finished dispatching")])]),t._v(" "),s("p",[t._v("The default config is defined by "),s("em",[t._v("cron.deleteBounces")]),t._v(" config object in file "),s("em",[t._v("/src/config.json")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"cron"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"deleteBounces"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"timeSpec"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"0 0 * * * *"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"minLapsedHoursSinceLatestNotificationEnded"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("where")]),t._v(" "),s("ul",[s("li",[s("em",[t._v("timeSpec")]),t._v(" is the frequency of cron job, following "),s("a",{attrs:{href:"#timeSpec"}},[t._v("same syntax described above")])]),t._v(" "),s("li",[s("em",[t._v("minLapsedHoursSinceLatestNotificationEnded")]),t._v(" is the time span")])])])}),[],!1,null,null,null);e.default=a.exports}}]);