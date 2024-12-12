import{_ as a,r as o,o as t,c as p,a as e,b as n,d as r,e as c}from"./app-b1f003eb.js";const l={},i=c(`<h1 id="database" tabindex="-1"><a class="header-anchor" href="#database" aria-hidden="true">#</a> Database</h1><p>By default <em>NotifyBC</em> uses in-memory database backed up by folder <em>/server/database/</em> for local and docker deployment and MongoDB for Kubernetes deployment. To use MongoDB for non-Kubernetes deployment, add file <em>/src/datasources/db.datasource.(local|&lt;env&gt;).(json|js|ts)</em> with MongoDB connection information such as following:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">uri</span><span class="token operator">:</span> <span class="token string">&#39;mongodb://127.0.0.1:27017/notifyBC?replicaSet=rs0&#39;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">user</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">MONGODB_USER</span><span class="token punctuation">,</span>
  <span class="token literal-property property">pass</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">MONGODB_PASSWORD</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),d={href:"https://mongoosejs.com/docs/connections.html#options",target:"_blank",rel:"noopener noreferrer"};function u(m,k){const s=o("ExternalLinkIcon");return t(),p("div",null,[i,e("p",null,[n("See "),e("a",d,[n("Mongoose connection options"),r(s)]),n(" for more configurable properties.")])])}const b=a(l,[["render",u],["__file","index.html.vue"]]);export{b as default};