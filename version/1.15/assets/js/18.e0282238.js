(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{415:function(t,s,e){"use strict";e.r(s);var n=e(42),a=Object(n.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"cron-jobs"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#cron-jobs"}},[t._v("#")]),t._v(" Cron Jobs")]),t._v(" "),e("p",[e("em",[t._v("NotifyBC")]),t._v(" runs several cron jobs described below. These jobs are controlled by sub-properties defined in config object "),e("em",[t._v("cron")]),t._v(". To change config, create the object and properties in file "),e("em",[t._v("/src/config.local.js")]),t._v(".")]),t._v(" "),e("p",[t._v("By default cron jobs are enabled. In a multi-node deployment, cron jobs should only run on the "),e("RouterLink",{attrs:{to:"/docs/config-nodeRoles/"}},[t._v("master node")]),t._v(" to ensure single execution.")],1),t._v(" "),e("h2",{attrs:{id:"purge-data"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#purge-data"}},[t._v("#")]),t._v(" Purge Data")]),t._v(" "),e("p",[t._v("This cron job purges old notifications, subscriptions and notification bounces. The default frequency of cron job and retention policy are defined by "),e("em",[t._v("cron.purgeData")]),t._v(" config object in file "),e("em",[t._v("/src/config.ts")])]),t._v(" "),e("div",{staticClass:"language-ts extra-class"},[e("pre",{pre:!0,attrs:{class:"language-ts"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("module")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  cron"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    purgeData"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      timeSpec"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0 0 1 * * *'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      pushNotificationRetentionDays"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      expiredInAppNotificationRetentionDays"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      nonConfirmedSubscriptionRetentionDays"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      deletedBounceRetentionDays"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      expiredAccessTokenRetentionDays"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      defaultRetentionDays"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("30")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("The config items are")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{name:"timeSpec"}}),e("em",[t._v("timeSpec")]),t._v(": a space separated fields conformed to "),e("a",{attrs:{href:"https://www.freebsd.org/cgi/man.cgi?crontab(5)",target:"_blank",rel:"noopener noreferrer"}},[t._v("unix crontab format"),e("OutboundLink")],1),t._v(" with an optional left-most seconds field. See "),e("a",{attrs:{href:"https://github.com/kelektiv/node-cron#cron-ranges",target:"_blank",rel:"noopener noreferrer"}},[t._v("allowed ranges"),e("OutboundLink")],1),t._v(" of each field.")]),t._v(" "),e("li",[e("em",[t._v("pushNotificationRetentionDays")]),t._v(": the retention days of push notifications")]),t._v(" "),e("li",[e("em",[t._v("expiredInAppNotificationRetentionDays")]),t._v(": the retention days of expired inApp notifications")]),t._v(" "),e("li",[e("em",[t._v("nonConfirmedSubscriptionRetentionDays")]),t._v(": the retention days of non-confirmed subscriptions, i.e. all unconfirmed and deleted subscriptions")]),t._v(" "),e("li",[e("em",[t._v("deletedBounceRetentionDays")]),t._v(": the retention days of deleted notification bounces")]),t._v(" "),e("li",[t._v("expiredAccessTokenRetentionDays: the retention days of expired access tokens")]),t._v(" "),e("li",[e("em",[t._v("defaultRetentionDays")]),t._v(": if any of the above retention day config item is omitted, default retention days is used as fall back.")])]),t._v(" "),e("p",[t._v("To change a config item, set the config item in file "),e("em",[t._v("/src/config.local.js")]),t._v(". For example, to run cron jobs at 2am daily, add following object to "),e("em",[t._v("/src/config.local.js")])]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[t._v("module"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  cron"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    purgeData"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      timeSpec"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0 0 2 * * *'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h2",{attrs:{id:"dispatch-live-notifications"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dispatch-live-notifications"}},[t._v("#")]),t._v(" Dispatch Live Notifications")]),t._v(" "),e("p",[t._v("This cron job sends out future-dated notifications when the notification becomes current. The default config is defined by "),e("em",[t._v("cron.dispatchLiveNotifications")]),t._v(" config object in file "),e("em",[t._v("/src/config.ts")])]),t._v(" "),e("div",{staticClass:"language-ts extra-class"},[e("pre",{pre:!0,attrs:{class:"language-ts"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("module")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  cron"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    dispatchLiveNotifications"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      timeSpec"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0 * * * * *'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[e("em",[t._v("timeSpec")]),t._v(" follows "),e("a",{attrs:{href:"#timeSpec"}},[t._v("same syntax described above")]),t._v(".")]),t._v(" "),e("h2",{attrs:{id:"check-rss-config-updates"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#check-rss-config-updates"}},[t._v("#")]),t._v(" Check Rss Config Updates")]),t._v(" "),e("p",[t._v("This cron job monitors RSS feed notification dynamic config items. If a config item is created, updated or deleted, the cron job starts, restarts, or stops the RSS-specific cron job. The default config is defined by "),e("em",[t._v("cron.checkRssConfigUpdates")]),t._v(" config object in file "),e("em",[t._v("/src/config.ts")])]),t._v(" "),e("div",{staticClass:"language-ts extra-class"},[e("pre",{pre:!0,attrs:{class:"language-ts"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("module")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  cron"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    checkRssConfigUpdates"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      timeSpec"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0 * * * * *'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[e("em",[t._v("timeSpec")]),t._v(" follows "),e("a",{attrs:{href:"#timeSpec"}},[t._v("same syntax described above")]),t._v(". Note this "),e("em",[t._v("timeSpec")]),t._v(" doesn't control the RSS poll frequency (which is defined in dynamic configs and is service specific), instead it only controls the frequency to check for dynamic config changes.")]),t._v(" "),e("h2",{attrs:{id:"delete-notification-bounces"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#delete-notification-bounces"}},[t._v("#")]),t._v(" Delete Notification Bounces")]),t._v(" "),e("p",[t._v("This cron job deletes notification bounces if the latest notification is deemed delivered successfully. The criteria of successful delivery are")]),t._v(" "),e("ol",[e("li",[t._v("No bounce received since the latest notification started dispatching, and")]),t._v(" "),e("li",[t._v("a configured time span has lapsed since the latest notification finished dispatching")])]),t._v(" "),e("p",[t._v("The default config is defined by "),e("em",[t._v("cron.deleteBounces")]),t._v(" config object in file "),e("em",[t._v("/src/config.ts")])]),t._v(" "),e("div",{staticClass:"language-ts extra-class"},[e("pre",{pre:!0,attrs:{class:"language-ts"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("module")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  cron"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    deleteBounces"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      timeSpec"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0 0 * * * *'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      minLapsedHoursSinceLatestNotificationEnded"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("where")]),t._v(" "),e("ul",[e("li",[e("em",[t._v("timeSpec")]),t._v(" is the frequency of cron job, following "),e("a",{attrs:{href:"#timeSpec"}},[t._v("same syntax described above")])]),t._v(" "),e("li",[e("em",[t._v("minLapsedHoursSinceLatestNotificationEnded")]),t._v(" is the time span")])])])}),[],!1,null,null,null);s.default=a.exports}}]);