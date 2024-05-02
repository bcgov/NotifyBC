import{_ as c,r as o,o as r,c as l,a as s,b as n,d as a,w as i,e}from"./app-ddf00f98.js";const u={},d=e(`<h1 id="subscription" tabindex="-1"><a class="header-anchor" href="#subscription" aria-hidden="true">#</a> Subscription</h1><p>Configs in this section customize behavior of subscription and unsubscription workflow. They are all sub-properties of config object <em>subscription</em>. This object can be defined as service-agnostic static config as well as service-specific dynamic config, which overrides the static one on a service-by-service basis. Default static config is defined in file <em>/src/config.ts</em>. There is no default dynamic config.</p><p>To customize static config, create the config object <em>subscription</em> in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token string-property property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),m=s("a",{id:"subscription-confirmation-request-template"},null,-1),v=e(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST http://localhost:3000/api/configurations <span class="token punctuation">\\</span>
<span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-H</span> <span class="token string">&#39;Accept: application/json&#39;</span> <span class="token parameter variable">-d</span> @- <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
{
  &quot;name&quot;: &quot;subscription&quot;,
  &quot;serviceName&quot;: &quot;myService&quot;,
  &quot;value&quot;: {
     ...
  }
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Sub-properties denoted by ellipsis in the above two code blocks are documented below. A service can have at most one dynamic subscription config.</p><h2 id="confirmation-request-message" tabindex="-1"><a class="header-anchor" href="#confirmation-request-message" aria-hidden="true">#</a> Confirmation Request Message</h2><p>To prevent <em>NotifyBC</em> from being used as spam engine, when a subscription request is sent by user (as opposed to admin) without encryption, the content of confirmation request sent to user&#39;s notification channel has to come from a pre-configured template as opposed to be specified in subscription request.</p><p>The following default subscription sub-property <em>confirmationRequest</em> defines confirmation request message settings for different channels</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    ...
    <span class="token property">&quot;confirmationRequest&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;sms&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;confirmationCodeRegex&quot;</span><span class="token operator">:</span> <span class="token string">&quot;\\\\d{5}&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;sendRequest&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Enter {confirmation_code} on screen&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;confirmationCodeRegex&quot;</span><span class="token operator">:</span> <span class="token string">&quot;\\\\d{5}&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;sendRequest&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@invlid.local&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Subscription confirmation&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Enter {confirmation_code} on screen&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;htmlBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Enter {confirmation_code} on screen&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="confirmation-verification-acknowledgement-messages" tabindex="-1"><a class="header-anchor" href="#confirmation-verification-acknowledgement-messages" aria-hidden="true">#</a> Confirmation Verification Acknowledgement Messages</h2><p>You can customize <em>NotifyBC</em>&#39;s on-screen response message to confirmation code verification requests. The following is the default settings</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    ...
    <span class="token property">&quot;confirmationAcknowledgements&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;successMessage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;You have been subscribed.&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;failureMessage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Error happened while confirming subscription.&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In addition to customizing the message, you can define a redirect URL instead of displaying <em>successMessage</em> or <em>failureMessage</em>. For example, to redirect on-screen acknowledgement to a page in your app for service <em>myService</em>, create a dynamic config by calling REST config api</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&#39;http://localhost:3000/api/configurations&#39;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-H</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-H</span> <span class="token string">&#39;Accept: application/json&#39;</span> <span class="token parameter variable">-d</span> @- <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
{
  &quot;name&quot;: &quot;subscription&quot;,
  &quot;serviceName&quot;: &quot;myService&quot;,
  &quot;value&quot;: {
    &quot;confirmationAcknowledgements&quot;: {
      &quot;redirectUrl&quot;: &quot;https://myapp/subscription/acknowledgement&quot;
    }
  }
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If error happened during subscription confirmation, query string <em>?err=&lt;error&gt;</em> will be appended to <em>redirectUrl</em>.</p><h2 id="duplicated-subscription" tabindex="-1"><a class="header-anchor" href="#duplicated-subscription" aria-hidden="true">#</a> Duplicated Subscription</h2><p><em>NotifyBC</em> by default allows a user subscribe to a service through same channel multiple times. If this is undesirable, you can set config <em>subscription.detectDuplicatedSubscription</em> to true. In such case instead of sending user a confirmation request, <em>NotifyBC</em> sends user a duplicated subscription notification message. Unlike a confirmation request, duplicated subscription notification message either shouldn&#39;t contain any information to allow user confirm the subscription, or it should contain a link that allows user to replace existing confirmed subscription with this one. You can customize duplicated subscription notification message by setting config <em>subscription.duplicatedSubscriptionNotification</em> in either <em>config.local.js</em> or using configuration api for service-specific dynamic config. Following is the default settings defined in <em>config.json</em></p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  ...
  <span class="token property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    ...
    <span class="token property">&quot;detectDuplicatedSubscription&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token property">&quot;duplicatedSubscriptionNotification&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;sms&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A duplicated subscription was submitted and rejected. you will continue receiving notifications. If the request was not created by you, pls ignore this msg.&quot;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@invalid.local&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Duplicated Subscription&quot;</span><span class="token punctuation">,</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A duplicated subscription was submitted and rejected. you will continue receiving notifications. If the request was not created by you, please ignore this message.&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To allow user to replace existing confirmed subscription, set the message to something like</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  ...
  <span class="token property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    ...
    <span class="token property">&quot;detectDuplicatedSubscription&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token property">&quot;duplicatedSubscriptionNotification&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A duplicated subscription was submitted. If the request is not submitted by you, please ignore this message. Otherwise if you want to replace existing subscription with this one, click {subscription_confirmation_url}&amp;replace=true.&quot;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The query parameter <em>&amp;replace=true</em> following the token <em>{subscription_confirmation_url}</em> will cause existing subscription be replaced.</p><h2 id="anonymous-unsubscription" tabindex="-1"><a class="header-anchor" href="#anonymous-unsubscription" aria-hidden="true">#</a> Anonymous Unsubscription</h2><p>For anonymous subscription, <em>NotifyBC</em> supports one-click opt-out by allowing unsubscription URL provided in notifications. To thwart unauthorized unsubscription attempts, <em>NotifyBC</em> implemented and enabled by default two security measurements</p>`,20),b=s("li",null,"Anonymous unsubscription request requires unsubscription code, which is a random string generated at subscription time. Unsubscription code reduces brute force attack risk by increasing size of key space. Without it, an attacker only needs to successfully guess subscription id. Be aware, however, the unsubscription code has to be embedded in unsubscription link. If the user forwarded a notification to other people, he/she is still vulnerable to unauthorized unsubscription.",-1),k=s("em",null,"anonymousUnsubscription",-1),g={href:"https://github.com/bcgov/NotifyBC/blob/main/src/config.ts",target:"_blank",rel:"noopener noreferrer"},f=e(`<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  subscription<span class="token operator">:</span> <span class="token punctuation">{</span>
    anonymousUnsubscription<span class="token operator">:</span> <span class="token punctuation">{</span>
      code<span class="token operator">:</span> <span class="token punctuation">{</span>
        required<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        regex<span class="token operator">:</span> <span class="token string">&#39;\\\\d{5}&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      acknowledgements<span class="token operator">:</span> <span class="token punctuation">{</span>
        onScreen<span class="token operator">:</span> <span class="token punctuation">{</span>
          successMessage<span class="token operator">:</span> <span class="token string">&#39;You have been un-subscribed.&#39;</span><span class="token punctuation">,</span>
          failureMessage<span class="token operator">:</span> <span class="token string">&#39;Error happened while un-subscribing.&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        notification<span class="token operator">:</span> <span class="token punctuation">{</span>
          email<span class="token operator">:</span> <span class="token punctuation">{</span>
            from<span class="token operator">:</span> <span class="token string">&#39;no_reply@invalid.local&#39;</span><span class="token punctuation">,</span>
            subject<span class="token operator">:</span> <span class="token string">&#39;Un-subscription acknowledgement&#39;</span><span class="token punctuation">,</span>
            textBody<span class="token operator">:</span>
              <span class="token string">&#39;This is to acknowledge you have been un-subscribed from receiving notification for {unsubscription_service_names}. If you did not authorize this change or if you changed your mind, open {unsubscription_reversion_url} to revert.&#39;</span><span class="token punctuation">,</span>
            htmlBody<span class="token operator">:</span>
              <span class="token string">&#39;This is to acknowledge you have been un-subscribed from receiving notification for {unsubscription_service_names}. If you did not authorize this change or if you changed your mind, click &lt;a href=&quot;{unsubscription_reversion_url}&quot;&gt;here&lt;/a&gt; to revert.&#39;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The settings control whether or not unsubscription code is required, its RegEx pattern, and acknowledgement message templates for both on-screen and push notifications. Customization should be made to file <em>/src/config.local.js</em> for static config or using configuration api for service-specific dynamic config.</p><p>To disable acknowledgement notification, set <em>subscription.anonymousUnsubscription.acknowledgements.notification</em> or a specific channel underneath to <em>null</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">subscription</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">anonymousUnsubscription</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">acknowledgements</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">notification</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>For on-screen acknowledgement, you can define a redirect URL instead of displaying <em>successMessage</em> or <em>failureMessage</em>. For example, to redirect on-screen acknowledgement to a page in your app for all services, create following config in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">subscription</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">anonymousUnsubscription</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">acknowledgements</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">onScreen</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">redirectUrl</span><span class="token operator">:</span> <span class="token string">&#39;https://myapp/unsubscription/acknowledgement&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If error happened during unsubscription, query string <em>?err=&lt;error&gt;</em> will be appended to <em>redirectUrl</em>.</p><p><a name="anonymousUndoUnsubscription"></a> You can customize message displayed on-screen when user clicks revert unsubscription link in the acknowledgement notification. The default settings are</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;subscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;anonymousUndoUnsubscription&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;successMessage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;You have been re-subscribed.&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;failureMessage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Error happened while re-subscribing.&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You can redirect the message page by defining <em>anonymousUndoUnsubscription.redirectUrl</em>.</p>`,10);function h(q,y){const t=o("RouterLink"),p=o("ExternalLinkIcon");return r(),l("div",null,[d,s("p",null,[m,n(" to create a service-specific dynamic subscription config, use REST "),a(t,{to:"/docs/api-config/"},{default:i(()=>[n("config api")]),_:1})]),v,s("ul",null,[b,s("li",null,[n("Acknowledgement notification - a (final) notification is sent to user acknowledging unsubscription, and offers a link to revert had the change been made unauthorized. A deleted subscription (unsubscription) may have a limited lifetime (30 days by default) according to retention policy defined in "),a(t,{to:"/docs/config-cronJobs/"},{default:i(()=>[n("cron jobs")]),_:1}),n(" so the reversion can only be performed within the lifetime.")])]),s("p",null,[n("You can customize anonymous unsubscription settings by changing the "),k,n(" configuration. Following is the default settings defined in "),s("a",g,[n("config.json"),a(p)])]),f])}const _=c(u,[["render",h],["__file","index.html.vue"]]);export{_ as default};
