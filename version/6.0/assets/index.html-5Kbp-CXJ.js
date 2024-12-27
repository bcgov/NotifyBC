import{_ as t,c as l,a as s,f as e,b as o,d as i,e as p,r,o as c}from"./app-vBJoMoyQ.js";const g={};function d(u,n){const a=r("RouteLink");return c(),l("div",null,[n[5]||(n[5]=s("h1",{id:"logging",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#logging"},[s("span",null,"Logging")])],-1)),s("p",null,[n[1]||(n[1]=e("Besides request logging using morgan ")),o(a,{to:"/docs/config/middleware.html"},{default:i(()=>n[0]||(n[0]=[e("middleware")])),_:1}),n[2]||(n[2]=e(", ")),n[3]||(n[3]=s("em",null,"NotifyBC",-1)),n[4]||(n[4]=e(" also generates application log. Application log has following levels in descending severities"))]),n[6]||(n[6]=p(`<ol><li>fatal</li><li>error</li><li>warn</li><li>log</li><li>debug</li><li>verbose</li></ol><p>By default the first 4 logging levels are output to console. To override the defaults, set the <code>loggingLevels</code> config in <em>src/config.local.js</em>. For example, to include debug logs</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// ...</span></span>
<span class="line">  <span class="token literal-property property">loggingLevels</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;fatal&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;error&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;warn&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;log&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;debug&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3))])}const v=t(g,[["render",d],["__file","index.html.vue"]]),k=JSON.parse('{"path":"/docs/config-logging/","title":"Logging","lang":"en-US","frontmatter":{"permalink":"/docs/config-logging/","next":"/docs/api-overview/"},"headers":[],"git":{},"filePathRelative":"docs/config/logging.md"}');export{v as comp,k as data};