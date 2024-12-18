import{_ as l,c as p,e as n,a,b as t,d as i,r as o,o as c,f as r}from"./app-DtRsNr8j.js";const m={},d={class:"hint-container warning"};function u(h,e){const s=o("RouteLink");return c(),p("div",null,[e[4]||(e[4]=n(`<h1 id="tls-certificates" tabindex="-1"><a class="header-anchor" href="#tls-certificates"><span>TLS Certificates</span></a></h1><p><em>NotifyBC</em> supports HTTPS TLS to achieve end-to-end encryption. In addition, both server and client can be authenticated using certificates.</p><p>To enable HTTPS for server authentication only, you need to create two files</p><ul><li><em>server/certs/key.pem</em> - a PEM encoded private key</li><li><em>server/certs/cert.pem</em> - a PEM encoded X.509 certificate chain</li></ul><div class="hint-container tip"><p class="hint-container-title">Use ConfigMaps on Kubernetes</p><p>Create <em>key.pem</em> and <em>cert.pem</em> as items in ConfigMap <em>notify-bc</em>, then mount the items under <em>/home/node/app/server/certs</em> similar to how <em>config.local.js</em> and <em>middleware.local.js</em> are implemented.</p></div><p>For self-signed certificate, run</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">openssl req <span class="token parameter variable">-x509</span> <span class="token parameter variable">-newkey</span> rsa:4096 <span class="token parameter variable">-keyout</span> server/certs/key.pem <span class="token parameter variable">-out</span> server/certs/cert.pem <span class="token parameter variable">-nodes</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-subj</span> <span class="token string">&quot;/CN=NotifyBC&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>to generate both files in one shot.</p><div class="hint-container caution"><p class="hint-container-title">Caution about self-signed cert</p><p>Self-signed cert is intended to be used in non-production environments only to authenticate server. In such environments to allow <em>NotifyBC</em> connecting to itself, environment variable NODE_TLS_REJECT_UNAUTHORIZED must be set to 0.</p></div><p>To create a CSR from the private key generated above, run</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> server/certs/key.pem <span class="token parameter variable">-out</span> server/certs/csr.pem</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Then bring your CSR to your CA to sign. Replace <em>server/certs/cert.pem</em> with the cert signed by CA. If your CA also supplied intermediate certificate in PEM encoded format, say in a file called <em>intermediate.pem</em>, append all of the content of <em>intermediate.pem</em> to file <em>server/certs/cert.pem</em>.</p><div class="hint-container warning"><p class="hint-container-title">Make a copy of self-signed server/certs/cert.pem</p><p>If you want to enable <a href="#client-certificate-authentication">client certificate authentication</a> documented below, make sure to copy self-signed <em>server/certs/cert.pem</em> to <em>server/certs/ca.pem</em> before replacing the file with the cert signed by CA. You need the self-signed <em>server/certs/cert.pem</em> to sign client CSR.</p></div><p>In case you created <em>server/certs/key.pem</em> and <em>server/certs/cert.pem</em> but don&#39;t want to enable HTTPS, create following config in <em>src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">tls</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15)),a("div",d,[e[2]||(e[2]=a("p",{class:"hint-container-title"},"Update URL configs after enabling HTTPS",-1)),e[3]||(e[3]=a("p",null,"Make sure to update the protocol of following URL configs after enabling HTTPS",-1)),a("ul",null,[a("li",null,[t(s,{to:"/docs/config/httpHost.html"},{default:i(()=>e[0]||(e[0]=[r("httpHost")])),_:1})]),a("li",null,[t(s,{to:"/docs/config/internalHttpHost.html"},{default:i(()=>e[1]||(e[1]=[r("internalHttpHost")])),_:1})])])]),e[5]||(e[5]=n(`<h2 id="client-certificate-authentication" tabindex="-1"><a class="header-anchor" href="#client-certificate-authentication"><span>Client certificate authentication</span></a></h2><p>After enabling HTTPS, you can further configure such that a client request can be authenticated using client certificate. To do so, copy self-signed <em>server/certs/cert.pem</em> to <em>server/certs/ca.pem</em>. You will use your server key to sign client certificate CSR, and advertise <em>server/certs/ca.pem</em> as acceptable CAs during TLS handshake.</p><p>Assuming a client&#39;s CSR file is named <em>myClientApp_csr.pem</em>, to sign the CSR</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-in</span> myClientApp_csr.pem <span class="token parameter variable">-CA</span> server/certs/ca.pem <span class="token parameter variable">-CAkey</span> server/certs/key.pem <span class="token parameter variable">-out</span> myClientApp_cert.pem <span class="token parameter variable">-set_serial</span> 01 <span class="token parameter variable">-days</span> <span class="token number">365</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Then give <em>myClientApp_cert.pem</em> to the client. How a client app supplies the client certificate when making a request to <em>NotifyBC</em> varies by client type. Usually the client first needs to bundle the signed client cert and client key into PKCS#12 format</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">openssl pkcs12 <span class="token parameter variable">-export</span> <span class="token parameter variable">-clcerts</span> <span class="token parameter variable">-in</span> myClientApp_cert.pem <span class="token parameter variable">-inkey</span> myClientApp_key.pem <span class="token parameter variable">-out</span> myClientApp.p12</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>To use <em>myClientApp.p12</em>, for cURL,</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">--insecure</span> <span class="token parameter variable">--cert</span> myClientApp.p12 --cert-type p12 https://localhost:3000/api/administrators/whoami</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>For browsers, check browser&#39;s instruction how to import <em>myClientApp.p12</em>. When browser accessing <em>NotifyBC</em> API endpoints such as <em>https://localhost:3000/api/administrators/whoami</em>, the browser will prompt to choose from a list certificates that are signed by the server certificate.</p><p>In case you created <em>server/certs/ca.pem</em> but don&#39;t want to enable client certificate authentication, create following config in <em>src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">tls</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">clientCertificateEnabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">TLS termination has to be passthrough</p><p>For client certification authentication to work, TLS termination of all reverse proxies has to be set to passthrough rather than offload and reload. This means, for example, when <em>NotifyBC</em> is hosted on OpenShift, router <a href="https://github.com/bcgov/NotifyBC/blob/main/helm/values.yaml#L140" target="_blank" rel="noopener noreferrer">tls termination</a> has to be changed from <em>edge</em> to <em>passthrough</em>.</p></div><div class="hint-container tip"><p class="hint-container-title"><i>NotifyBC</i> internal request does not use client certificate</p><p>Requests sent by a <em>NotifyBC</em> node back to the app cluster use admin ip list authentication.</p></div>`,13))])}const b=l(m,[["render",u],["__file","index.html.vue"]]),f=JSON.parse('{"path":"/docs/config-certificates/","title":"TLS Certificates","lang":"en-US","frontmatter":{"permalink":"/docs/config-certificates/"},"headers":[{"level":2,"title":"Client certificate authentication","slug":"client-certificate-authentication","link":"#client-certificate-authentication","children":[]}],"git":{},"filePathRelative":"docs/config/certificates.md"}');export{b as comp,f as data};
