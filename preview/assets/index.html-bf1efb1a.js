import{_ as p,r as i,o as l,c as r,a as s,b as n,d as e,w as o,e as c}from"./app-c47379d7.js";const d={},u=s("h1",{id:"cron-jobs",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#cron-jobs","aria-hidden":"true"},"#"),n(" Cron Jobs")],-1),m=s("p",null,[s("em",null,"NotifyBC"),n(" runs several cron jobs described below. These jobs are controlled by sub-properties defined in config object "),s("em",null,"cron"),n(". To change config, create the object and properties in file "),s("em",null,"/src/config.local.js"),n(".")],-1),v=s("a",{name:"timeSpec"},null,-1),f=s("em",null,"timeSpec",-1),k={href:"https://www.freebsd.org/cgi/man.cgi?crontab(5)",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/kelektiv/node-cron#cron-ranges",target:"_blank",rel:"noopener noreferrer"},h=c(`<h2 id="purge-data" tabindex="-1"><a class="header-anchor" href="#purge-data" aria-hidden="true">#</a> Purge Data</h2><p>This cron job purges old notifications, subscriptions and notification bounces. The default frequency of cron job and retention policy are defined by <em>cron.purgeData</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  cron<span class="token operator">:</span> <span class="token punctuation">{</span>
    purgeData<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// daily at 1am</span>
      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 0 1 * * *&#39;</span><span class="token punctuation">,</span>
      pushNotificationRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      expiredInAppNotificationRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      nonConfirmedSubscriptionRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      deletedBounceRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      expiredAccessTokenRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
      defaultRetentionDays<span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>pushNotificationRetentionDays</em>: the retention days of push notifications</li><li><em>expiredInAppNotificationRetentionDays</em>: the retention days of expired inApp notifications</li><li><em>nonConfirmedSubscriptionRetentionDays</em>: the retention days of non-confirmed subscriptions, i.e. all unconfirmed and deleted subscriptions</li><li><em>deletedBounceRetentionDays</em>: the retention days of deleted notification bounces</li><li>expiredAccessTokenRetentionDays: the retention days of expired access tokens</li><li><em>defaultRetentionDays</em>: if any of the above retention day config item is omitted, default retention days is used as fall back.</li></ul><p>To change a config item, set the config item in file <em>/src/config.local.js</em>. For example, to run cron jobs at 2am daily, add following object to <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">cron</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">purgeData</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">timeSpec</span><span class="token operator">:</span> <span class="token string">&#39;0 0 2 * * *&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dispatch-live-notifications" tabindex="-1"><a class="header-anchor" href="#dispatch-live-notifications" aria-hidden="true">#</a> Dispatch Live Notifications</h2><p>This cron job sends out future-dated notifications when the notification becomes current. The default config is defined by <em>cron.dispatchLiveNotifications</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  cron<span class="token operator">:</span> <span class="token punctuation">{</span>
    dispatchLiveNotifications<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// minutely</span>
      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 * * * * *&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="check-rss-config-updates" tabindex="-1"><a class="header-anchor" href="#check-rss-config-updates" aria-hidden="true">#</a> Check Rss Config Updates</h2><p>This cron job monitors RSS feed notification dynamic config items. If a config item is created, updated or deleted, the cron job starts, restarts, or stops the RSS-specific cron job. The default config is defined by <em>cron.checkRssConfigUpdates</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  cron<span class="token operator">:</span> <span class="token punctuation">{</span>
    checkRssConfigUpdates<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// minutely</span>
      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 * * * * *&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Note <em>timeSpec</em> doesn&#39;t control the RSS poll frequency (which is defined in dynamic configs and is service specific), instead it only controls the frequency to check for dynamic config changes.</p><h2 id="delete-notification-bounces" tabindex="-1"><a class="header-anchor" href="#delete-notification-bounces" aria-hidden="true">#</a> Delete Notification Bounces</h2><p>This cron job deletes notification bounces if the latest notification is deemed delivered successfully. The criteria of successful delivery are</p><ol><li>No bounce received since the latest notification started dispatching, and</li><li>a configured time span has lapsed since the latest notification finished dispatching</li></ol><p>The default config is defined by <em>cron.deleteBounces</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  cron<span class="token operator">:</span> <span class="token punctuation">{</span>
    deleteBounces<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// hourly</span>
      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 0 * * * *&#39;</span><span class="token punctuation">,</span>
      minLapsedHoursSinceLatestNotificationEnded<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>minLapsedHoursSinceLatestNotificationEnded</em> is the time span</li></ul><h2 id="re-dispatch-broadcast-push-notifications" tabindex="-1"><a class="header-anchor" href="#re-dispatch-broadcast-push-notifications" aria-hidden="true">#</a> Re-dispatch Broadcast Push Notifications</h2>`,22),g=c(`<p>The default config is defined by <em>cron.reDispatchBroadcastPushNotifications</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  cron<span class="token operator">:</span> <span class="token punctuation">{</span>
    reDispatchBroadcastPushNotifications<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// minutely</span>
      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 * * * * *&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="clear-redis-datastore" tabindex="-1"><a class="header-anchor" href="#clear-redis-datastore" aria-hidden="true">#</a> Clear Redis Datastore</h2><p>This cron job clears Redis datastore used for SMS and email throttle. The job is enabled only if Redis is used. Datastore is cleared only when there is no broadcast push notifications in <em>sending</em> state. Without this cron job, updated throttle settings in config file will never take effect, and staled jobs in Redis datastore will not be cleaned up.</p><p>The default config is defined by <em>cron.clearRedisDatastore</em> config object in file <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  cron<span class="token operator">:</span> <span class="token punctuation">{</span>
    clearRedisDatastore<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// hourly</span>
      timeSpec<span class="token operator">:</span> <span class="token string">&#39;0 0 * * * *&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6);function y(x,_){const a=i("RouterLink"),t=i("ExternalLinkIcon");return l(),r("div",null,[u,m,s("p",null,[n("By default cron jobs are enabled. In a multi-node deployment, cron jobs should only run on the "),e(a,{to:"/docs/config-nodeRoles/"},{default:o(()=>[n("master node")]),_:1}),n(" to ensure single execution.")]),s("p",null,[n("All cron jobs have a property named "),v,f,n(" with the value of a space separated fields conforming to "),s("a",k,[n("unix crontab format"),e(t)]),n(" with an optional left-most seconds field. See "),s("a",b,[n("allowed ranges"),e(t)]),n(" of each field.")]),h,s("p",null,[n("This cron job re-dispatches a broadcast push notifications when original request failed. It is part of "),e(a,{to:"/docs/config/notification.html#guaranteed-broadcast-push-dispatch-processing"},{default:o(()=>[n("guaranteed broadcast push dispatch processing")]),_:1})]),g])}const R=p(d,[["render",y],["__file","index.html.vue"]]);export{R as default};
