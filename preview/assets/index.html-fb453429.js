import{_ as a,r as t,o as i,c as o,a as e,b as s,d as p,w as c,e as l}from"./app-0a962fc3.js";const r={},d=e("h1",{id:"admin-ip-list",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#admin-ip-list","aria-hidden":"true"},"#"),s(" Admin IP List")],-1),u=e("em",null,"NotifyBC",-1),m=e("em",null,"localhost",-1),h=e("em",null,"adminIps",-1),v=e("em",null,"/src/config.ts",-1),k=l(`<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  adminIps<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>to modify, create config object <em>adminIps</em> with updated list in file <em>/src/config.local.js</em> instead. For example, to add ip range <em>192.168.0.0/24</em> to the list</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">adminIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;192.168.0.0/24&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>It should be noted that <em>NotifyBC</em> may generate http requests sending to itself. These http requests are expected to be admin requests. If you have created an app cluster such as in Kubernetes, you should add the cluster ip range to <em>adminIps</em>. In Kubernetes, this ip range is a private ip range. For example, in BCGov&#39;s OpenShift cluster OCP4, the ip range starts with octet 10.</p>`,4);function _(f,g){const n=t("RouterLink");return i(),o("div",null,[d,e("p",null,[s("By "),p(n,{to:"/docs/overview/#architecture"},{default:c(()=>[s("design")]),_:1}),s(", "),u,s(" classifies incoming requests into four types. For a request to be classified as super-admin, the request's source ip must be in admin ip list. By default, the list contains "),m,s(" only as defined by "),h,s(" in "),v]),k])}const x=a(r,[["render",_],["__file","index.html.vue"]]);export{x as default};
