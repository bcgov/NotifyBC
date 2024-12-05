import{_ as n,o as s,c as a,e as t}from"./app-1fbf1053.js";const o={},e=t(`<h1 id="health-check" tabindex="-1"><a class="header-anchor" href="#health-check" aria-hidden="true">#</a> Health Check</h1><p>Health status of <em>NotifyBC</em> can be obtained by querying <code>/health</code> API end point. For example</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>$ curl -s http<span class="token operator">:</span><span class="token comment">//localhost:3000/api/health | jq</span>
<span class="token punctuation">{</span>
  <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;ok&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;info&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;MongoDB&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;up&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;config&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;up&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;count&quot;</span><span class="token operator">:</span> <span class="token number">2</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;redis&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;up&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;error&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;details&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;MongoDB&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;up&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;config&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;up&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;count&quot;</span><span class="token operator">:</span> <span class="token number">2</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;redis&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;up&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If overall health status is OK, the HTTP response code is 200, otherwise 503. The response payload shows status of following indicators and health criteria</p><ol><li>MongoDB - MongoDB must be reachable</li><li>config - There must be at least 2 items in MongoDB configuration collection</li><li>Redis - Redis must be reachable if configured</li></ol><p><code>/health</code> API end point is also reachable in <em>API Explorer</em> of <em>NotifyBC</em> web console.</p>`,6),p=[e];function c(l,i){return s(),a("div",null,p)}const r=n(o,[["render",c],["__file","index.html.vue"]]);export{r as default};
