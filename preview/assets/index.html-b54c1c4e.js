import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="email" tabindex="-1"><a class="header-anchor" href="#email" aria-hidden="true">#</a> Email</h1><h2 id="smtp" tabindex="-1"><a class="header-anchor" href="#smtp" aria-hidden="true">#</a> SMTP</h2><p>By default <em>NotifyBC</em> acts as the SMTP server itself and connects directly to recipient&#39;s SMTP server. To setup SMTP relay to a host, say <em>smtp.foo.com</em>, add following <em>smtp</em> config object to <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">smtp</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;smtp.foo.com&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">pool</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">tls</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">rejectUnauthorized</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 4);
const _hoisted_5 = {
  href: "https://nodemailer.com/smtp/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_6 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "smtp",
  -1
  /* HOISTED */
);
const _hoisted_7 = /* @__PURE__ */ createStaticVNode('<h2 id="throttle" tabindex="-1"><a class="header-anchor" href="#throttle" aria-hidden="true">#</a> Throttle</h2><p><em>NotifyBC</em> can throttle email requests if SMTP server imposes rate limit. To enable throttle and set rate limit, create following config in file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token comment">// minimum request interval in ms</span>\n      <span class="token literal-property property">minTime</span><span class="token operator">:</span> <span class="token number">250</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li><em>enabled</em> - whether to enable throttle or not. Default to <em>false</em>.</li><li><em>minTime</em> - minimum request interval in ms. Example value 250 throttles request rate to 4/sec.</li></ul><p>When <em>NotifyBC</em> is deployed from source code, by default the rate limit applies to one Node.js process only. If there are multiple processes, i.e. a cluster, the aggregated rate limit is multiplied by the number of processes. To enforce the rate limit across entire cluster, install Redis and add Redis config to <em>email.throttle</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token comment">// minimum request interval in ms</span>\n      <span class="token literal-property property">minTime</span><span class="token operator">:</span> <span class="token number">250</span><span class="token punctuation">,</span>\n      <span class="token comment">/* Redis clustering options */</span>\n      <span class="token literal-property property">datastore</span><span class="token operator">:</span> <span class="token string">&#39;ioredis&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">clientOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">,</span>\n        <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">6379</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you installed Redis Sentinel,</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">throttle</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token comment">// minimum request interval in ms</span>\n      <span class="token literal-property property">minTime</span><span class="token operator">:</span> <span class="token number">250</span><span class="token punctuation">,</span>\n      <span class="token comment">/* Redis clustering options */</span>\n      <span class="token literal-property property">datastore</span><span class="token operator">:</span> <span class="token string">&#39;ioredis&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">clientOptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;mymaster&#39;</span><span class="token punctuation">,</span>\n        <span class="token literal-property property">sentinels</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;127.0.0.1&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">port</span><span class="token operator">:</span> <span class="token number">26379</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 9);
const _hoisted_16 = {
  href: "https://github.com/SGrondin/bottleneck",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_17 = {
  href: "https://github.com/luin/ioredis",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_18 = /* @__PURE__ */ createStaticVNode('<p>When <em>NotifyBC</em> is deployed to Kubernetes using Helm, by default throttle, if enabled, uses Redis Sentinel therefore rate limit applies to whole cluster.</p><h2 id="inbound-smtp-server" tabindex="-1"><a class="header-anchor" href="#inbound-smtp-server" aria-hidden="true">#</a> Inbound SMTP Server</h2><p><em>NotifyBC</em> implemented an inbound SMTP server to handle</p><ul><li><a href="#bounce">bounce</a></li><li><a href="#list-unsubscribe-by-email">list-unsubscribe by email</a></li></ul><p>In order for the emails from internet to reach the SMTP server, a host where one of the following servers should be listening on port 25 open to internet</p><ol><li><em>NotifyBC</em>, if it can be installed on such internet-facing host directly; otherwise,</li><li>a tcp proxy server, such as nginx with stream proxy module that can proxy tcp port 25 traffic to backend <em>NotifyBC</em> instances.</li></ol><p>Regardless which above option is chosen, you need to config <em>NotifyBC</em> inbound SMTP server by adding following static config <em>email.inboundSmtpServer</em> to file <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">inboundSmtpServer</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">domain</span><span class="token operator">:</span> <span class="token string">&#39;host.foo.com&#39;</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">listeningSmtpPort</span><span class="token operator">:</span> <span class="token number">25</span><span class="token punctuation">,</span>\n      <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token comment">// ...</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p>', 9);
const _hoisted_27 = /* @__PURE__ */ createStaticVNode("<li><em>enabled</em> enables/disables the inbound SMTP server with default to <em>true</em>.</li><li><em>domain</em> is the internet-facing host domain. It has no default so <strong>must be set</strong>.</li><li><em>listeningSmtpPort</em> should be set to 25 if option 1 above is chosen. For options 2, <em>listeningSmtpPort</em> can be set to any opening port. On Unix, <em>NotifyBC</em> has to be run under <em>root</em> account to bind to port 25. If missing, <em>NotifyBC</em> will randomly select an available port upon launch which is usually undesirable so it <strong>should be set</strong>.</li>", 3);
const _hoisted_30 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "options",
  -1
  /* HOISTED */
);
const _hoisted_31 = {
  href: "https://nodemailer.com/extras/smtp-server/#step-3-create-smtpserver-instance",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_32 = /* @__PURE__ */ createBaseVNode(
  "div",
  { class: "custom-container warning" },
  [
    /* @__PURE__ */ createBaseVNode("p", { class: "custom-container-title" }, "Inbound SMTP Server on OpenShift"),
    /* @__PURE__ */ createBaseVNode("p", null, "OpenShift deployment template deploys an inbound SMTP server. Due to the limitation that OpenShift can only expose port 80 and 443 to external, to use the SMTP server, you have to setup a TCP proxy server (i.e. option 2). The inbound SMTP server is exposed as ${INBOUND_SMTP_DOMAIN}:443 , where ${INBOUND_SMTP_DOMAIN} is a template parameter which in absence, a default domain will be created. Configure your TCP proxy server to route traffic to ${INBOUND_SMTP_DOMAIN}:443 over TLS.")
  ],
  -1
  /* HOISTED */
);
const _hoisted_33 = /* @__PURE__ */ createBaseVNode(
  "h3",
  {
    id: "tcp-proxy-server",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#tcp-proxy-server",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" TCP Proxy Server")
  ],
  -1
  /* HOISTED */
);
const _hoisted_34 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_35 = {
  href: "http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_36 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_37 = /* @__PURE__ */ createStaticVNode('<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>stream {\n    server {\n        listen 25;\n        proxy_pass ${INBOUND_SMTP_DOMAIN}:443;\n        proxy_ssl on;\n        proxy_ssl_verify off;\n        proxy_ssl_server_name on;\n        proxy_connect_timeout 10s;\n    }\n}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace <em>${INBOUND_SMTP_DOMAIN}</em> with the inbound SMTP server route domain.</p><h2 id="bounce" tabindex="-1"><a class="header-anchor" href="#bounce" aria-hidden="true">#</a> Bounce</h2><p>Bounces, or Non-Delivery Reports (NDRs), are system-generated emails informing sender of failed delivery. <em>NotifyBC</em> can be configured to receive bounces, record bounces, and automatically unsubscribe all subscriptions of a recipient if the number of recorded hard bounces against the recipient exceeds threshold. A deemed successful notification delivery deletes the bounce record.</p><p>Although <em>NotifyBC</em> records all bounce emails, not all of them should count towards unsubscription threshold, but rather only the hard bounces - those which indicate permanent unrecoverable errors such as destination address no longer exists. In principle this can be distinguished using smtp response code. In practice, however, there are some challenges to make the distinction</p><ul><li>the smtp response code is not fully standardized and may vary by recipient&#39;s smtp server so it&#39;s unreliable</li><li>there is no standard smtp header in bounce email to contain smtp response code. Often the response code is embedded in bounce email body.</li><li>the bounce email template varies by sender&#39;s smtp server</li></ul><p>To mitigate, <em>NotifyBC</em> defines several customizable string pattern filters in terms of regular expression. Only bounce emails matched the filters count towards unsubscription threshold. It&#39;s a matter of trial-and-error to get the correct filter suitable to your smtp server.</p><div class="custom-container tip"><p class="custom-container-title">to improve hard bounce recognition</p><p>Send non-existing emails to several external email systems. Inspect the bounce messages for common string patterns. After gone live, review bounce records in web console from time to time to identify new bounce types and decide whether the bounce types qualify as hard bounce. To avoid false positives resulting in premature unsubscription, it is advisable to start with a high unsubscription threshold.</p></div><p>Bounce handling involves four actions</p>', 9);
const _hoisted_46 = {
  href: "https://en.wikipedia.org/wiki/Variable_envelope_return_path",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_47 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "bn-{subscriptionId}-{unsubscriptionCode}@{inboundSmtpServerDomain}",
  -1
  /* HOISTED */
);
const _hoisted_48 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_49 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "when a notification finished dispatching, the dispatching start and end time is recorded to all bounce records matching affects recipient addresses",
  -1
  /* HOISTED */
);
const _hoisted_50 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "when inbound smtp server receives a bounce message, it updates the bounce record by saving the message and incrementing the hard bounce count when the message matches the filter criteria. The filter criteria are regular expressions matched against bounce email subject and body, as well as regular expression to extract recipient's email address from bounce email body. It also unsubscribes the user from all subscriptions when the hard bounce count exceeds a predefined threshold.",
  -1
  /* HOISTED */
);
const _hoisted_51 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "A cron job runs periodically to delete bounce records if the latest notification is deemed delivered successfully.",
  -1
  /* HOISTED */
);
const _hoisted_52 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "To setup bounce handling",
  -1
  /* HOISTED */
);
const _hoisted_53 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createTextVNode("set up "),
      /* @__PURE__ */ createBaseVNode("a", { href: "#inbound-smtp-server" }, "inbound smtp server")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_54 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createTextVNode("verify config "),
      /* @__PURE__ */ createBaseVNode("em", null, "email.bounce.enabled"),
      /* @__PURE__ */ createTextVNode(" is set to true or absent in "),
      /* @__PURE__ */ createBaseVNode("em", null, "/src/config.local.js")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_55 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "/src/config.ts",
  -1
  /* HOISTED */
);
const _hoisted_56 = {
  href: "https://tools.ietf.org/html/rfc3464",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_57 = /* @__PURE__ */ createStaticVNode('<div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  email<span class="token operator">:</span> <span class="token punctuation">{</span>\n    bounce<span class="token operator">:</span> <span class="token punctuation">{</span>\n      enabled<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      unsubThreshold<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>\n      subjectRegex<span class="token operator">:</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span>\n      smtpStatusCodeRegex<span class="token operator">:</span> <span class="token string">&#39;5\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}&#39;</span><span class="token punctuation">,</span>\n      failedRecipientRegex<span class="token operator">:</span>\n        <span class="token string">&#39;(?:[a-z0-9!#$%&amp;\\&#39;*+/=?^_`{|}~-]+(?:\\\\.[a-z0-9!#$%&amp;\\&#39;*+/=?^_`{|}~-]+)*|&quot;(?:[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21\\\\x23-\\\\x5b\\\\x5d-\\\\x7f]|\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f])*&quot;)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\\\x01-\\\\x08\\\\x0b\\\\x0c\\\\x0e-\\\\x1f\\\\x21-\\\\x5a\\\\x53-\\\\x7f]|\\\\\\\\[\\\\x01-\\\\x09\\\\x0b\\\\x0c\\\\x0e-\\\\x7f])+)\\\\])&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p>', 2);
const _hoisted_59 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createBaseVNode("em", null, "unsubThreshold"),
      /* @__PURE__ */ createTextVNode(" is the threshold of hard bounce count above which the user is unsubscribed from all subscriptions")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_60 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createBaseVNode("em", null, "subjectRegex"),
      /* @__PURE__ */ createTextVNode(" is the regular expression that bounce message subject must match in order to count towards the threshold. If "),
      /* @__PURE__ */ createBaseVNode("em", null, "subjectRegex"),
      /* @__PURE__ */ createTextVNode(" is set to empty string or "),
      /* @__PURE__ */ createBaseVNode("em", null, "undefined"),
      /* @__PURE__ */ createTextVNode(", then this filter is disabled.")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_61 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "smtpStatusCodeRegex",
  -1
  /* HOISTED */
);
const _hoisted_62 = {
  href: "https://tools.ietf.org/html/rfc3463",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_63 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, [
      /* @__PURE__ */ createBaseVNode("em", null, "message/delivery-status")
    ]),
    /* @__PURE__ */ createBaseVNode("li", null, "html"),
    /* @__PURE__ */ createBaseVNode("li", null, "plain text")
  ],
  -1
  /* HOISTED */
);
const _hoisted_64 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "failedRecipientRegex",
  -1
  /* HOISTED */
);
const _hoisted_65 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "failedRecipientRegex",
  -1
  /* HOISTED */
);
const _hoisted_66 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "undefined",
  -1
  /* HOISTED */
);
const _hoisted_67 = {
  href: "https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_68 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, [
      /* @__PURE__ */ createBaseVNode("em", null, "message/delivery-status")
    ]),
    /* @__PURE__ */ createBaseVNode("li", null, "html"),
    /* @__PURE__ */ createBaseVNode("li", null, "plain text")
  ],
  -1
  /* HOISTED */
);
const _hoisted_69 = /* @__PURE__ */ createBaseVNode(
  "h2",
  {
    id: "list-unsubscribe-by-email",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#list-unsubscribe-by-email",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" List-unsubscribe by Email")
  ],
  -1
  /* HOISTED */
);
const _hoisted_70 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "Some email clients provide a consistent UI to unsubscribe if an unsubscription email address is supplied. For example, newer iOS built-in email app will display following banner",
  -1
  /* HOISTED */
);
const _hoisted_71 = ["src"];
const _hoisted_72 = /* @__PURE__ */ createStaticVNode('<p>To support this unsubscription method, <em>NotifyBC</em> implements a custom inbound SMTP server to transform received emails sent to address <em>un-{subscriptionId}-{unsubscriptionCode}@{inboundSmtpServerDomain}</em> to <em>NotifyBC</em> unsubscribing API calls. This unsubscription email address is generated by <em>NotifyBC</em> and set in header <em>List-Unsubscribe</em> of all notification emails.</p><p>To enable list-unsubscribe by email</p><ul><li>set up <a href="#inbound-smtp-server">inbound smtp server</a></li><li>verify config <em>email.listUnsubscribeByEmail.enabled</em> is set to true or absent in <em>/src/config.local.js</em></li></ul><p>To disable list-unsubscribe by email, set <em>email.listUnsubscribeByEmail.enabled</em> to <em>false</em> in <em>/src/config.local.js</em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token literal-property property">listUnsubscribeByEmail</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 5);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("p", null, [
      createTextVNode("Check out "),
      createBaseVNode("a", _hoisted_5, [
        createTextVNode("Nodemailer"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" for other config options that you can define in "),
      _hoisted_6,
      createTextVNode(" object. Using SMTP relay and fine-tuning some options are critical for performance. See "),
      createVNode(_component_RouterLink, { to: "/docs/benchmarks/#advices" }, {
        default: withCtx(() => [
          createTextVNode("benchmark advices")
        ]),
        _: 1
        /* STABLE */
      }),
      createTextVNode(".")
    ]),
    _hoisted_7,
    createBaseVNode("p", null, [
      createTextVNode("Throttle is implemented using "),
      createBaseVNode("a", _hoisted_16, [
        createTextVNode("Bottleneck"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" and "),
      createBaseVNode("a", _hoisted_17, [
        createTextVNode("ioredis"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". See their documentations for more configurations.")
    ]),
    _hoisted_18,
    createBaseVNode("ul", null, [
      _hoisted_27,
      createBaseVNode("li", null, [
        createTextVNode("optional "),
        _hoisted_30,
        createTextVNode(" object defines the behavior of "),
        createBaseVNode("a", _hoisted_31, [
          createTextVNode("Nodemailer SMTP Server"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(".")
      ])
    ]),
    _hoisted_32,
    _hoisted_33,
    createBaseVNode("p", null, [
      createTextVNode("If "),
      _hoisted_34,
      createTextVNode(" is not able to bind to port 25 that opens to internet, perhaps due to firewall restriction, you can setup a TCP Proxy Server such as Nginx with "),
      createBaseVNode("a", _hoisted_35, [
        createTextVNode("ngx_stream_proxy_module"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". For example, the following nginx config will proxy SMTP traffic from port 25 to a "),
      _hoisted_36,
      createTextVNode(" inbound SMTP server running on OpenShift")
    ]),
    _hoisted_37,
    createBaseVNode("ul", null, [
      createBaseVNode("li", null, [
        createTextVNode("during notification dispatching, envelop address is set to a "),
        createBaseVNode("a", _hoisted_46, [
          createTextVNode("VERP"),
          createVNode(_component_ExternalLinkIcon)
        ]),
        createTextVNode(" in the form "),
        _hoisted_47,
        createTextVNode(" routed to "),
        _hoisted_48,
        createTextVNode(" inbound smtp server.")
      ]),
      _hoisted_49,
      _hoisted_50,
      _hoisted_51
    ]),
    _hoisted_52,
    createBaseVNode("ul", null, [
      _hoisted_53,
      _hoisted_54,
      createBaseVNode("li", null, [
        createBaseVNode("p", null, [
          createTextVNode("verify and adjust unsubscription threshold and bounce filter criteria if needed. Following is the default config in file "),
          _hoisted_55,
          createTextVNode(" compatible with "),
          createBaseVNode("a", _hoisted_56, [
            createTextVNode("rfc 3464"),
            createVNode(_component_ExternalLinkIcon)
          ])
        ]),
        _hoisted_57,
        createBaseVNode("ul", null, [
          _hoisted_59,
          _hoisted_60,
          createBaseVNode("li", null, [
            createBaseVNode("p", null, [
              _hoisted_61,
              createTextVNode(" is the regular expression that smtp status code embedded in the message body must match in order to count towards the threshold. The default value matches all "),
              createBaseVNode("a", _hoisted_62, [
                createTextVNode("rfc3463"),
                createVNode(_component_ExternalLinkIcon)
              ]),
              createTextVNode(" class 5 status codes. For a multi-part bounce message, the body limits to the one of the following parts by content type in descending order")
            ]),
            _hoisted_63
          ]),
          createBaseVNode("li", null, [
            createBaseVNode("p", null, [
              _hoisted_64,
              createTextVNode(" is the regular expression used to extract recipient's email address from bounce message body. This extracted recipient's email address is compared against the subscription record as a means of validation. If "),
              _hoisted_65,
              createTextVNode(" is set to empty string or "),
              _hoisted_66,
              createTextVNode(", then this validation method is skipped. The default RegEx is taken from a "),
              createBaseVNode("a", _hoisted_67, [
                createTextVNode("stackoverflow answer"),
                createVNode(_component_ExternalLinkIcon)
              ]),
              createTextVNode(". For a multi-part bounce message, the body limits to the one of the following parts by content type in descending order")
            ]),
            _hoisted_68
          ])
        ])
      ]),
      createBaseVNode("li", null, [
        createBaseVNode("p", null, [
          createTextVNode("Change config of cron job "),
          createVNode(_component_RouterLink, { to: "/docs/config-cronJobs/#delete-notification-bounces" }, {
            default: withCtx(() => [
              createTextVNode("Delete Notification Bounces")
            ]),
            _: 1
            /* STABLE */
          }),
          createTextVNode(" if needed")
        ])
      ])
    ]),
    _hoisted_69,
    _hoisted_70,
    createBaseVNode("img", {
      src: _ctx.$withBase("/img/list-unsubscription.png"),
      alt: "list unsubscription"
    }, null, 8, _hoisted_71),
    _hoisted_72
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-b54c1c4e.js.map
