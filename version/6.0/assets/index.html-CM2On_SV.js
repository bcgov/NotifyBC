import{_ as s,c as n,e as t,o as a}from"./app-DtRsNr8j.js";const i={};function r(o,e){return a(),n("div",null,e[0]||(e[0]=[t(`<h1 id="reverse-proxy-ip-lists" tabindex="-1"><a class="header-anchor" href="#reverse-proxy-ip-lists"><span>Reverse Proxy IP Lists</span></a></h1><p>SiteMinder, being a gateway approached SSO solution, expects the backend HTTP access point of the web sites it protests to be firewall restricted, otherwise the SiteMinder injected HTTP headers can be easily spoofed. However, the restriction cannot be easily implemented on PAAS such as OpenShift. To mitigate, two configuration objects are introduced to create an application-level firewall, both are arrays of ip addresses in the format of <a href="https://en.wikipedia.org/wiki/Dot-decimal_notation" target="_blank" rel="noopener noreferrer">dot-decimal</a> or <a href="https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation" target="_blank" rel="noopener noreferrer">CIDR</a> notation</p><ul><li><em>siteMinderReverseProxyIps</em> contains a list of ips or ranges of SiteMinder Web Agents. If set, then the SiteMinder HTTP headers are trusted only if the request is routed from the listed nodes.</li><li><em>trustedReverseProxyIps</em> contains a list of ips or ranges of trusted reverse proxies. If <em>NotifyBC</em> is placed behind SiteMinder Web Agents, then trusted reverse proxies should include only those between SiteMinder Web Agents and <em>NotifyBC</em> application. When running on OpenShift, this is usually the OpenShift router. Express.js <a href="https://expressjs.com/en/guide/behind-proxies.html" target="_blank" rel="noopener noreferrer">trust proxy</a> is set to this config object.</li></ul><p>By default <em>trustedReverseProxyIps</em> is empty and <em>siteMinderReverseProxyIps</em> contains only localhost as defined in <em>/src/config.ts</em></p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts" data-title="ts"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  siteMinderReverseProxyIps<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To modify, add following objects to file /src/config.local.js</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">siteMinderReverseProxyIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;130.32.12.0&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">trustedReverseProxyIps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;172.17.0.0/16&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The rule to determine if the incoming request is authenticated by SiteMinder is</p><ol><li>obtain the real client ip address by filtering out trusted proxy ips according to <a href="https://expressjs.com/en/guide/behind-proxies.html" target="_blank" rel="noopener noreferrer">Express behind proxies</a></li><li>if the real client ip is contained in <em>siteMinderReverseProxyIps</em>, then the request is from SiteMinder, and its SiteMinder headers are trusted; otherwise, the request is considered as directly from internet, and its SiteMinder headers are ignored.</li></ol>`,9)]))}const l=s(i,[["render",r],["__file","index.html.vue"]]),c=JSON.parse('{"path":"/docs/config-reverseProxyIpLists/","title":"Reverse Proxy IP Lists","lang":"en-US","frontmatter":{"permalink":"/docs/config-reverseProxyIpLists/"},"headers":[],"git":{},"filePathRelative":"docs/config/reverseProxyIpLists.md"}');export{l as comp,c as data};
