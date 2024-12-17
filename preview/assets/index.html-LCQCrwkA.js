import{_ as r,c as p,a as s,f as n,b as i,d as o,e as a,r as c,o as u}from"./app-DW16th4c.js";const d={},m=["src"];function b(l,e){const t=c("RouteLink");return u(),p("div",null,[e[24]||(e[24]=s("h1",{id:"email",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#email"},[s("span",null,"Email")])],-1)),e[25]||(e[25]=s("h2",{id:"smtp",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#smtp"},[s("span",null,"SMTP")])],-1)),s("p",null,[e[1]||(e[1]=n("By default when no SMTP is specified, ")),e[2]||(e[2]=s("em",null,"NotifyBC",-1)),e[3]||(e[3]=n(" uses fake SMTP service ")),e[4]||(e[4]=s("a",{href:"https://ethereal.email/",target:"_blank",rel:"noopener noreferrer"},"Ethereal",-1)),e[5]||(e[5]=n(". Ethereal is only good for evaluation purpose as emails sent from ")),e[6]||(e[6]=s("em",null,"NotifyBC",-1)),e[7]||(e[7]=n(" are delivered to Ethereal rather than actual recipients. You can access the emails from Ethereal. ")),e[8]||(e[8]=s("em",null,"NotifyBC",-1)),e[9]||(e[9]=n(" automatically generates the Ethereal account first time and stores the account information in ")),i(t,{to:"/docs/api/config.html"},{default:o(()=>e[0]||(e[0]=[n("configuration")])),_:1}),e[10]||(e[10]=n(" under name ")),e[11]||(e[11]=s("em",null,"etherealAccount",-1)),e[12]||(e[12]=n(" accessible from ")),e[13]||(e[13]=s("em",null,"NotifyBC",-1)),e[14]||(e[14]=n(" web console."))]),e[26]||(e[26]=a(`<p>For production however, setting up SMTP is <strong>mandatory</strong>. To do so, add following <em>smtp</em> config to <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">//...</span></span>
<span class="line">  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">smtp</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;&lt;your smtp host FQDN&gt;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">pool</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">tls</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">rejectUnauthorized</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2)),s("p",null,[e[16]||(e[16]=n("Check out ")),e[17]||(e[17]=s("a",{href:"https://nodemailer.com/smtp/",target:"_blank",rel:"noopener noreferrer"},"Nodemailer",-1)),e[18]||(e[18]=n(" for other config options that you can define. Fine-tuning some options are critical for performance. See ")),i(t,{to:"/docs/benchmarks/#advices"},{default:o(()=>e[15]||(e[15]=[n("benchmark advices")])),_:1}),e[19]||(e[19]=n("."))]),e[27]||(e[27]=a(`<h2 id="throttle" tabindex="-1"><a class="header-anchor" href="#throttle"><span>Throttle</span></a></h2><p><em>NotifyBC</em> can throttle email requests if SMTP server imposes rate limit. To enable throttle and set rate limit, create following config in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">max</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">1000</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>enabled</em> - whether to enable throttle or not. Default to <em>false</em>.</li><li><em>max</em> - max numbers of requests per duration. Default to 4.</li><li><em>duration</em> - time span in ms. Default to 1000.</li></ul><p>Above config throttles email to 4/sec.</p><h2 id="inbound-smtp-server" tabindex="-1"><a class="header-anchor" href="#inbound-smtp-server"><span>Inbound SMTP Server</span></a></h2><p><em>NotifyBC</em> implemented an inbound SMTP server to handle</p><ul><li><a href="#bounce">bounce</a></li><li><a href="#list-unsubscribe-by-email">list-unsubscribe by email</a></li></ul><p>In order for the emails from internet to reach the SMTP server, a host where one of the following servers should be listening on port 25 open to internet</p><ol><li><em>NotifyBC</em>, if it can be installed on such internet-facing host directly; otherwise,</li><li>a tcp proxy server, such as nginx with stream proxy module that can proxy tcp port 25 traffic to backend <em>NotifyBC</em> instances.</li></ol><p>Regardless which above option is chosen, you need to config <em>NotifyBC</em> inbound SMTP server by adding following static config <em>email.inboundSmtpServer</em> to file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">inboundSmtpServer</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">domain</span><span class="token operator">:</span> <span class="token string">&#39;host.foo.com&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">listeningSmtpPort</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// ...</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>enabled</em> enables/disables the inbound SMTP server with default to <em>true</em>.</li><li><em>domain</em> is the internet-facing host domain. It has no default so <strong>must be set</strong>.</li><li><em>listeningSmtpPort</em> should be set to 25 if option 1 above is chosen. For options 2, <em>listeningSmtpPort</em> can be set to any opening port. On Unix, <em>NotifyBC</em> has to be run under <em>root</em> account to bind to port 25. If missing, <em>NotifyBC</em> will randomly select an available port upon launch which is usually undesirable so it <strong>should be set</strong>.</li><li>optional <em>options</em> object defines the behavior of <a href="https://nodemailer.com/extras/smtp-server/#step-3-create-smtpserver-instance" target="_blank" rel="noopener noreferrer">Nodemailer SMTP Server</a>.</li></ul><div class="hint-container warning"><p class="hint-container-title">Inbound SMTP Server on OpenShift</p><p>OpenShift deployment template deploys an inbound SMTP server. Due to the limitation that OpenShift can only expose port 80 and 443 to external, to use the SMTP server, you have to setup a TCP proxy server (i.e. option 2). The inbound SMTP server is exposed as \${INBOUND_SMTP_DOMAIN}:443 , where \${INBOUND_SMTP_DOMAIN} is a template parameter which in absence, a default domain will be created. Configure your TCP proxy server to route traffic to \${INBOUND_SMTP_DOMAIN}:443 over TLS.</p></div><h3 id="tcp-proxy-server" tabindex="-1"><a class="header-anchor" href="#tcp-proxy-server"><span>TCP Proxy Server</span></a></h3><p>If <em>NotifyBC</em> is not able to bind to port 25 that opens to internet, perhaps due to firewall restriction, you can setup a TCP Proxy Server such as Nginx with <a href="http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html" target="_blank" rel="noopener noreferrer">ngx_stream_proxy_module</a>. For example, the following nginx config will proxy SMTP traffic from port 25 to a <em>NotifyBC</em> inbound SMTP server running on OpenShift</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">stream {</span>
<span class="line">    server {</span>
<span class="line">        listen 25;</span>
<span class="line">        proxy_pass \${INBOUND_SMTP_DOMAIN}:443;</span>
<span class="line">        proxy_ssl on;</span>
<span class="line">        proxy_ssl_verify off;</span>
<span class="line">        proxy_ssl_server_name on;</span>
<span class="line">        proxy_connect_timeout 10s;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace <em>\${INBOUND_SMTP_DOMAIN}</em> with the inbound SMTP server route domain.</p><h2 id="bounce" tabindex="-1"><a class="header-anchor" href="#bounce"><span>Bounce</span></a></h2><p>Bounces, or Non-Delivery Reports (NDRs), are system-generated emails informing sender of failed delivery. <em>NotifyBC</em> can be configured to receive bounces, record bounces, and automatically unsubscribe all subscriptions of a recipient if the number of recorded hard bounces against the recipient exceeds threshold. A deemed successful notification delivery deletes the bounce record.</p><p>Although <em>NotifyBC</em> records all bounce emails, not all of them should count towards unsubscription threshold, but rather only the hard bounces - those which indicate permanent unrecoverable errors such as destination address no longer exists. In principle this can be distinguished using smtp response code. In practice, however, there are some challenges to make the distinction</p><ul><li>the smtp response code is not fully standardized and may vary by recipient&#39;s smtp server so it&#39;s unreliable</li><li>there is no standard smtp header in bounce email to contain smtp response code. Often the response code is embedded in bounce email body.</li><li>the bounce email template varies by sender&#39;s smtp server</li></ul><p>To mitigate, <em>NotifyBC</em> defines several customizable string pattern filters in terms of regular expression. Only bounce emails matched the filters count towards unsubscription threshold. It&#39;s a matter of trial-and-error to get the correct filter suitable to your smtp server.</p><div class="hint-container tip"><p class="hint-container-title">to improve hard bounce recognition</p><p>Send non-existing emails to several external email systems. Inspect the bounce messages for common string patterns. After gone live, review bounce records in web console from time to time to identify new bounce types and decide whether the bounce types qualify as hard bounce. To avoid false positives resulting in premature unsubscription, it is advisable to start with a high unsubscription threshold.</p></div><p>Bounce handling involves four actions</p><ul><li>during notification dispatching, envelop address is set to a <a href="https://en.wikipedia.org/wiki/Variable_envelope_return_path" target="_blank" rel="noopener noreferrer">VERP</a> in the form <em>bn-{subscriptionId}-{unsubscriptionCode}@{inboundSmtpServerDomain}</em> routed to <em>NotifyBC</em> inbound smtp server.</li><li>when a notification finished dispatching, the dispatching start and end time is recorded to all bounce records matching affects recipient addresses</li><li>when inbound smtp server receives a bounce message, it updates the bounce record by saving the message and incrementing the hard bounce count when the message matches the filter criteria. The filter criteria are regular expressions matched against bounce email subject and body, as well as regular expression to extract recipient&#39;s email address from bounce email body. It also unsubscribes the user from all subscriptions when the hard bounce count exceeds a predefined threshold.</li><li>A cron job runs periodically to delete bounce records if the latest notification is deemed delivered successfully.</li></ul><p>To setup bounce handling</p>`,29)),s("ul",null,[e[23]||(e[23]=a(`<li><p>set up <a href="#inbound-smtp-server">inbound smtp server</a></p></li><li><p>verify config <em>email.bounce.enabled</em> is set to true or absent in <em>/src/config.local.js</em></p></li><li><p>verify and adjust unsubscription threshold and bounce filter criteria if needed. Following is the default config in file <em>/src/config.ts</em> compatible with <a href="https://tools.ietf.org/html/rfc3464" target="_blank" rel="noopener noreferrer">rfc 3464</a></p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts" data-title="ts"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  email<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    bounce<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      unsubThreshold<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span></span>
<span class="line">      subjectRegex<span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      smtpStatusCodeRegex<span class="token operator">:</span> <span class="token string">&#39;5\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}&#39;</span><span class="token punctuation">,</span></span>
<span class="line">      failedRecipientRegex<span class="token operator">:</span></span>
<span class="line">        <span class="token string">&#39;(?:[a-z0-9!#$%&amp;\\&#39;*+/=?^_\`{|}~-]+(?:\\\\.[a-z0-9!#$%&amp;\\&#39;*+/=?^_\`{|}~-]+)*|&quot;(?:[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f]|\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f])*&quot;)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f]|\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f])+)\\\\])&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><p><em>unsubThreshold</em> is the threshold of hard bounce count above which the user is unsubscribed from all subscriptions</p></li><li><p><em>subjectRegex</em> is the regular expression that bounce message subject must match in order to count towards the threshold. If <em>subjectRegex</em> is set to empty string or <em>undefined</em>, then this filter is disabled.</p></li><li><p><em>smtpStatusCodeRegex</em> is the regular expression that smtp status code embedded in the message body must match in order to count towards the threshold. The default value matches all <a href="https://tools.ietf.org/html/rfc3463" target="_blank" rel="noopener noreferrer">rfc3463</a> class 5 status codes. For a multi-part bounce message, the body limits to the one of the following parts by content type in descending order</p><ul><li><em>message/delivery-status</em></li><li>html</li><li>plain text</li></ul></li><li><p><em>failedRecipientRegex</em> is the regular expression used to extract recipient&#39;s email address from bounce message body. This extracted recipient&#39;s email address is compared against the subscription record as a means of validation. If <em>failedRecipientRegex</em> is set to empty string or <em>undefined</em>, then this validation method is skipped. The default RegEx is taken from a <a href="https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression" target="_blank" rel="noopener noreferrer">stackoverflow answer</a>. For a multi-part bounce message, the body limits to the one of the following parts by content type in descending order</p><ul><li><em>message/delivery-status</em></li><li>html</li><li>plain text</li></ul></li></ul></li>`,3)),s("li",null,[s("p",null,[e[21]||(e[21]=n("Change config of cron job ")),i(t,{to:"/docs/config-cronJobs/#delete-notification-bounces"},{default:o(()=>e[20]||(e[20]=[n("Delete Notification Bounces")])),_:1}),e[22]||(e[22]=n(" if needed"))])])]),e[28]||(e[28]=s("h2",{id:"list-unsubscribe-by-email",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#list-unsubscribe-by-email"},[s("span",null,"List-unsubscribe by Email")])],-1)),e[29]||(e[29]=s("p",null,"Some email clients provide a consistent UI to unsubscribe if an unsubscription email address is supplied. For example, newer iOS built-in email app will display following banner",-1)),s("img",{src:l.$withBase("/img/list-unsubscription.png"),alt:"list unsubscription"},null,8,m),e[30]||(e[30]=a(`<p>To support this unsubscription method, <em>NotifyBC</em> implements a custom inbound SMTP server to transform received emails sent to address <em>un-{subscriptionId}-{unsubscriptionCode}@{inboundSmtpServerDomain}</em> to <em>NotifyBC</em> unsubscribing API calls. This unsubscription email address is generated by <em>NotifyBC</em> and set in header <em>List-Unsubscribe</em> of all notification emails.</p><p>To enable list-unsubscribe by email</p><ul><li>set up <a href="#inbound-smtp-server">inbound smtp server</a></li><li>verify config <em>email.listUnsubscribeByEmail.enabled</em> is set to true or absent in <em>/src/config.local.js</em></li></ul><p>To disable list-unsubscribe by email, set <em>email.listUnsubscribeByEmail.enabled</em> to <em>false</em> in <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">listUnsubscribeByEmail</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5))])}const h=r(d,[["render",b],["__file","index.html.vue"]]),f=JSON.parse('{"path":"/docs/config-email/","title":"Email","lang":"en-US","frontmatter":{"permalink":"/docs/config-email/"},"headers":[{"level":2,"title":"SMTP","slug":"smtp","link":"#smtp","children":[]},{"level":2,"title":"Throttle","slug":"throttle","link":"#throttle","children":[]},{"level":2,"title":"Inbound SMTP Server","slug":"inbound-smtp-server","link":"#inbound-smtp-server","children":[{"level":3,"title":"TCP Proxy Server","slug":"tcp-proxy-server","link":"#tcp-proxy-server","children":[]}]},{"level":2,"title":"Bounce","slug":"bounce","link":"#bounce","children":[]},{"level":2,"title":"List-unsubscribe by Email","slug":"list-unsubscribe-by-email","link":"#list-unsubscribe-by-email","children":[]}],"git":{},"filePathRelative":"docs/config/email.md"}');export{h as comp,f as data};