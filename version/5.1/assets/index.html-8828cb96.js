import{_ as c,r as p,o as r,c as l,a as n,b as s,d as e,w as i,e as t}from"./app-3fbc716c.js";const u={},d=t('<h1 id="notification" tabindex="-1"><a class="header-anchor" href="#notification" aria-hidden="true">#</a> Notification</h1><p>Configs in this section customize the handling of notification request or generating notifications from RSS feeds. They are all sub-properties of config object <em>notification</em>. Service-agnostic configs are static and service-dependent configs are dynamic.</p><h2 id="rss-feeds" tabindex="-1"><a class="header-anchor" href="#rss-feeds" aria-hidden="true">#</a> RSS Feeds</h2><p><em>NotifyBC</em> can generate broadcast push notifications automatically by polling RSS feeds periodically and detect changes by comparing with an internally maintained history list. The polling frequency, RSS url, RSS item change detection criteria, and message template can be defined in dynamic configs.</p><div class="custom-container danger"><p class="custom-container-title">Only first page is retrieved for paginated RSS feeds</p><p>If a RSS feed is paginated, <i>NotifyBC</i> only retrieves the first page rather than auto-fetch subsequent pages. Hence paginated RSS feeds should be sorted descendingly by last modified timestamp. Refresh interval should be adjusted small enough such that all new or updated items are contained in first page.</p></div>',5),m=n("em",null,"myService",-1),h=n("em",null,"http://my-serivce/rss",-1),b=t(`<div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;notification&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;serviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;myService&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;rss&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://my-serivce/rss&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;timeSpec&quot;</span><span class="token operator">:</span> <span class="token string">&quot;* * * * *&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;itemKeyField&quot;</span><span class="token operator">:</span> <span class="token string">&quot;guid&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;outdatedItemRetentionGenerations&quot;</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
      <span class="token property">&quot;includeUpdatedItems&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">&quot;fieldsToCheckForUpdate&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;title&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;pubDate&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;description&quot;</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;httpHost&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://localhost:3000&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;messageTemplates&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@invlid.local&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;{title}&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;{description}&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;htmlBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;{description}&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;sms&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;{description}&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The config items in the <em>value</em> field are</p>`,2),f=n("li",null,"url: RSS url",-1),k=n("a",{name:"timeSpec"},null,-1),v={href:"https://www.freebsd.org/cgi/man.cgi?crontab(5)",target:"_blank",rel:"noopener noreferrer"},g={href:"https://github.com/kelektiv/node-cron#cron-ranges",target:"_blank",rel:"noopener noreferrer"},y=t("<li>itemKeyField: rss item&#39;s unique key field to identify new items. By default <em>guid</em></li><li>outdatedItemRetentionGenerations: number of last consecutive polls from which results an item has to be absent before the item can be removed from the history list. This config is designed to prevent multiple notifications triggered by the same item because RSS poll returns inconsistent results, usually due to a combination of pagination and lack of sorting. By default 1, meaning the history list only keeps the last poll result</li><li>includeUpdatedItems: whether to notify also updated items or just new items. By default <em>false</em></li><li>fieldsToCheckForUpdate: list of fields to check for updates if <em>includeUpdatedItems</em> is <em>true</em>. By default <em>[&quot;pubDate&quot;]</em></li>",4),q=n("em",null,"NotifyBC",-1),_=t(`<h2 id="broadcast-push-notification-task-concurrency" tabindex="-1"><a class="header-anchor" href="#broadcast-push-notification-task-concurrency" aria-hidden="true">#</a> Broadcast Push Notification Task Concurrency</h2><p>To achieve horizontal scaling, when a broadcast push notification request, hereby known as original request, is received, <em>NotifyBC</em> divides subscribers into chunks and generates a HTTP sub-request for each chunk. The original request supervises the execution of sub-requests. The chunk size is defined by config <em>broadcastSubscriberChunkSize</em>. All subscribers in a sub-request chunk are processed concurrently when the sub-requests are submitted.</p><p>The original request submits sub-requests back to (preferably load-balanced) <em>NotifyBC</em> server cluster for processing. Sub-request submission is throttled by config <em>broadcastSubRequestBatchSize</em>. <em>broadcastSubRequestBatchSize</em> defines the upper limit of the number of Sub-requests that can be processed at any given time.</p><p>As an example, assuming the total number of subscribers for a notification is 1,000,000, <em>broadcastSubscriberChunkSize</em> is 1,000 and <em>broadcastSubRequestBatchSize</em> is 10, <em>NotifyBC</em> will divide the 1M subscribers into 1,000 chunks and generates 1,000 sub-requests, one for each chunk. The 1,000 sub-requests will be submitted back to <em>NotifyBC</em> cluster to be processed. The original request will ensure at most 10 sub-requests are submitted and being processed at any given time. In fact, the only time concurrency is less than 10 is near the end of the task when remaining sub-requests is less than 10. When a sub-request is received by <em>NotifyBC</em> cluster, all 1,000 subscribers are processed concurrently. Suppose each sub-request (i.e. 1,000 subscribers) takes 1 minute to process on average, then the total time to dispatch notifications to 1M subscribers takes 1,000/10 = 100min, or 1hr40min.</p><p>The default value for <em>broadcastSubscriberChunkSize</em> and <em>broadcastSubRequestBatchSize</em> are defined in <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  notification<span class="token operator">:</span> <span class="token punctuation">{</span>
    broadcastSubscriberChunkSize<span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span>
    broadcastSubRequestBatchSize<span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To customize, create the config with updated value in file <em>/src/config.local.js</em>.</p><p>If total number of subscribers is less than <em>broadcastSubscriberChunkSize</em>, then no sub-requests are spawned. Instead, the main request dispatches all notifications.</p><div class="custom-container tip"><p class="custom-container-title">How to determine the optimal value for <i>broadcastSubscriberChunkSize</i> and <i>broadcastSubRequestBatchSize</i>?</p><p><i>broadcastSubscriberChunkSize</i> is determined by the concurrency capability of the downstream message handlers such as SMTP server or SMS service provider. <i>broadcastSubRequestBatchSize</i> is determined by the size of <i>NotifyBC</i> cluster. As a rule of thumb, set <i>broadcastSubRequestBatchSize</i> equal to the number of non-master nodes in <i>NotifyBC</i> cluster.</p></div><h2 id="broadcast-push-notification-custom-filter-functions" tabindex="-1"><a class="header-anchor" href="#broadcast-push-notification-custom-filter-functions" aria-hidden="true">#</a> Broadcast Push Notification Custom Filter Functions</h2><div class="custom-container warning"><p class="custom-container-title">Advanced Topic</p><p>Defining custom function requires knowledge of JavaScript and understanding how external libraries are added and referenced in Node.js. Setting a development environment to test the custom function is also recommended.</p></div>`,11),S=n("em",null,"NotifyBC",-1),w={href:"https://github.com/f-w/jmespath.js",target:"_blank",rel:"noopener noreferrer"},B={href:"http://jmespath.org/",target:"_blank",rel:"noopener noreferrer"},j=n("a",{href:"../api-subscription#broadcastPushNotificationFilter"},"broadcastPushNotificationFilter",-1),x=n("a",{href:"../api-notification#broadcastPushNotificationSubscriptionFilter"},"broadcastPushNotificationSubscriptionFilter",-1),N=n("em",null,"notification.broadcastCustomFilterFunctions",-1),C=n("em",null,"async",-1),T=n("em",null,"contains_ci",-1),P=n("em",null,"/src/config.local.js",-1),R=t(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> _ <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;lodash&#39;</span><span class="token punctuation">)</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  <span class="token literal-property property">notification</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">broadcastCustomFilterFunctions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">contains_ci</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token function-variable function">_func</span><span class="token operator">:</span> <span class="token keyword">async</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">resolvedArgs</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token operator">!</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token boolean">false</span>
          <span class="token punctuation">}</span>
          <span class="token keyword">return</span> _<span class="token punctuation">.</span><span class="token function">toLower</span><span class="token punctuation">(</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>_<span class="token punctuation">.</span><span class="token function">toLower</span><span class="token punctuation">(</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token number">0</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token literal-property property">_signature</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">types</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">types</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),F={href:"https://github.com/f-w/jmespath.js/blob/master/jmespath.js#L1127",target:"_blank",rel:"noopener noreferrer"},z={href:"https://github.com/f-w/jmespath.js/blob/master/jmespath.js#L132",target:"_blank",rel:"noopener noreferrer"},I={href:"https://lodash.com/",target:"_blank",rel:"noopener noreferrer"},A=t('<div class="custom-container tip"><p class="custom-container-title">install additional Node.js modules</p><p>The recommended way to install additional Node.js modules is by running command <i><a href="https://docs.npmjs.com/cli/install">npm install &lt;your_module&gt;</a></i> from the directory one level above <i>NotifyBC</i> root. For example, if <i>NotifyBC</i> is installed on <i>/data/notifyBC</i>, then run the command from directory <i>/data</i>. The command will then install the module to <i>/data/node_modules/&lt;your_module&gt;</i>.</p></div><h2 id="guaranteed-broadcast-push-dispatch-processing" tabindex="-1"><a class="header-anchor" href="#guaranteed-broadcast-push-dispatch-processing" aria-hidden="true">#</a> Guaranteed Broadcast Push Dispatch Processing</h2><p>As a major enhancement in v3, by default <em>NotifyBC</em> guarantees all subscribers of a broadcast push notification will be processed in spite of <em>NotifyBC</em> node failures during dispatching. Node failure is a concern because the time takes to dispatch broadcast push notification is proportional to number of subscribers, which is potentially large.</p><p>The guarantee is achieved by</p><ol><li>logging the dispatch result to database individually right after each dispatch</li><li>when subscribers are divided into chunks and a chunk sub-request fails, the original request re-submits the sub-request</li><li>the original request periodically updates the notification <em>updated</em> timestamp field as heartbeat during dispatching</li><li>if original request fails, <ol><li>a cron job detects the failure from the stale timestamp, and re-submits the original request</li><li>all chunk sub-requests detects the the failure from the socket error, and stop processing</li></ol></li></ol>',5),D=t(`<p>If performance is a higher priority to you, disable both the guarantee and bounce handling by setting config <em>notification.guaranteedBroadcastPushDispatchProcessing</em> and <em>email.bounce.enabled</em> to <em>false</em> in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">notification</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">guaranteedBroadcastPushDispatchProcessing</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">bounce</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In such case only failed dispatches are written to <em>dispatch.failed</em> field of the notification.</p><h3 id="also-log-skipped-dispatches-for-broadcast-push-notifications" tabindex="-1"><a class="header-anchor" href="#also-log-skipped-dispatches-for-broadcast-push-notifications" aria-hidden="true">#</a> Also log skipped dispatches for broadcast push notifications</h3><p>When <em>guaranteedBroadcastPushDispatchProcessing</em> is <em>true</em>, by default only successful and failed dispatches are logged, along with dispatch candidates. Dispatches that are skipped by filters defined at subscription (<em>broadcastPushNotificationFilter</em>) or notification (<em>broadcastPushNotificationSubscriptionFilter</em>) are not logged for performance reason. If you also want skipped dispatches to be logged to <em>dispatch.skipped</em> field of the notification, set <em>logSkippedBroadcastPushDispatches</em> to <em>true</em> in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  <span class="token literal-property property">notification</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    <span class="token literal-property property">logSkippedBroadcastPushDispatches</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Setting <em>logSkippedBroadcastPushDispatches</em> to <em>true</em> only has effect when <em>guaranteedBroadcastPushDispatchProcessing</em> is <em>true</em>.</p>`,7);function L(M,H){const o=p("RouterLink"),a=p("ExternalLinkIcon");return r(),l("div",null,[d,n("p",null,[s("For example, to notify subscribers of "),m,s(" on updates to feed "),h,s(", create following config item using "),e(o,{to:"/docs/api-config/#create-a-configuration"},{default:i(()=>[s("POST configuration API")]),_:1})]),b,n("ul",null,[n("li",null,[s("rss "),n("ul",null,[f,n("li",null,[k,s("timeSpec: RSS poll frequency, a space separated fields conformed to "),n("a",v,[s("unix crontab format"),e(a)]),s(" with an optional left-most seconds field. See "),n("a",g,[s("allowed ranges"),e(a)]),s(" of each field")]),y])]),n("li",null,[s("httpHost: the http protocol, host and port used by "),e(o,{to:"/docs/overview/#mail-merge"},{default:i(()=>[s("mail merge")]),_:1}),s(". If missing, the value is auto-populated based on the REST request that creates this config item.")]),n("li",null,[s("messageTemplates: channel-specific message templates with channel name as the key. "),q,s(" generates a notification for each channel specified in the message templates. Message template fields are the same as those in "),e(o,{to:"/docs/api-notification/#field-message"},{default:i(()=>[s("notification api")]),_:1}),s(". Message template fields support dynamic token.")])]),_,n("p",null,[s("To support rule-based notification event filtering, "),S,s(" uses a "),n("a",w,[s("modified version"),e(a)]),s(" of "),n("a",B,[s("jmespath"),e(a)]),s(" to implement json query. The modified version allows defining custom functions that can be used in "),j,s(" field of subscription API and "),x,s(" field of subscription API. The functions must be implemented using JavaScript in config "),N,s(". The functions can even be "),C,s(". For example, the case-insensitive string matching function "),T,s(" shown in the example of that field can be created in file "),P]),R,n("p",null,[s("Consult jmespath.js source code on the "),n("a",F,[s("functionTable syntax"),e(a)]),s(" and "),n("a",z,[s("type constants"),e(a)]),s(" used by above code. Note the function can use any Node.js modules ("),n("em",null,[n("a",I,[s("lodash"),e(a)])]),s(" in this case).")]),A,n("p",null,[s("Guaranteed processing doesn't mean notification will be dispatched to every intended subscriber, however. Dispatch can still be rejected by smtp/sms server. Furthermore, even if dispatch is successful, it only means the sending is successful. It doesn't guarantee the recipient receives the notification. "),e(o,{to:"/docs/config/email.html#bounce"},{default:i(()=>[s("Bounce")]),_:1}),s(" may occur for a successful dispatch, for instance; or the recipient may not read the message.")]),n("p",null,[s("The guarantee comes at a performance penalty because result of each dispatch is written to database one by one, taking a toll on the database. It should be noted that the "),e(o,{to:"/docs/miscellaneous/benchmarks.html"},{default:i(()=>[s("benchmarks")]),_:1}),s(" were conducted without the guarantee.")]),D])}const E=c(u,[["render",L],["__file","index.html.vue"]]);export{E as default};
