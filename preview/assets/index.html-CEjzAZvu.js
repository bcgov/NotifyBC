import{_ as i,c as l,e as n,a,f as e,b as o,d as p,r,o as c}from"./app-D7Q0gFu3.js";const u={};function d(m,s){const t=r("RouteLink");return c(),l("div",null,[s[7]||(s[7]=n('<h1 id="benchmarks" tabindex="-1"><a class="header-anchor" href="#benchmarks"><span>Benchmarks</span></a></h1><div class="hint-container tip"><p class="hint-container-title">tl;dr</p><p>A <i>NotifyBC</i> server node can deliver 1 million emails in as little as 1 hour to a SMTP server node. SMTP server node&#39;s disk I/O is the bottleneck in such case. Throughput can be improved through horizontal scaling.</p></div><p>When <em>NotifyBC</em> is used to deliver broadcast push notifications to a large number of subscribers, probably the most important benchmark is throughput. The benchmark is especially critical if a latency cap is desired. To facilitate capacity planning, load testing on the email channel has been conducted. The test environment, procedure, results and performance tuning advices are provided hereafter.</p><h2 id="environment" tabindex="-1"><a class="header-anchor" href="#environment"><span>Environment</span></a></h2><h3 id="hardware" tabindex="-1"><a class="header-anchor" href="#hardware"><span>Hardware</span></a></h3><p>Two computers, connected by 1Gbps LAN, are used to host</p><ul><li><em>NotifyBC</em><ul><li>Mac Mini Late 2012 model</li><li>Intel core i7-3615QM</li><li>16GB RAM</li><li>2TB HDD</li></ul></li><li>SMTP and mail delivery <ul><li>Lenovo ThinkCentre M Series 2015 model</li><li>Intel core i5-3470</li><li>8GB RAM</li><li>256GB SSD</li></ul></li></ul><h3 id="software-stack" tabindex="-1"><a class="header-anchor" href="#software-stack"><span>Software Stack</span></a></h3><p>The test was performed in August 2017. Unless otherwise specified, the versions of all other software were reasonably up-to-date at the time of testing.</p><ul><li><p><em>NotifyBC</em></p><ul><li>MacOS Sierra Version 10.12.6</li><li>Virtualbox VM with 8vCPU, 10GB RAM, created using miniShift v1.3.1+f4900b07</li><li>OpenShift 1.5.1+7b451fc with metrics</li><li>default <em>NotifyBC</em> OpenShift installation, which contains following relevant pods <ul><li>1 mongodb pod with 1 core, 1GiB RAM limit</li><li>a variable number of Node.js app pods each with 1 core, 1GiB RAM limit. The number varies by test runs as indicated in result.</li></ul></li></ul></li><li><p>SMTP and mail delivery</p><ul><li>Windows 7 host</li><li>Virtualbox VM with 4 vCPU, 3.5GB RAM, running Windows Server 2012</li><li>added SMTP Server feature</li><li>in SMTP Server properties dialog box, uncheck all of following boxes in <em>Messages</em> tab <ul><li>Limit message size to (KB)</li><li>Limit session size to (KB)</li><li>Limit number of messages per connection to</li><li>Limit number of recipients per message to</li></ul></li></ul></li></ul><h2 id="procedure" tabindex="-1"><a class="header-anchor" href="#procedure"><span>Procedure</span></a></h2>',11)),a("ol",null,[a("li",null,[a("p",null,[s[1]||(s[1]=e("update or create file ")),s[2]||(s[2]=a("em",null,"/src/config.local.js",-1)),s[3]||(s[3]=e(" through ")),o(t,{to:"/docs/installation/#update-configuration-files"},{default:p(()=>s[0]||(s[0]=[e("configMap")])),_:1}),s[4]||(s[4]=e(". Add sections for SMTP server and a custom filter function"))]),s[5]||(s[5]=n(`<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line"><span class="token keyword">var</span> _ <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;lodash&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">smtp</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;&lt;smtp-vm-ip-or-hostname&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">secure</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">pool</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">direct</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">maxMessages</span><span class="token operator">:</span> <span class="token number">Infinity</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">maxConnections</span><span class="token operator">:</span> <span class="token number">50</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">notification</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">broadcastCustomFilterFunctions</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">/*jshint camelcase: false */</span></span>
<span class="line">      <span class="token literal-property property">contains_ci</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function-variable function">_func</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolvedArgs</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token operator">!</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">return</span> <span class="token punctuation">(</span></span>
<span class="line">            _<span class="token punctuation">.</span><span class="token function">toLower</span><span class="token punctuation">(</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>_<span class="token punctuation">.</span><span class="token function">toLower</span><span class="token punctuation">(</span>resolvedArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span></span>
<span class="line">            <span class="token number">0</span></span>
<span class="line">          <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">_signature</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">          <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">types</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">{</span></span>
<span class="line">            <span class="token literal-property property">types</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1))]),s[6]||(s[6]=n(`<li><p>create a number of subscriptions in bulk using script <a href="https://github.com/bcgov/NotifyBC/blob/main/src/utils/load-testing/bulk-post-subs.ts" target="_blank" rel="noopener noreferrer">bulk-post-subs.js</a>. To load test different email volumes, you can create bulk subscriptions in different services. For example, generate 10 subscriptions under service named <em>load10</em>; 1,000,000 subscriptions under service <em>load1000000</em> etc. <em>bulk-post-subs.js</em> takes <em>userChannelId</em> and other optional parameters</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">$ <span class="token function">node</span> dist/utils/load-testing/bulk-post-subs.js <span class="token parameter variable">-h</span></span>
<span class="line">Usage: <span class="token function">node</span> bulk-post-subs.js <span class="token punctuation">[</span>Options<span class="token punctuation">]</span> <span class="token operator">&lt;</span>userChannelId<span class="token operator">&gt;</span></span>
<span class="line"><span class="token punctuation">[</span>Options<span class="token punctuation">]</span>:</span>
<span class="line">-a, --api-url-prefix<span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>                      api url prefix. default to http://localhost:3000/api</span>
<span class="line">-c, <span class="token parameter variable">--channel</span><span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>                             channel. default to email</span>
<span class="line">-s, --service-name<span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>                        <span class="token function">service</span> name. default to load</span>
<span class="line">-n, --number-of-subscribers<span class="token operator">=</span><span class="token operator">&lt;</span>int<span class="token operator">&gt;</span>                  number of subscribers. positive integer. default to <span class="token number">1000</span></span>
<span class="line">-f, --broadcast-push-notification-filter<span class="token operator">=</span><span class="token operator">&lt;</span>string<span class="token operator">&gt;</span>  broadcast push notification filter. default to <span class="token string">&quot;contains_ci(title,&#39;vancouver&#39;) || contains_ci(title,&#39;victoria&#39;)&quot;</span></span>
<span class="line">-h, <span class="token parameter variable">--help</span>                                         display this <span class="token builtin class-name">help</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The generated subscriptions contain a filter, hence all load testing results below included time spent on filtering.</p></li><li><p>launch load testing using script <a href="https://github.com/bcgov/NotifyBC/blob/main/src/utils/load-testing/curl-ntf.sh" target="_blank" rel="noopener noreferrer">curl-ntf.sh</a>, which takes following optional parameters</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">dist/utils/load-testing/curl-ntf.sh &lt;apiUrlPrefix&gt; &lt;serviceName&gt; &lt;senderEmail&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>The script will print start time and the time taken to dispatch the notification.</p></li>`,2))]),s[8]||(s[8]=n('<h2 id="results" tabindex="-1"><a class="header-anchor" href="#results"><span>Results</span></a></h2><table><thead><tr><th style="text-align:right;">email count</th><th style="text-align:right;">time taken (min)</th><th style="text-align:right;">throughput (#/min)</th><th style="text-align:right;">app pod count</th><th>notes on bottleneck</th></tr></thead><tbody><tr><td style="text-align:right;">1,000,000</td><td style="text-align:right;">71.5</td><td style="text-align:right;">13,986</td><td style="text-align:right;">1</td><td>app pod cpu capped</td></tr><tr><td style="text-align:right;">100,000</td><td style="text-align:right;">5.8</td><td style="text-align:right;">17,241</td><td style="text-align:right;">2</td><td>smtp vm disk queue length hits 1 frequently</td></tr><tr><td style="text-align:right;">1,000,000</td><td style="text-align:right;">57</td><td style="text-align:right;">17,544</td><td style="text-align:right;">2</td><td>smtp vm disk queue length hits 1 frequently</td></tr><tr><td style="text-align:right;">1,000,000</td><td style="text-align:right;">57.8</td><td style="text-align:right;">17,301</td><td style="text-align:right;">3</td><td>smtp vm disk queue length hits 1 frequently</td></tr></tbody></table><p>Test runs using other software or configurations described below have also been conducted. Because throughput is significantly lower, results are not shown</p><ul><li>using Linux sendmail SMTP. The throughput of a 4-vCPU Linux VM is about the same as a 1-vCPU Windows SMTP server. Bottleneck in such case is the CPU of SMTP server.</li><li>Reducing <em>NotifyBC</em> app pod&#39;s resource limit to 100 millicore CPU and 512MiB RAM. Even when scaled up pod count to 15, throughput is still about 1/3 of a 1-core pod.</li></ul><p><a href="../../attachments/benchmark-email.txt">Here</a> is a sample email saved onto the mail drop folder of SMTP server.</p><h3 id="comparison-to-other-benchmarks" tabindex="-1"><a class="header-anchor" href="#comparison-to-other-benchmarks"><span>Comparison to Other Benchmarks</span></a></h3><p>According to <a href="https://technet.microsoft.com/en-us/library/bb124213(v=exchg.65).aspx" target="_blank" rel="noopener noreferrer">Baseline Performance for SMTP</a> published on Microsoft Technet in 2005, Windows SMTP server has a max throughput of 142 emails/s. However this <em>NotifyBC</em> load test yields a max throughput of 292 emails/s. The discrepancy may be attributed to following factors</p><ol><li>Email size in Microsoft&#39;s load test is 50k, as opposed to 1k used in this test</li><li>SSD storage is used in this test. It is unlikely the test conducted in 2005 used SSD.</li></ol><h2 id="advices" tabindex="-1"><a class="header-anchor" href="#advices"><span>Advices</span></a></h2><ul><li>Avoid using default direct mode in production. Instead use SMTP server. Direct mode doesn&#39;t support connection pooling, resulting in port depletion quickly.</li><li>Enable SMTP <a href="https://nodemailer.com/smtp/pooled/" target="_blank" rel="noopener noreferrer">pooling</a>.</li><li>Set smtp config <em>maxConnections</em> to a number big enough as long as SMTP server can handle. Test found for Windows SMTP server 50 is a suitable number, beyond which performance gain is insignificant.</li><li>Set smtp config <em>maxMessages</em> to maximum possible number allowed by your SMTP server, or <em>Infinity</em> if SMTP server imposes no such constraint</li><li>Avoid setting CPU resource limit too low for <em>NotifyBC</em> app pods.</li><li>If you have control over the SMTP server, <ul><li>use SSD for its storage</li><li>create a load balanced cluster if possible, since SMTP server is more likely to be the bottleneck.</li></ul></li></ul>',10))])}const k=i(u,[["render",d],["__file","index.html.vue"]]),v=JSON.parse('{"path":"/docs/benchmarks/","title":"Benchmarks","lang":"en-US","frontmatter":{"permalink":"/docs/benchmarks/","prev":"/docs/api-bounce/"},"headers":[{"level":2,"title":"Environment","slug":"environment","link":"#environment","children":[{"level":3,"title":"Hardware","slug":"hardware","link":"#hardware","children":[]},{"level":3,"title":"Software Stack","slug":"software-stack","link":"#software-stack","children":[]}]},{"level":2,"title":"Procedure","slug":"procedure","link":"#procedure","children":[]},{"level":2,"title":"Results","slug":"results","link":"#results","children":[{"level":3,"title":"Comparison to Other Benchmarks","slug":"comparison-to-other-benchmarks","link":"#comparison-to-other-benchmarks","children":[]}]},{"level":2,"title":"Advices","slug":"advices","link":"#advices","children":[]}],"git":{},"filePathRelative":"docs/miscellaneous/benchmarks.md"}');export{k as comp,v as data};
