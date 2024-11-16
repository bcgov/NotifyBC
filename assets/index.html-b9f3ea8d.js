import{_ as c,r as t,o as l,c as p,a as e,d as s,w as i,b as a,e as r}from"./app-be471a62.js";const m={},d=r(`<h1 id="tls-certificates" tabindex="-1"><a class="header-anchor" href="#tls-certificates" aria-hidden="true">#</a> TLS Certificates</h1><p><em>NotifyBC</em> supports HTTPS TLS to achieve end-to-end encryption. In addition, both server and client can be authenticated using certificates.</p><p>To enable HTTPS for server authentication only, you need to create two files</p><ul><li><em>server/certs/key.pem</em> - a PEM encoded private key</li><li><em>server/certs/cert.pem</em> - a PEM encoded X.509 certificate chain</li></ul><div class="custom-container tip"><p class="custom-container-title">Use ConfigMaps on Kubernetes</p><p>Create <em>key.pem</em> and <em>cert.pem</em> as items in ConfigMap <em>notify-bc</em>, then mount the items under <em>/home/node/app/server/certs</em> similar to how <em>config.local.js</em> and <em>middleware.local.js</em> are implemented.</p></div><p>For self-signed certificate, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>openssl req <span class="token parameter variable">-x509</span> <span class="token parameter variable">-newkey</span> rsa:4096 <span class="token parameter variable">-keyout</span> server/certs/key.pem <span class="token parameter variable">-out</span> server/certs/cert.pem <span class="token parameter variable">-nodes</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-subj</span> <span class="token string">&quot;/CN=NotifyBC&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>to generate both files in one shot.</p><div class="custom-container danger"><p class="custom-container-title">Caution about self-signed cert</p><p>Self-signed cert is intended to be used in non-production environments only to authenticate server. In such environments to allow <em>NotifyBC</em> connecting to itself, environment variable NODE_TLS_REJECT_UNAUTHORIZED must be set to 0.</p></div><p>To create a CSR from the private key generated above, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> server/certs/key.pem <span class="token parameter variable">-out</span> server/certs/csr.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Then bring your CSR to your CA to sign. Replace <em>server/certs/cert.pem</em> with the cert signed by CA. If your CA also supplied intermediate certificate in PEM encoded format, say in a file called <em>intermediate.pem</em>, append all of the content of <em>intermediate.pem</em> to file <em>server/certs/cert.pem</em>.</p><div class="custom-container warning"><p class="custom-container-title">Make a copy of self-signed server/certs/cert.pem</p><p>If you want to enable <a href="#client-certificate-authentication">client certificate authentication</a> documented below, make sure to copy self-signed <em>server/certs/cert.pem</em> to <em>server/certs/ca.pem</em> before replacing the file with the cert signed by CA. You need the self-signed <em>server/certs/cert.pem</em> to sign client CSR.</p></div><p>In case you created <em>server/certs/key.pem</em> and <em>server/certs/cert.pem</em> but don&#39;t want to enable HTTPS, create following config in <em>src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">tls</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),u={class:"custom-container warning"},v=e("p",{class:"custom-container-title"},"Update URL configs after enabling HTTPS",-1),h=e("p",null,"Make sure to update the protocol of following URL configs after enabling HTTPS",-1),b=r(`<h2 id="client-certificate-authentication" tabindex="-1"><a class="header-anchor" href="#client-certificate-authentication" aria-hidden="true">#</a> Client certificate authentication</h2><p>After enabling HTTPS, you can further configure such that a client request can be authenticated using client certificate. To do so, copy self-signed <em>server/certs/cert.pem</em> to <em>server/certs/ca.pem</em>. You will use your server key to sign client certificate CSR, and advertise <em>server/certs/ca.pem</em> as acceptable CAs during TLS handshake.</p><p>Assuming a client&#39;s CSR file is named <em>myClientApp_csr.pem</em>, to sign the CSR</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-in</span> myClientApp_csr.pem <span class="token parameter variable">-CA</span> server/certs/ca.pem <span class="token parameter variable">-CAkey</span> server/certs/key.pem <span class="token parameter variable">-out</span> myClientApp_cert.pem <span class="token parameter variable">-set_serial</span> 01 <span class="token parameter variable">-days</span> <span class="token number">365</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Then give <em>myClientApp_cert.pem</em> to the client. How a client app supplies the client certificate when making a request to <em>NotifyBC</em> varies by client type. Usually the client first needs to bundle the signed client cert and client key into PKCS#12 format</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>openssl pkcs12 <span class="token parameter variable">-export</span> <span class="token parameter variable">-clcerts</span> <span class="token parameter variable">-in</span> myClientApp_cert.pem <span class="token parameter variable">-inkey</span> myClientApp_key.pem <span class="token parameter variable">-out</span> myClientApp.p12
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>To use <em>myClientApp.p12</em>, for cURL,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">--insecure</span> <span class="token parameter variable">--cert</span> myClientApp.p12 --cert-type p12 https://localhost:3000/api/administrators/whoami
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>For browsers, check browser&#39;s instruction how to import <em>myClientApp.p12</em>. When browser accessing <em>NotifyBC</em> API endpoints such as <em>https://localhost:3000/api/administrators/whoami</em>, the browser will prompt to choose from a list certificates that are signed by the server certificate.</p><p>In case you created <em>server/certs/ca.pem</em> but don&#39;t want to enable client certificate authentication, create following config in <em>src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">tls</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">clientCertificateEnabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11),f={class:"custom-container warning"},k=e("p",{class:"custom-container-title"},"TLS termination has to be passthrough",-1),g=e("em",null,"NotifyBC",-1),y={href:"https://github.com/bcgov/NotifyBC/blob/main/helm/values.yaml#L140",target:"_blank",rel:"noopener noreferrer"},_=e("em",null,"edge",-1),C=e("em",null,"passthrough",-1),w=e("div",{class:"custom-container tip"},[e("p",{class:"custom-container-title"},[e("i",null,"NotifyBC"),a(" internal request does not use client certificate")]),e("p",null,[a("Requests sent by a "),e("em",null,"NotifyBC"),a(" node back to the app cluster use admin ip list authentication.")])],-1);function T(x,S){const n=t("RouterLink"),o=t("ExternalLinkIcon");return l(),p("div",null,[d,e("div",u,[v,h,e("ul",null,[e("li",null,[s(n,{to:"/docs/config/httpHost.html"},{default:i(()=>[a("httpHost")]),_:1})]),e("li",null,[s(n,{to:"/docs/config/internalHttpHost.html"},{default:i(()=>[a("internalHttpHost")]),_:1})])])]),b,e("div",f,[k,e("p",null,[a("For client certification authentication to work, TLS termination of all reverse proxies has to be set to passthrough rather than offload and reload. This means, for example, when "),g,a(" is hosted on OpenShift, router "),e("a",y,[a("tls termination"),s(o)]),a(" has to be changed from "),_,a(" to "),C,a(".")])]),w])}const N=c(m,[["render",T],["__file","index.html.vue"]]);export{N as default};