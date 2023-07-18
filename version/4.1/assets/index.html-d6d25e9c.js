import{_ as e,o as t,c as s,e as n}from"./app-eadb06ad.js";const a={},o=n(`<h1 id="http-host" tabindex="-1"><a class="header-anchor" href="#http-host" aria-hidden="true">#</a> HTTP Host</h1><p><em>httpHost</em> config sets the fallback http host used by</p><ul><li>mail merge token substitution</li><li>internal HTTP requests spawned by <em>NotifyBC</em></li></ul><p><em>httpHost</em> can be overridden by other configs or data. For example</p><ul><li><em>internalHttpHost</em> config</li><li><em>httpHost</em> field in a notification</li></ul><p>There are contexts where there is no alternatives to <em>httpHost</em>. Therefore this config should be defined.</p><p>Define the config, which has no default value, in <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">httpHost</span><span class="token operator">:</span> <span class="token string">&#39;http://foo.com&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),i=[o];function l(p,c){return t(),s("div",null,i)}const d=e(a,[["render",l],["__file","index.html.vue"]]);export{d as default};
