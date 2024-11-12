import{_ as a,r as i,o,c as r,a as e,b as s,d as t,e as p}from"./app-57f81094.js";const l={},c=e("h1",{id:"reverse-proxy-ip-lists",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#reverse-proxy-ip-lists","aria-hidden":"true"},"#"),s(" Reverse Proxy IP Lists")],-1),d={href:"https://en.wikipedia.org/wiki/Dot-decimal_notation",target:"_blank",rel:"noopener noreferrer"},u={href:"https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation",target:"_blank",rel:"noopener noreferrer"},h=e("li",null,[e("em",null,"siteMinderReverseProxyIps"),s(" contains a list of ips or ranges of SiteMinder Web Agents. If set, then the SiteMinder HTTP headers are trusted only if the request is routed from the listed nodes.")],-1),m=e("em",null,"trustedReverseProxyIps",-1),f=e("em",null,"NotifyBC",-1),_=e("em",null,"NotifyBC",-1),v={href:"https://expressjs.com/en/guide/behind-proxies.html",target:"_blank",rel:"noopener noreferrer"},k=p(`<p>By default <em>trustedReverseProxyIps</em> is empty and <em>siteMinderReverseProxyIps</em> contains only localhost as defined in <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  siteMinderReverseProxyIps<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To modify, add following objects to file /src/config.local.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">siteMinderReverseProxyIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;130.32.12.0&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">trustedReverseProxyIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;172.17.0.0/16&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The rule to determine if the incoming request is authenticated by SiteMinder is</p>`,5),b={href:"https://expressjs.com/en/guide/behind-proxies.html",target:"_blank",rel:"noopener noreferrer"},g=e("li",null,[s("if the real client ip is contained in "),e("em",null,"siteMinderReverseProxyIps"),s(", then the request is from SiteMinder, and its SiteMinder headers are trusted; otherwise, the request is considered as directly from internet, and its SiteMinder headers are ignored.")],-1);function x(y,S){const n=i("ExternalLinkIcon");return o(),r("div",null,[c,e("p",null,[s("SiteMinder, being a gateway approached SSO solution, expects the backend HTTP access point of the web sites it protests to be firewall restricted, otherwise the SiteMinder injected HTTP headers can be easily spoofed. However, the restriction cannot be easily implemented on PAAS such as OpenShift. To mitigate, two configuration objects are introduced to create an application-level firewall, both are arrays of ip addresses in the format of "),e("a",d,[s("dot-decimal"),t(n)]),s(" or "),e("a",u,[s("CIDR"),t(n)]),s(" notation")]),e("ul",null,[h,e("li",null,[m,s(" contains a list of ips or ranges of trusted reverse proxies. If "),f,s(" is placed behind SiteMinder Web Agents, then trusted reverse proxies should include only those between SiteMinder Web Agents and "),_,s(" application. When running on OpenShift, this is usually the OpenShift router. Express.js "),e("a",v,[s("trust proxy"),t(n)]),s(" is set to this config object.")])]),k,e("ol",null,[e("li",null,[s("obtain the real client ip address by filtering out trusted proxy ips according to "),e("a",b,[s("Express behind proxies"),t(n)])]),g])])}const M=a(l,[["render",x],["__file","index.html.vue"]]);export{M as default};
