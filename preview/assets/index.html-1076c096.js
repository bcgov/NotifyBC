import{_ as t,r as p,o,c as l,a as n,b as s,d as e,e as c}from"./app-344b7e52.js";const i={},r=n("h1",{id:"middleware",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#middleware","aria-hidden":"true"},"#"),s(" Middleware")],-1),u=n("em",null,"NotifyBC",-1),d={href:"https://expressjs.com/",target:"_blank",rel:"noopener noreferrer"},k=n("em",null,"/src/middleware.ts",-1),m={href:"https://www.npmjs.com/package/serve-favicon",target:"_blank",rel:"noopener noreferrer"},v={href:"https://www.npmjs.com/package/compression",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.npmjs.com/package/helmet",target:"_blank",rel:"noopener noreferrer"},g={href:"https://www.npmjs.com/package/morgan",target:"_blank",rel:"noopener noreferrer"},h=c(`<p><em>/src/middleware.ts</em> contains following default middleware settings</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  all<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&#39;serve-favicon&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>params<span class="token operator">:</span> <span class="token punctuation">[</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&#39;..&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;favicon.ico&#39;</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    compression<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    helmet<span class="token operator">:</span> <span class="token punctuation">{</span>
      params<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          hsts<span class="token operator">:</span> <span class="token punctuation">{</span>
            maxAge<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  apiOnly<span class="token operator">:</span> <span class="token punctuation">{</span>
    morgan<span class="token operator">:</span> <span class="token punctuation">{</span>
      params<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">&#39;:remote-addr - :remote-user [:date[clf]] &quot;:method :url HTTP/:http-version&quot; :status &quot;:req[X-Forwarded-For]&quot;&#39;</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      enabled<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>/src/middleware.ts</em> has following structure</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  all<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&#39;&lt;middlewareName&gt;&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>params<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  apiOnly<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">&#39;&lt;middlewareName&gt;&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>params<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Middleware defined under <em>all</em> applies to both API and web console requests, as opposed to <em>apiOnly</em>, which applies to API requests only. <em>params</em> are passed to middleware function as arguments. <em>enabled</em> toggles the middleware on or off.</p><p>To change default settings defined in <em>/src/middleware.ts</em>, create file <em>/src/middleware.local.ts</em> or <em>/src/middleware.&lt;env&gt;.ts</em> to override. For example, to enable access log,</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  apiOnly<span class="token operator">:</span> <span class="token punctuation">{</span>
    morgan<span class="token operator">:</span> <span class="token punctuation">{</span>
      enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7);function f(_,w){const a=p("ExternalLinkIcon");return o(),l("div",null,[r,n("p",null,[u,s(" pre-installed following "),n("a",d,[s("Express"),e(a)]),s(" middleware as defined in "),k]),n("ul",null,[n("li",null,[n("a",m,[s("serve-favicon"),e(a)])]),n("li",null,[n("a",v,[s("compression"),e(a)])]),n("li",null,[n("a",b,[s("helmet"),e(a)])]),n("li",null,[n("a",g,[s("morgan"),e(a)]),s(" (disabled by default)")])]),h])}const x=t(i,[["render",f],["__file","index.html.vue"]]);export{x as default};
