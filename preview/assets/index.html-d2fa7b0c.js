import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createBaseVNode(
  "h1",
  {
    id: "cron-jobs",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#cron-jobs",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Cron Jobs")
  ],
  -1
  /* HOISTED */
);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "NotifyBC"),
    /* @__PURE__ */ createTextVNode(" runs several cron jobs described below. These jobs are controlled by sub-properties defined in config object "),
    /* @__PURE__ */ createBaseVNode("em", null, "cron"),
    /* @__PURE__ */ createTextVNode(". To change config, create the object and properties in file "),
    /* @__PURE__ */ createBaseVNode("em", null, "/src/config.local.js"),
    /* @__PURE__ */ createTextVNode(".")
  ],
  -1
  /* HOISTED */
);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode(
  "a",
  { name: "timeSpec" },
  null,
  -1
  /* HOISTED */
);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "timeSpec",
  -1
  /* HOISTED */
);
const _hoisted_5 = {
  href: "https://www.freebsd.org/cgi/man.cgi?crontab(5)",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = {
  href: "https://github.com/kelektiv/node-cron#cron-ranges",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_7 = /* @__PURE__ */ createStaticVNode('<h2 id="purge-data" tabindex="-1"><a class="header-anchor" href="#purge-data" aria-hidden="true">#</a> Purge Data</h2><p>This cron job purges old notifications, subscriptions and notification bounces. The default frequency of cron job and retention policy are defined by <em>cron.purgeData</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cron<span class="token operator">:</span> <span class="token punctuation">{</span>\n    purgeData<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// daily at 1am</span>\n      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 0 1 * * *&#39;</span><span class="token punctuation">,</span>\n      pushNotificationRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n      expiredInAppNotificationRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n      nonConfirmedSubscriptionRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n      deletedBounceRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n      expiredAccessTokenRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n      defaultRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>pushNotificationRetentionDays</em>: the retention days of push notifications</li><li><em>expiredInAppNotificationRetentionDays</em>: the retention days of expired inApp notifications</li><li><em>nonConfirmedSubscriptionRetentionDays</em>: the retention days of non-confirmed subscriptions, i.e. all unconfirmed and deleted subscriptions</li><li><em>deletedBounceRetentionDays</em>: the retention days of deleted notification bounces</li><li>expiredAccessTokenRetentionDays: the retention days of expired access tokens</li><li><em>defaultRetentionDays</em>: if any of the above retention day config item is omitted, default retention days is used as fall back.</li></ul><p>To change a config item, set the config item in file <em>/src/config.local.js</em>. For example, to run cron jobs at 2am daily, add following object to <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">cron</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">purgeData</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">timeSpec</span><span class="token operator">:</span> <span class="token string">&#39;0 0 2 * * *&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dispatch-live-notifications" tabindex="-1"><a class="header-anchor" href="#dispatch-live-notifications" aria-hidden="true">#</a> Dispatch Live Notifications</h2><p>This cron job sends out future-dated notifications when the notification becomes current. The default config is defined by <em>cron.dispatchLiveNotifications</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cron<span class="token operator">:</span> <span class="token punctuation">{</span>\n    dispatchLiveNotifications<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// minutely</span>\n      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 * * * * *&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="check-rss-config-updates" tabindex="-1"><a class="header-anchor" href="#check-rss-config-updates" aria-hidden="true">#</a> Check Rss Config Updates</h2><p>This cron job monitors RSS feed notification dynamic config items. If a config item is created, updated or deleted, the cron job starts, restarts, or stops the RSS-specific cron job. The default config is defined by <em>cron.checkRssConfigUpdates</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cron<span class="token operator">:</span> <span class="token punctuation">{</span>\n    checkRssConfigUpdates<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// minutely</span>\n      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 * * * * *&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Note <em>timeSpec</em> doesn&#39;t control the RSS poll frequency (which is defined in dynamic configs and is service specific), instead it only controls the frequency to check for dynamic config changes.</p><h2 id="delete-notification-bounces" tabindex="-1"><a class="header-anchor" href="#delete-notification-bounces" aria-hidden="true">#</a> Delete Notification Bounces</h2><p>This cron job deletes notification bounces if the latest notification is deemed delivered successfully. The criteria of successful delivery are</p><ol><li>No bounce received since the latest notification started dispatching, and</li><li>a configured time span has lapsed since the latest notification finished dispatching</li></ol><p>The default config is defined by <em>cron.deleteBounces</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cron<span class="token operator">:</span> <span class="token punctuation">{</span>\n    deleteBounces<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// hourly</span>\n      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 0 * * * *&#39;</span><span class="token punctuation">,</span>\n      minLapsedHoursSinceLatestNotificationEnded<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>minLapsedHoursSinceLatestNotificationEnded</em> is the time span</li></ul><h2 id="re-dispatch-broadcast-push-notifications" tabindex="-1"><a class="header-anchor" href="#re-dispatch-broadcast-push-notifications" aria-hidden="true">#</a> Re-dispatch Broadcast Push Notifications</h2>', 22);
const _hoisted_29 = /* @__PURE__ */ createStaticVNode('<p>The default config is defined by <em>cron.reDispatchBroadcastPushNotifications</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cron<span class="token operator">:</span> <span class="token punctuation">{</span>\n    reDispatchBroadcastPushNotifications<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// minutely</span>\n      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 * * * * *&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="clear-redis-datastore" tabindex="-1"><a class="header-anchor" href="#clear-redis-datastore" aria-hidden="true">#</a> Clear Redis Datastore</h2><p>This cron job clears Redis datastore used for SMS and email throttle. The job is enabled only if Redis is used. Datastore is cleared only when there is no broadcast push notifications in <em>sending</em> state. Without this cron job, updated throttle settings in config file will never take effect, and staled jobs in Redis datastore will not be cleaned up.</p><p>The default config is defined by <em>cron.clearRedisDatastore</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cron<span class="token operator">:</span> <span class="token punctuation">{</span>\n    clearRedisDatastore<span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// hourly</span>\n      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 0 * * * *&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 6);
function _sfc_render(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    _hoisted_2,
    createBaseVNode("p", null, [
      createTextVNode("By default cron jobs are enabled. In a multi-node deployment, cron jobs should only run on the "),
      createVNode(_component_RouterLink, { to: "/docs/config-nodeRoles/" }, {
        default: withCtx(() => [
          createTextVNode("master node")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(" to ensure single execution.")
    ]),
    createBaseVNode("p", null, [
      createTextVNode("All cron jobs have a property named "),
      _hoisted_3,
      _hoisted_4,
      createTextVNode(" with the value of a space separated fields conforming to "),
      createBaseVNode("a", _hoisted_5, [
        createTextVNode("unix crontab format"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" with an optional left-most seconds field. See "),
      createBaseVNode("a", _hoisted_6, [
        createTextVNode("allowed ranges"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" of each field.")
    ]),
    _hoisted_7,
    createBaseVNode("p", null, [
      createTextVNode("This cron job re-dispatches a broadcast push notifications when original request failed. It is part of "),
      createVNode(_component_RouterLink, { to: "/docs/config/notification.html#guaranteed-broadcast-push-dispatch-processing" }, {
        default: withCtx(() => [
          createTextVNode("guaranteed broadcast push dispatch processing")
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _hoisted_29
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-d2fa7b0c.js.map
