import{_ as p,c as i,e,a as n,f as a,b as l,d as o,r,o as c}from"./app-D7Q0gFu3.js";const u={};function d(m,s){const t=r("RouteLink");return c(),i("div",null,[s[13]||(s[13]=e(`<h1 id="sms" tabindex="-1"><a class="header-anchor" href="#sms"><span>SMS</span></a></h1><h2 id="provider" tabindex="-1"><a class="header-anchor" href="#provider"><span>Provider</span></a></h2><p><em>NotifyBC</em> depends on underlying SMS service providers to deliver SMS messages. The supported service providers are</p><ul><li><a href="https://twilio.com/" target="_blank" rel="noopener noreferrer">Twilio</a> (default)</li><li><a href="https://www.swiftsmsgateway.com" target="_blank" rel="noopener noreferrer">Swift</a></li></ul><p>Only one service provider can be chosen per installation. To change service provider, add following config to file <em>/src/config.local.js</em></p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts" data-title="ts"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  sms<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    provider<span class="token operator">:</span> <span class="token string">&#39;swift&#39;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="provider-settings" tabindex="-1"><a class="header-anchor" href="#provider-settings"><span>Provider Settings</span></a></h2><p>Provider specific settings are defined in config <em>sms.providerSettings</em>. You should have an account with the chosen service provider before proceeding.</p><h3 id="twilio" tabindex="-1"><a class="header-anchor" href="#twilio"><span>Twilio</span></a></h3><p>Add <em>sms.providerSettings.twilio</em> config object to file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">providerSettings</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">twilio</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">accountSid</span><span class="token operator">:</span> <span class="token string">&#39;&lt;AccountSid&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">authToken</span><span class="token operator">:</span> <span class="token string">&#39;&lt;AuthToken&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">fromNumber</span><span class="token operator">:</span> <span class="token string">&#39;&lt;FromNumber&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Obtain <em>&lt;AccountSid&gt;</em>, <em>&lt;AuthToken&gt;</em> and <em>&lt;FromNumber&gt;</em> from your Twilio account.</p><h3 id="swift" tabindex="-1"><a class="header-anchor" href="#swift"><span>Swift</span></a></h3><p>Add <em>sms.providerSettings.swift</em> config object to file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">providerSettings</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">swift</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">accountKey</span><span class="token operator">:</span> <span class="token string">&#39;&lt;accountKey&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Obtain <em>&lt;accountKey&gt;</em> from your Swift account.</p><h4 id="unsubscription-by-replying-a-keyword" tabindex="-1"><a class="header-anchor" href="#unsubscription-by-replying-a-keyword"><span>Unsubscription by replying a keyword</span></a></h4><p>With Swift short code, sms user can unsubscribe by replying to a sms message with a keyword. The keyword must be pre-registered with Swift.</p><p>To enable this feature,</p>`,19)),n("ol",null,[s[11]||(s[11]=e(`<li><p>Generate a random string, hereafter referred to as <em>&lt;randomly-generated-string&gt;</em></p></li><li><p>Add it to <em>sms.providerSettings.swift.notifyBCSwiftKey</em> in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">providerSettings</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">swift</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">notifyBCSwiftKey</span><span class="token operator">:</span> <span class="token string">&#39;&lt;randomly-generated-string&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Go to Swift web admin console, click <em>Number Management</em> tab</p></li><li><p>Click <em>Launch</em> button next to <em>Manage Short Code Keywords</em></p></li><li><p>Click <em>Features</em> button next to the registered keyword(s). A keyword may have multiple entries. In such case do this for each entry.</p></li><li><p>Click <em>Redirect To Webpage</em> tab in the popup window</p></li>`,6)),n("li",null,[s[10]||(s[10]=n("p",null,"Enter following information in the tab",-1)),n("ul",null,[n("li",null,[s[1]||(s[1]=a("set ")),s[2]||(s[2]=n("em",null,"URL",-1)),s[3]||(s[3]=a(" to ")),s[4]||(s[4]=n("em",null,"<NotifyBCHttpHost>/api/subscriptions/swift",-1)),s[5]||(s[5]=a(", where ")),s[6]||(s[6]=n("em",null,"<NotifyBCHttpHost>",-1)),s[7]||(s[7]=a(" is NotifyBC HTTP host name and should be the same as ")),l(t,{to:"/docs/config-httpHost/"},{default:o(()=>s[0]||(s[0]=[a("HTTP Host")])),_:1}),s[8]||(s[8]=a(" config"))]),s[9]||(s[9]=e("<li>set <em>Method</em> to <em>POST</em></li><li>set <em>Custom Parameter 1 Name</em> to <em>notifyBCSwiftKey</em></li><li>set <em>Custom Parameter 1 Value</em> to <em>&lt;randomly-generated-string&gt;</em></li>",3))])]),s[12]||(s[12]=n("li",null,[n("p",null,[a("Click "),n("em",null,"Save Changes"),a(" button and then "),n("em",null,"Done")])],-1))]),s[14]||(s[14]=e(`<h2 id="throttle" tabindex="-1"><a class="header-anchor" href="#throttle"><span>Throttle</span></a></h2><p>All supported SMS service providers impose request rate limit. <em>NotifyBC</em> by default throttles request rate to 4/sec. To adjust the rate, create following config in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">max</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>max</em> - max numbers of requests per duration. Default to 4.</li><li><em>duration</em> - time span in ms. Default to 1000.</li></ul><p>To disable throttle, set <em>sms.throttle.enabled</em> to <em>false</em> in file /src/config.local.js</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">sms</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7))])}const k=p(u,[["render",d],["__file","index.html.vue"]]),b=JSON.parse('{"path":"/docs/config-sms/","title":"SMS","lang":"en-US","frontmatter":{"permalink":"/docs/config-sms/"},"headers":[{"level":2,"title":"Provider","slug":"provider","link":"#provider","children":[]},{"level":2,"title":"Provider Settings","slug":"provider-settings","link":"#provider-settings","children":[{"level":3,"title":"Twilio","slug":"twilio","link":"#twilio","children":[]},{"level":3,"title":"Swift","slug":"swift","link":"#swift","children":[]}]},{"level":2,"title":"Throttle","slug":"throttle","link":"#throttle","children":[]}],"git":{},"filePathRelative":"docs/config/sms.md"}');export{k as comp,b as data};
