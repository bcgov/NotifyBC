import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, t as toDisplayString, u as unref, e as createStaticVNode, f as useThemeData } from "./app-fffec9eb.js";
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h1><p><em>NotifyBC</em> can be installed in 3 ways:</p><ol><li><a href="#deploy-locally-from-source-code">Deploy locally from Source Code</a></li><li><a href="#deploy-to-kubernetes">Deploy to Kubernetes</a></li><li><a href="#deploy-docker-container">Deploy Docker Container</a></li></ol><p>For the purpose of evaluation, both source code and docker container will do. For production, the recommendation is one of</p><ul><li>deploying to Kubernetes</li><li>setting up a load balanced app cluster from source code build, backed by MongoDB.</li></ul><p>To setup a development environment in order to contribute to <em>NotifyBC</em>, installing from source code is preferred.</p><h2 id="deploy-locally-from-source-code" tabindex="-1"><a class="header-anchor" href="#deploy-locally-from-source-code" aria-hidden="true">#</a> Deploy locally from Source Code</h2><h3 id="system-requirements" tabindex="-1"><a class="header-anchor" href="#system-requirements" aria-hidden="true">#</a> System Requirements</h3>', 8);
const _hoisted_9 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "Git",
  -1
  /* HOISTED */
);
const _hoisted_10 = {
  href: "https://nodejs.org",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_11 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "openssl (if enable HTTPS)",
  -1
  /* HOISTED */
);
const _hoisted_12 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "MongoDB, optional but recommended for production",
  -1
  /* HOISTED */
);
const _hoisted_13 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "A standard SMTP server to deliver outgoing email, optional but recommended for production.",
  -1
  /* HOISTED */
);
const _hoisted_14 = {
  href: "http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_15 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("A SMS service provider account if needs to enable SMS channel. The supported service providers are "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "Twilio (default)"),
      /* @__PURE__ */ createBaseVNode("li", null, "Swift")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "Redis, optional but recommended if SMS is enabled",
  -1
  /* HOISTED */
);
const _hoisted_18 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "SiteMinder, if need to allow SiteMinder authenticated user request",
  -1
  /* HOISTED */
);
const _hoisted_19 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "OIDC provide, if need to allow OIDC authenticated user request",
  -1
  /* HOISTED */
);
const _hoisted_20 = /* @__PURE__ */ createStaticVNode("<li>Network and Permissions <ul><li>Minimum runtime firewall requirements: <ul><li>outbound to your ISP DNS server</li><li>outbound to any on port 80 and 443 in order to run build scripts and send SMS messages</li><li>outbound to any on SMTP port 25 if using direct mail; for SMTP relay, outbound to your configured SMTP server and port only</li><li>inbound to listening port (3000 by default) from other authorized server ips</li><li>if <em>NotifyBC</em> instance will handle anonymous subscription from client browser, the listening port should be open to internet either directly or indirectly through a reverse proxy; If <em>NotifyBC</em> instance will only handle SiteMinder authenticated webapp requests, the listening port should NOT be open to internet. Instead, it should only open to SiteMinder web agent reverse proxy.</li></ul></li><li>If list-unsubscribe by email is needed, then one of the following must be met <ul><li><em>NotifyBC</em> can bind to port 25 opening to internet</li><li>a tcp proxy server of which port 25 is open to internet. This proxy server can reach <em>NotifyBC</em> on a tcp port.</li></ul></li></ul></li>", 1);
const _hoisted_21 = /* @__PURE__ */ createStaticVNode('<h3 id="installation-1" tabindex="-1"><a class="header-anchor" href="#installation-1" aria-hidden="true">#</a> Installation</h3><p>Run following commands</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git\n<span class="token builtin class-name">cd</span> NotifyBC\n<span class="token function">npm</span> i <span class="token parameter variable">-g</span> <span class="token function">yarn</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build\n<span class="token function">yarn</span> start\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If successful, you will see following output</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>...\nServer is running at http://0.0.0.0:3000\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>', 5);
const _hoisted_26 = {
  href: "http://localhost:3000",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_27 = /* @__PURE__ */ createStaticVNode('<p>The above commands installs the <em>main</em> version, i.e. main branch tip of <em>NotifyBC</em> GitHub repository. To install a specific version, say <em>v2.1.0</em>, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> <span class="token function">git</span> checkout tags/v2.1.0 <span class="token parameter variable">-b</span> v2.1.0\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 2);
const _hoisted_29 = /* @__PURE__ */ createBaseVNode(
  "code",
  null,
  "cd NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_30 = {
  href: "https://github.com/bcgov/NotifyBC/tags",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_31 = /* @__PURE__ */ createStaticVNode('<div class="custom-container tip"><p class="custom-container-title">install from behind firewall</p><p>If you want to install on a server behind firewall which restricts internet connection, you can work around the firewall as long as you have access to a http(s) forward proxy server. Assuming the proxy server is http://my_proxy:8080 which proxies both http and https requests, to use it:</p><ul><li><p>For Linux</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">http_proxy</span><span class="token operator">=</span>http://my_proxy:8080\n<span class="token builtin class-name">export</span> <span class="token assign-left variable">https_proxy</span><span class="token operator">=</span>http://my_proxy:8080\n<span class="token function">git</span> config <span class="token parameter variable">--global</span> url.<span class="token string">&quot;https://&quot;</span>.insteadOf git://\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>For Windows</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span> http.proxy http://my_proxy:8080\n<span class="token function">git</span> config <span class="token parameter variable">--global</span> url.<span class="token string">&quot;https://&quot;</span>.insteadOf git://\n<span class="token function">npm</span> config <span class="token builtin class-name">set</span> proxy http://my_proxy:8080\n<span class="token function">npm</span> i <span class="token parameter variable">-g</span> <span class="token function">yarn</span>\n<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> proxy http://my_proxy:8080\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></div><h4 id="install-windows-service" tabindex="-1"><a class="header-anchor" href="#install-windows-service" aria-hidden="true">#</a> Install Windows Service</h4><p>After get the app running interactively, if your server is Windows and you want to install the app as a Windows service, run</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install -g node-windows\nnpm link node-windows\nnode windows-service.js\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 4);
const _hoisted_35 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "notifyBC",
  -1
  /* HOISTED */
);
const _hoisted_36 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "windows-service.js",
  -1
  /* HOISTED */
);
const _hoisted_37 = {
  href: "https://github.com/coreybutler/node-windows",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_38 = /* @__PURE__ */ createBaseVNode(
  "h2",
  {
    id: "deploy-to-kubernetes",
    tabindex: "-1"
  },
  [
    /* @__PURE__ */ createBaseVNode("a", {
      class: "header-anchor",
      href: "#deploy-to-kubernetes",
      "aria-hidden": "true"
    }, "#"),
    /* @__PURE__ */ createTextVNode(" Deploy to Kubernetes")
  ],
  -1
  /* HOISTED */
);
const _hoisted_39 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_40 = {
  href: "https://github.com/orgs/bcgov/packages/container/package/notify-bc",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_41 = {
  href: "https://helm.sh/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_42 = {
  href: "https://docs.microsoft.com/en-us/azure/aks/ingress-basic#create-an-ingress-controller",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_43 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "The deployment can be initiated from localhost or automated by CI service such as Jenkins. Regardless, at the initiator's side following software needs to be installed:",
  -1
  /* HOISTED */
);
const _hoisted_44 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "git",
  -1
  /* HOISTED */
);
const _hoisted_45 = {
  href: "https://docs.microsoft.com/en-us/cli/azure/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_46 = {
  href: "https://docs.openshift.org/latest/cli_reference/index.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_47 = {
  href: "https://helm.sh/docs/intro/install/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_48 = /* @__PURE__ */ createStaticVNode('<p>To install,</p><ol><li><p>Follow your platform&#39;s instruction to login to the platform. For AKS, run <code>az login</code> and <code>az aks get-credentials</code>; for OpenShift, run <code>oc login</code></p></li><li><p>Run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git\n<span class="token builtin class-name">cd</span> NotifyBC\nhelm <span class="token function">install</span> <span class="token parameter variable">-gf</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml helm\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>replace &lt;platform&gt; with <em>openshift</em> or <em>aks</em> depending on your platform.</p><p>The above commands create following artifacts:</p><ul><li>A MongoDB cluster with 2 nodes and 1 arbiter, each implemented as a stateful set</li><li>Two deployments - <em>notify-bc-app</em> and <em>notify-bc-cron</em></li><li>One HPA - <em>notify-bc-cron</em></li><li>Four services - <em>notify-bc</em>, <em>notify-bc-smtp</em>, <em>mongodb-headless</em> and <em>mongodb-arbiter-headless</em></li><li>Two PVCs each for one MongoDB node</li><li>Two config maps - <em>notify-bc</em> and <em>mongodb-scripts</em></li><li>Two service accounts - <em>notify-bc</em> and <em>mongodb</em></li><li>One more more secrets, with the most important one being <em>mongodb</em>, containing MongoDB connection credentials</li><li>On AKS, <ul><li>a <em>notify-bc</em> ingress</li></ul></li><li>On OpenShift, <ul><li>2 routes - <em>notify-bc-web</em> and <em>notify-bc-smtp</em></li></ul></li></ul></li></ol><p>To upgrade,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">--set</span> <span class="token assign-left variable">mongodb.auth.rootPassword</span><span class="token operator">=</span><span class="token operator">&lt;</span>mongodb-root-password<span class="token operator">&gt;</span> <span class="token parameter variable">--set</span> <span class="token assign-left variable">mongodb.auth.replicaSetKey</span><span class="token operator">=</span><span class="token operator">&lt;</span>mongodb-replica-set-key<span class="token operator">&gt;</span> <span class="token parameter variable">--set</span> <span class="token assign-left variable">mongodb.auth.password</span><span class="token operator">=</span><span class="token operator">&lt;</span>mongodb-password<span class="token operator">&gt;</span> helm\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>replace &lt;release-name&gt; with installed helm release name and &lt;platform&gt; with <em>openshift</em> or <em>aks</em> depending on your platform. MongoDB credentials &lt;mongodb-root-password&gt;, &lt;mongodb-replica-set-key&gt; and &lt;mongodb-password&gt; can be found in secret <em>&lt;release-name&gt;-mongodb</em>. It is recommended to specify mongodb credentials in a file rather than command line. See <a href="#customizations">Customizations</a> below.</p><p>To uninstall,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm uninstall <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>replace &lt;release-name&gt; with installed helm release name.</p><h3 id="customizations" tabindex="-1"><a class="header-anchor" href="#customizations" aria-hidden="true">#</a> Customizations</h3>', 9);
const _hoisted_57 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  ".local.yaml",
  -1
  /* HOISTED */
);
const _hoisted_58 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "helm/values.local.yaml",
  -1
  /* HOISTED */
);
const _hoisted_59 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "helm/values.yaml",
  -1
  /* HOISTED */
);
const _hoisted_60 = {
  href: "https://github.com/bitnami/charts/tree/master/bitnami/mongodb",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_61 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "helm/values.local.yaml",
  -1
  /* HOISTED */
);
const _hoisted_62 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "helm/values.yaml",
  -1
  /* HOISTED */
);
const _hoisted_63 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "mongodb",
  -1
  /* HOISTED */
);
const _hoisted_64 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "helm/values.local.yaml",
  -1
  /* HOISTED */
);
const _hoisted_65 = /* @__PURE__ */ createStaticVNode('<p>To apply customizations, add <code>-f helm/values.local.yaml</code> to the helm command after <code>-f helm/platform-specific/&lt;platform&gt;.yaml</code>. For example, to install chart with customization on OpenShift,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm <span class="token function">install</span> <span class="token parameter variable">-gf</span> helm/platform-specific/openshift.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>to upgrade an existing release with customization on OpenShift,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/openshift.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">Backup <i>helm/values.local.yaml</i></p><p>Backup <em>helm/values.local.yaml</em> to a private secured SCM is highly recommended, especially for production environment.</p></div><p>Following are some common customizations</p>', 6);
const _hoisted_71 = /* @__PURE__ */ createStaticVNode('<li><p>Update <em>config.local.js</em> in ConfigMap, for example to define <em>httpHost</em></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">configMap</span><span class="token punctuation">:</span>\n  <span class="token key atrule">config.local.js</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>\n    module.exports = <span class="token punctuation">{</span>\n      <span class="token key atrule">httpHost</span><span class="token punctuation">:</span> <span class="token string">&#39;https://myNotifyBC.myOrg.com&#39;</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Set hostname on AKS,</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">ingress</span><span class="token punctuation">:</span>\n  <span class="token key atrule">hosts</span><span class="token punctuation">:</span>\n    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> myNotifyBC.myOrg.com\n      <span class="token key atrule">paths</span><span class="token punctuation">:</span>\n        <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>', 2);
const _hoisted_73 = {
  href: "https://docs.microsoft.com/en-us/azure/aks/ingress-tls",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_74 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "helm/values.local.yaml",
  -1
  /* HOISTED */
);
const _hoisted_75 = /* @__PURE__ */ createStaticVNode('<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">ingress</span><span class="token punctuation">:</span>\n  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>\n    <span class="token key atrule">cert-manager.io/cluster-issuer</span><span class="token punctuation">:</span> letsencrypt\n  <span class="token key atrule">tls</span><span class="token punctuation">:</span>\n    <span class="token punctuation">-</span> <span class="token key atrule">secretName</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>secret\n      <span class="token key atrule">hosts</span><span class="token punctuation">:</span>\n        <span class="token punctuation">-</span> notify<span class="token punctuation">-</span>bc.local\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 1);
const _hoisted_76 = /* @__PURE__ */ createStaticVNode('<li><p>Route host names on Openshift are by default auto-generated. To set to fixed values</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">route</span><span class="token punctuation">:</span>\n  <span class="token key atrule">web</span><span class="token punctuation">:</span>\n    <span class="token key atrule">host</span><span class="token punctuation">:</span> <span class="token string">&#39;myNotifyBC.myOrg.com&#39;</span>\n  <span class="token key atrule">smtp</span><span class="token punctuation">:</span>\n    <span class="token key atrule">host</span><span class="token punctuation">:</span> <span class="token string">&#39;smtp.myNotifyBC.myOrg.com&#39;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Add certificates to OpenShift web route</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">route</span><span class="token punctuation">:</span>\n  <span class="token key atrule">web</span><span class="token punctuation">:</span>\n    <span class="token key atrule">tls</span><span class="token punctuation">:</span>\n      <span class="token key atrule">caCertificate</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>\n        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>BEGIN CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>\n        <span class="token punctuation">...</span>\n        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>END CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>\n      <span class="token key atrule">certificate</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>\n        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>BEGIN CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>\n        <span class="token punctuation">...</span>\n        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>END CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>\n      <span class="token key atrule">insecureEdgeTerminationPolicy</span><span class="token punctuation">:</span> Redirect\n      <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>\n        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>BEGIN PRIVATE KEY<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>\n        <span class="token punctuation">...</span>\n        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>END PRIVATE KEY<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>', 2);
const _hoisted_78 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "MongoDb",
  -1
  /* HOISTED */
);
const _hoisted_79 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_80 = {
  href: "https://github.com/bitnami/charts/tree/master/bitnami/mongodb",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_81 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "mongodb",
  -1
  /* HOISTED */
);
const _hoisted_82 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "architecture",
  -1
  /* HOISTED */
);
const _hoisted_83 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "standalone",
  -1
  /* HOISTED */
);
const _hoisted_84 = /* @__PURE__ */ createStaticVNode('<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>\n  <span class="token key atrule">architecture</span><span class="token punctuation">:</span> standalone\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To set credentials,</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>\n  <span class="token key atrule">auth</span><span class="token punctuation">:</span>\n    <span class="token key atrule">rootPassword</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>\n    <span class="token key atrule">replicaSetKey</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>\n    <span class="token key atrule">password</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To install a Helm chart, the above credentials can be randomly defined. To upgrade an existing release, they must match what&#39;s defined in secret <em>&lt;release-name&gt;-mongodb</em>.</p>', 4);
const _hoisted_88 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "Redis",
  -1
  /* HOISTED */
);
const _hoisted_89 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_90 = {
  href: "https://github.com/bitnami/charts/tree/master/bitnami/redis",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_91 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "redis",
  -1
  /* HOISTED */
);
const _hoisted_92 = /* @__PURE__ */ createStaticVNode('<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">redis</span><span class="token punctuation">:</span>\n  <span class="token key atrule">auth</span><span class="token punctuation">:</span>\n    <span class="token key atrule">password</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To install a Helm chart, the above credential can be randomly defined. To upgrade an existing release, It must match what&#39;s defined in secret <em>&lt;release-name&gt;-redis</em>.</p>', 2);
const _hoisted_94 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "Both Bitnami MongoDB and Redis use Docker Hub for docker registry. Rate limit imposed by Docker Hub can cause runtime problems. If your organization has JFrog artifactory, you can change the registry")
  ],
  -1
  /* HOISTED */
);
const _hoisted_95 = /* @__PURE__ */ createStaticVNode('<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">global</span><span class="token punctuation">:</span>\n  <span class="token key atrule">imageRegistry</span><span class="token punctuation">:</span> &lt;artifactory.myOrg.com<span class="token punctuation">&gt;</span>\n  <span class="token key atrule">imagePullSecrets</span><span class="token punctuation">:</span>\n    <span class="token punctuation">-</span> &lt;docker<span class="token punctuation">-</span>pull<span class="token punctuation">-</span>secret<span class="token punctuation">&gt;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>', 1);
const _hoisted_96 = {
  href: "https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_97 = /* @__PURE__ */ createStaticVNode('<ul><li><p>Enable scheduled MongoDB backup CronJob</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">cronJob</span><span class="token punctuation">:</span>\n  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>\n  <span class="token key atrule">schedule</span><span class="token punctuation">:</span> <span class="token string">&#39;1 0 * * *&#39;</span>\n  <span class="token key atrule">retentionDays</span><span class="token punctuation">:</span> <span class="token number">7</span>\n  <span class="token key atrule">timeZone</span><span class="token punctuation">:</span> UTC\n  <span class="token key atrule">persistence</span><span class="token punctuation">:</span>\n    <span class="token key atrule">size</span><span class="token punctuation">:</span> 5Gi\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li>enabled: whether to enable the MongoDB backup CronJob or not; default to <code>false</code></li><li>schedule: the Unix crontab schedule; default to <code>&#39;1 0 * * *&#39;</code> which runs daily at 12:01AM</li><li>retentionDays: how many days the backup is retained; default to <code>7</code></li><li>timeZone: the Unix TZ environment variable; default to <code>UTC</code></li><li>persistence size: size of PVC; default to <code>5Gi</code></li></ul><p>The CronJob backs up MongoDB to a PVC named after the chart with suffix <em>-cronjob-mongodb-backup</em> and purges backups that are older than <em>retentionDays</em>.</p><p>To facilitate restoration, mount the PVC to MongoDB pod</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>\n  <span class="token key atrule">extraVolumes</span><span class="token punctuation">:</span>\n    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> export\n      <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span>\n        <span class="token key atrule">claimName</span><span class="token punctuation">:</span> &lt;PVC_NAME<span class="token punctuation">&gt;</span>\n  <span class="token key atrule">extraVolumeMounts</span><span class="token punctuation">:</span>\n    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> export\n      <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /export\n      <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Restoration can then be achieved by running in MongoDB pod</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>mongorestore <span class="token parameter variable">-u</span> <span class="token string">&quot;<span class="token variable">$MONGODB_USERNAME</span>&quot;</span> -p<span class="token string">&quot;<span class="token variable">$MONGODB_PASSWORD</span>&quot;</span> <span class="token punctuation">\\</span>\n<span class="token parameter variable">--uri</span><span class="token operator">=</span><span class="token string">&quot;mongodb://<span class="token variable">$K8S_SERVICE_NAME</span>&quot;</span> <span class="token parameter variable">--db</span> <span class="token variable">$MONGODB_DATABASE</span> <span class="token parameter variable">--gzip</span> <span class="token parameter variable">--drop</span> <span class="token punctuation">\\</span>\n<span class="token parameter variable">--archive</span><span class="token operator">=</span>/export/<span class="token operator">&lt;</span>mongodb-backup-YYMMDD-hhmmss.gz<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><em>NotifyBC</em> image tag defaults to latest published version. To change to <em>latest</em>, i.e. tip of the <em>main branch</em>,</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">image</span><span class="token punctuation">:</span>\n  <span class="token key atrule">tag</span><span class="token punctuation">:</span> latest\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Enable autoscaling for app pod</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>\n<span class="token key atrule">autoscaling</span><span class="token punctuation">:</span>\n  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="deploy-docker-container" tabindex="-1"><a class="header-anchor" href="#deploy-docker-container" aria-hidden="true">#</a> Deploy Docker Container</h2><p>If you have git and Docker installed, you can run following command to deploy <em>NotifyBC</em> Docker container:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token parameter variable">-dp</span> <span class="token number">3000</span>:3000 ghcr.io/bcgov/notify-bc\n<span class="token comment"># open http://localhost:3000</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>If successful, similar output is displayed as in source code installation.</p>', 5);
const _sfc_main = {
  __name: "index.html",
  setup(__props) {
    const themeData = useThemeData();
    return (_ctx, _cache) => {
      const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
      return openBlock(), createElementBlock("div", null, [
        _hoisted_1,
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("Software "),
            createBaseVNode("ul", null, [
              _hoisted_9,
              createBaseVNode("li", null, [
                createBaseVNode("a", _hoisted_10, [
                  createTextVNode("Node.js"),
                  createVNode(_component_ExternalLinkIcon)
                ]),
                createTextVNode(
                  "@" + toDisplayString(unref(themeData).packageJson.engines.node),
                  1
                  /* TEXT */
                )
              ]),
              _hoisted_11
            ])
          ]),
          createBaseVNode("li", null, [
            createTextVNode("Services "),
            createBaseVNode("ul", null, [
              _hoisted_12,
              _hoisted_13,
              createBaseVNode("li", null, [
                createTextVNode("A tcp proxy server such as "),
                createBaseVNode("a", _hoisted_14, [
                  createTextVNode("nginx stream proxy"),
                  createVNode(_component_ExternalLinkIcon)
                ]),
                createTextVNode(" if list-unsubscribe by email is needed and "),
                _hoisted_15,
                createTextVNode(" server cannot expose port 25 to internet")
              ]),
              _hoisted_16,
              _hoisted_17,
              _hoisted_18,
              _hoisted_19
            ])
          ]),
          _hoisted_20
        ]),
        _hoisted_21,
        createBaseVNode("p", null, [
          createTextVNode("Now open "),
          createBaseVNode("a", _hoisted_26, [
            createTextVNode("http://localhost:3000"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(". The page displays NotifyBC Web Console.")
        ]),
        _hoisted_27,
        createBaseVNode("p", null, [
          createTextVNode("after "),
          _hoisted_29,
          createTextVNode(". A list of versions can be found "),
          createBaseVNode("a", _hoisted_30, [
            createTextVNode("here"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(".")
        ]),
        _hoisted_31,
        createBaseVNode("p", null, [
          createTextVNode("This will create and start service "),
          _hoisted_35,
          createTextVNode(". To change service name, modify file "),
          _hoisted_36,
          createTextVNode(" before running it. See "),
          createBaseVNode("a", _hoisted_37, [
            createTextVNode("node-windows"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(" for other operations such as uninstalling the service.")
        ]),
        _hoisted_38,
        createBaseVNode("p", null, [
          _hoisted_39,
          createTextVNode(" provides a "),
          createBaseVNode("a", _hoisted_40, [
            createTextVNode("container package"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(" in GitHub Container Registry and a "),
          createBaseVNode("a", _hoisted_41, [
            createTextVNode("Helm"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(" chart to facilitate Deploying to Kubernetes. Azure AKS and OpenShift are the two tested platforms. Other Kubernetes platforms are likely to work subject to customizations. Before deploying to AKS, "),
          createBaseVNode("a", _hoisted_42, [
            createTextVNode("create an ingress controller "),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(".")
        ]),
        _hoisted_43,
        createBaseVNode("ul", null, [
          _hoisted_44,
          createBaseVNode("li", null, [
            createTextVNode("Platform-specific CLI such as "),
            createBaseVNode("a", _hoisted_45, [
              createTextVNode("Azure CLI"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            createTextVNode(" or "),
            createBaseVNode("a", _hoisted_46, [
              createTextVNode("OpenShift CLI"),
              createVNode(_component_ExternalLinkIcon)
            ])
          ]),
          createBaseVNode("li", null, [
            createBaseVNode("a", _hoisted_47, [
              createTextVNode("Helm CLI"),
              createVNode(_component_ExternalLinkIcon)
            ])
          ])
        ]),
        _hoisted_48,
        createBaseVNode("p", null, [
          createTextVNode("Various customizations can be made to chart. Some are platform dependent. To customize, first create a file with extension "),
          _hoisted_57,
          createTextVNode(". The rest of the document assumes the file is "),
          _hoisted_58,
          createTextVNode(". Then add customized parameters to the file. See "),
          _hoisted_59,
          createTextVNode(" and Bitnami MongoDB chart "),
          createBaseVNode("a", _hoisted_60, [
            createTextVNode("readme"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(" for customizable parameters. Parameters in "),
          _hoisted_61,
          createTextVNode(" overrides corresponding ones in "),
          _hoisted_62,
          createTextVNode(". In particular, parameters under "),
          _hoisted_63,
          createTextVNode(" of "),
          _hoisted_64,
          createTextVNode(" overrides Bitnami MongoDB chart parameters.")
        ]),
        _hoisted_65,
        createBaseVNode("ul", null, [
          _hoisted_71,
          createBaseVNode("li", null, [
            createBaseVNode("p", null, [
              createTextVNode("Use "),
              createBaseVNode("a", _hoisted_73, [
                createTextVNode("Let's Encrypt on AKS"),
                createVNode(_component_ExternalLinkIcon)
              ]),
              createTextVNode(". After following the instructions in the link, add following ingress customizations to file "),
              _hoisted_74
            ]),
            _hoisted_75
          ]),
          _hoisted_76,
          createBaseVNode("li", null, [
            _hoisted_78,
            createBaseVNode("p", null, [
              _hoisted_79,
              createTextVNode(" chart depends on "),
              createBaseVNode("a", _hoisted_80, [
                createTextVNode("Bitnami MongoDB chart"),
                createVNode(_component_ExternalLinkIcon)
              ]),
              createTextVNode(" for MongoDB database provisioning. All documented parameters are customizable under "),
              _hoisted_81,
              createTextVNode(". For example, to change "),
              _hoisted_82,
              createTextVNode(" to "),
              _hoisted_83
            ]),
            _hoisted_84
          ]),
          createBaseVNode("li", null, [
            _hoisted_88,
            createBaseVNode("p", null, [
              _hoisted_89,
              createTextVNode(" chart depends on "),
              createBaseVNode("a", _hoisted_90, [
                createTextVNode("Bitnami Redis chart"),
                createVNode(_component_ExternalLinkIcon)
              ]),
              createTextVNode(" for Redis provisioning. All documented parameters are customizable under "),
              _hoisted_91,
              createTextVNode(". For example, to set credential")
            ]),
            _hoisted_92
          ]),
          _hoisted_94
        ]),
        _hoisted_95,
        createBaseVNode("p", null, [
          createTextVNode("The above settings assume you have setup secret <docker-pull-secret> to access <artifactory.myOrg.com>. The secret can be created using "),
          createBaseVNode("a", _hoisted_96, [
            createTextVNode("kubectl"),
            createVNode(_component_ExternalLinkIcon)
          ]),
          createTextVNode(".")
        ]),
        _hoisted_97
      ]);
    };
  }
};
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-d90d908a.js.map
