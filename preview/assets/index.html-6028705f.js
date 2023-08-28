import{_ as l,r as o,o as p,c as r,a as n,b as s,d as e,w as c,e as a}from"./app-bafea29c.js";const u={},d=a('<h1 id="benchmarks" tabindex="-1"><a class="header-anchor" href="#benchmarks" aria-hidden="true">#</a> Benchmarks</h1><div class="custom-container tip"><p class="custom-container-title">tl;dr</p><p>A <i>NotifyBC</i> server node can deliver 1 million emails in as little as 1 hour to a SMTP server node. SMTP server node&#39;s disk I/O is the bottleneck in such case. Throughput can be improved through horizontal scaling.</p></div><p>When <em>NotifyBC</em> is used to deliver broadcast push notifications to a large number of subscribers, probably the most important benchmark is throughput. The benchmark is especially critical if a latency cap is desired. To facilitate capacity planning, load testing on the email channel has been conducted. The test environment, procedure, results and performance tuning advices are provided hereafter.</p><h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment" aria-hidden="true">#</a> Environment</h2><h3 id="hardware" tabindex="-1"><a class="header-anchor" href="#hardware" aria-hidden="true">#</a> Hardware</h3><p>Two computers, connected by 1Gbps LAN, are used to host</p><ul><li><em>NotifyBC</em><ul><li>Mac Mini Late 2012 model</li><li>Intel core i7-3615QM</li><li>16GB RAM</li><li>2TB HDD</li></ul></li><li>SMTP and mail delivery <ul><li>Lenovo ThinkCentre M Series 2015 model</li><li>Intel core i5-3470</li><li>8GB RAM</li><li>256GB SSD</li></ul></li></ul><h3 id="software-stack" tabindex="-1"><a class="header-anchor" href="#software-stack" aria-hidden="true">#</a> Software Stack</h3><p>The test was performed in August 2017. Unless otherwise specified, the versions of all other software were reasonably up-to-date at the time of testing.</p><ul><li><p><em>NotifyBC</em></p><ul><li>MacOS Sierra Version 10.12.6</li><li>Virtualbox VM with 8vCPU, 10GB RAM, created using miniShift v1.3.1+f4900b07</li><li>OpenShift 1.5.1+7b451fc with metrics</li><li>default <em>NotifyBC</em> OpenShift installation, which contains following relevant pods <ul><li>1 mongodb pod with 1 core, 1GiB RAM limit</li><li>a variable number of Node.js app pods each with 1 core, 1GiB RAM limit. The number varies by test runs as indicated in result.</li></ul></li></ul></li><li><p>SMTP and mail delivery</p><ul><li>Windows 7 host</li><li>Virtualbox VM with 4 vCPU, 3.5GB RAM, running Windows Server 2012</li><li>added SMTP Server feature</li><li>in SMTP Server properties dialog box, uncheck all of following boxes in <em>Messages</em> tab <ul><li>Limit message size to (KB)</li><li>Limit session size to (KB)</li><li>Limit number of messages per connection to</li><li>Limit number of recipients per message to</li></ul></li></ul></li></ul><h2 id="procedure" tabindex="-1"><a class="header-anchor" href="#procedure" aria-hidden="true">#</a> Procedure</h2>',11),h=n("em",null,"/src/config.local.js",-1),m=a(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> _ <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;lodash&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">smtp</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;&lt;smtp-vm-ip-or-hostname&gt;&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">secure</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span>
    <span class="token literal-property property">pool</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">direct</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">maxMessages</span><span class="token operator">:</span> <span class="token number">Infinity</span><span class="token punctuation">,</span>
    <span class="token literal-property property">maxConnections</span><span class="token operator">:</span> <span class="token number">50</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">notification</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">broadcastCustomFilterFunctions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">/*jshint camelcase: false */</span>
      <span class="token literal-property property">contains_ci</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token function-variable function">_func</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolvedArgs</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token operator">!</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          <span class="token keyword">return</span> <span class="token punctuation">(</span>
            _<span class="token punctuation">.</span><span class="token function">toLower</span><span class="token punctuation">(</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>_<span class="token punctuation">.</span><span class="token function">toLower</span><span class="token punctuation">(</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span>
            <span class="token number">0</span>
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token literal-property property">_signature</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">types</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">types</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),k={href:"https://github.com/bcgov/NotifyBC/blob/main/src/utils/load-testing/bulk-post-subs.ts",target:"_blank",rel:"noopener noreferrer"},v=n("em",null,"load10",-1),b=n("em",null,"load1000000",-1),g=n("em",null,"bulk-post-subs.js",-1),f=n("em",null,"userChannelId",-1),y=a(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">node</span> dist/utils/load-testing/bulk-post-subs.js <span class="token parameter variable">-h</span>
Usage: <span class="token function">node</span> bulk-post-subs.js <span class="token punctuation">[</span>Options<span class="token punctuation">]</span> <span class="token operator">&lt;</span>userChannelId<span class="token operator">&gt;</span>
<span class="token punctuation">[</span>Options<span class="token punctuation">]</span>:
-a, --api-url-prefix<span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>                      api url prefix. default to http://localhost:3000/api
-c, <span class="token parameter variable">--channel</span><span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>                             channel. default to email
-s, --service-name<span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>                        <span class="token function">service</span> name. default to load
-n, --number-of-subscribers<span class="token operator">=</span><span class="token operator">&lt;</span>int<span class="token operator">&gt;</span>                  number of subscribers. positive integer. default to <span class="token number">1000</span>
-f, --broadcast-push-notification-filter<span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>  broadcast push notification filter. default to <span class="token string">&quot;contains_ci(title,&#39;vancouver&#39;) || contains_ci(title,&#39;victoria&#39;)&quot;</span>
-h, <span class="token parameter variable">--help</span>                                         display this <span class="token builtin class-name">help</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The generated subscriptions contain a filter, hence all load testing results below included time spent on filtering.</p>`,2),_={href:"https://github.com/bcgov/NotifyBC/blob/main/src/utils/load-testing/curl-ntf.sh",target:"_blank",rel:"noopener noreferrer"},x=n("div",{class:"language-text line-numbers-mode","data-ext":"text"},[n("pre",{class:"language-text"},[n("code",null,`dist/utils/load-testing/curl-ntf.sh <apiUrlPrefix> <serviceName> <senderEmail>
`)]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),w=n("p",null,"The script will print start time and the time taken to dispatch the notification.",-1),M=a('<h2 id="results" tabindex="-1"><a class="header-anchor" href="#results" aria-hidden="true">#</a> Results</h2><table><thead><tr><th style="text-align:right;">email count</th><th style="text-align:right;">time taken (min)</th><th style="text-align:right;">throughput (#/min)</th><th style="text-align:right;">app pod count</th><th>notes on bottleneck</th></tr></thead><tbody><tr><td style="text-align:right;">1,000,000</td><td style="text-align:right;">71.5</td><td style="text-align:right;">13,986</td><td style="text-align:right;">1</td><td>app pod cpu capped</td></tr><tr><td style="text-align:right;">100,000</td><td style="text-align:right;">5.8</td><td style="text-align:right;">17,241</td><td style="text-align:right;">2</td><td>smtp vm disk queue length hits 1 frequently</td></tr><tr><td style="text-align:right;">1,000,000</td><td style="text-align:right;">57</td><td style="text-align:right;">17,544</td><td style="text-align:right;">2</td><td>smtp vm disk queue length hits 1 frequently</td></tr><tr><td style="text-align:right;">1,000,000</td><td style="text-align:right;">57.8</td><td style="text-align:right;">17,301</td><td style="text-align:right;">3</td><td>smtp vm disk queue length hits 1 frequently</td></tr></tbody></table><p>Test runs using other software or configurations described below have also been conducted. Because throughput is significantly lower, results are not shown</p><ul><li>using Linux sendmail SMTP. The throughput of a 4-vCPU Linux VM is about the same as a 1-vCPU Windows SMTP server. Bottleneck in such case is the CPU of SMTP server.</li><li>Reducing <em>NotifyBC</em> app pod&#39;s resource limit to 100 millicore CPU and 512MiB RAM. Even when scaled up pod count to 15, throughput is still about 1/3 of a 1-core pod.</li></ul><p><a href="../../attachments/benchmark-email.txt">Here</a> is a sample email saved onto the mail drop folder of SMTP server.</p><h3 id="comparison-to-other-benchmarks" tabindex="-1"><a class="header-anchor" href="#comparison-to-other-benchmarks" aria-hidden="true">#</a> Comparison to Other Benchmarks</h3>',6),S={href:"https://technet.microsoft.com/en-us/library/bb124213(v=exchg.65).aspx",target:"_blank",rel:"noopener noreferrer"},T=n("em",null,"NotifyBC",-1),P=n("ol",null,[n("li",null,"Email size in Microsoft's load test is 50k, as opposed to 1k used in this test"),n("li",null,"SSD storage is used in this test. It is unlikely the test conducted in 2005 used SSD.")],-1),B=n("h2",{id:"advices",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#advices","aria-hidden":"true"},"#"),s(" Advices")],-1),C=n("li",null,"Avoid using default direct mode in production. Instead use SMTP server. Direct mode doesn't support connection pooling, resulting in port depletion quickly.",-1),A={href:"https://nodemailer.com/smtp/pooled/",target:"_blank",rel:"noopener noreferrer"},N=a("<li>Set smtp config <em>maxConnections</em> to a number big enough as long as SMTP server can handle. Test found for Windows SMTP server 50 is a suitable number, beyond which performance gain is insignificant.</li><li>Set smtp config <em>maxMessages</em> to maximum possible number allowed by your SMTP server, or <em>Infinity</em> if SMTP server imposes no such constraint</li><li>Avoid setting CPU resource limit too low for <em>NotifyBC</em> app pods.</li><li>If you have control over the SMTP server, <ul><li>use SSD for its storage</li><li>create a load balanced cluster if possible, since SMTP server is more likely to be the bottleneck.</li></ul></li>",4);function L(I,R){const i=o("RouterLink"),t=o("ExternalLinkIcon");return p(),r("div",null,[d,n("ol",null,[n("li",null,[n("p",null,[s("update or create file "),h,s(" through "),e(i,{to:"/docs/installation/#update-configuration-files"},{default:c(()=>[s("configMap")]),_:1}),s(". Add sections for SMTP server and a custom filter function")]),m]),n("li",null,[n("p",null,[s("create a number of subscriptions in bulk using script "),n("a",k,[s("bulk-post-subs.js"),e(t)]),s(". To load test different email volumes, you can create bulk subscriptions in different services. For example, generate 10 subscriptions under service named "),v,s("; 1,000,000 subscriptions under service "),b,s(" etc. "),g,s(" takes "),f,s(" and other optional parameters")]),y]),n("li",null,[n("p",null,[s("launch load testing using script "),n("a",_,[s("curl-ntf.sh"),e(t)]),s(", which takes following optional parameters")]),x,w])]),M,n("p",null,[s("According to "),n("a",S,[s("Baseline Performance for SMTP"),e(t)]),s(" published on Microsoft Technet in 2005, Windows SMTP server has a max throughput of 142 emails/s. However this "),T,s(" load test yields a max throughput of 292 emails/s. The discrepancy may be attributed to following factors")]),P,B,n("ul",null,[C,n("li",null,[s("Enable SMTP "),n("a",A,[s("pooling"),e(t)]),s(".")]),N])])}const q=l(u,[["render",L],["__file","index.html.vue"]]);export{q as default};
