import{_ as s,c as a,e,o as t}from"./app-D7Q0gFu3.js";const o={};function p(r,n){return t(),a("div",null,n[0]||(n[0]=[e(`<h1 id="database" tabindex="-1"><a class="header-anchor" href="#database"><span>Database</span></a></h1><p>By default <em>NotifyBC</em> uses in-memory database backed up by folder <em>/server/database/</em> for local and docker deployment and MongoDB for Kubernetes deployment. To use MongoDB for non-Kubernetes deployment, add file <em>/src/datasources/db.datasource.(local|&lt;env&gt;).(json|js|ts)</em> with MongoDB connection information such as following:</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">uri</span><span class="token operator">:</span> <span class="token string">&#39;mongodb://127.0.0.1:27017/notifyBC?replicaSet=rs0&#39;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">user</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">MONGODB_USER</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">pass</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">MONGODB_PASSWORD</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>See <a href="https://mongoosejs.com/docs/connections.html#options" target="_blank" rel="noopener noreferrer">Mongoose connection options</a> for more configurable properties.</p>`,4)]))}const l=s(o,[["render",p],["__file","index.html.vue"]]),i=JSON.parse('{"path":"/docs/config-database/","title":"Database","lang":"en-US","frontmatter":{"permalink":"/docs/config-database/"},"headers":[],"git":{},"filePathRelative":"docs/config/database.md"}');export{l as comp,i as data};
