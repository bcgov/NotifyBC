import{_ as o,r as i,o as r,c,a as n,b as e,d as s,t as p,u,e as t,f as d}from"./app-36923215.js";const m=t('<h1 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h1><p><em>NotifyBC</em> can be installed in 3 ways:</p><ol><li><a href="#deploy-locally-from-source-code">Deploy locally from Source Code</a></li><li><a href="#deploy-to-kubernetes">Deploy to Kubernetes</a></li><li><a href="#deploy-docker-container">Deploy Docker Container</a></li></ol><p>For the purpose of evaluation, both source code and docker container will do. For production, the recommendation is one of</p><ul><li>deploying to Kubernetes</li><li>setting up a load balanced app cluster from source code build, backed by MongoDB.</li></ul><p>To setup a development environment in order to contribute to <em>NotifyBC</em>, installing from source code is preferred.</p><h2 id="deploy-locally-from-source-code" tabindex="-1"><a class="header-anchor" href="#deploy-locally-from-source-code" aria-hidden="true">#</a> Deploy locally from Source Code</h2><h3 id="system-requirements" tabindex="-1"><a class="header-anchor" href="#system-requirements" aria-hidden="true">#</a> System Requirements</h3>',8),v=n("li",null,"Git",-1),h={href:"https://nodejs.org",target:"_blank",rel:"noopener noreferrer"},b=n("li",null,"openssl (if enable HTTPS)",-1),k=n("li",null,"MongoDB, optional but recommended for production",-1),g=n("li",null,"A standard SMTP server to deliver outgoing email, optional but recommended for production.",-1),y={href:"http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html",target:"_blank",rel:"noopener noreferrer"},f=n("em",null,"NotifyBC",-1),_=n("li",null,[e("A SMS service provider account if needs to enable SMS channel. The supported service providers are "),n("ul",null,[n("li",null,"Twilio (default)"),n("li",null,"Swift")])],-1),x=n("li",null,"Redis, optional but recommended if SMS is enabled",-1),w=n("li",null,"SiteMinder, if need to allow SiteMinder authenticated user request",-1),C=n("li",null,"OIDC provide, if need to allow OIDC authenticated user request",-1),B=t("<li>Network and Permissions <ul><li>Minimum runtime firewall requirements: <ul><li>outbound to your ISP DNS server</li><li>outbound to any on port 80 and 443 in order to run build scripts and send SMS messages</li><li>outbound to any on SMTP port 25 if using direct mail; for SMTP relay, outbound to your configured SMTP server and port only</li><li>inbound to listening port (3000 by default) from other authorized server ips</li><li>if <em>NotifyBC</em> instance will handle anonymous subscription from client browser, the listening port should be open to internet either directly or indirectly through a reverse proxy; If <em>NotifyBC</em> instance will only handle SiteMinder authenticated webapp requests, the listening port should NOT be open to internet. Instead, it should only open to SiteMinder web agent reverse proxy.</li></ul></li><li>If list-unsubscribe by email is needed, then one of the following must be met <ul><li><em>NotifyBC</em> can bind to port 25 opening to internet</li><li>a tcp proxy server of which port 25 is open to internet. This proxy server can reach <em>NotifyBC</em> on a tcp port.</li></ul></li></ul></li>",1),S=t(`<h3 id="installation-1" tabindex="-1"><a class="header-anchor" href="#installation-1" aria-hidden="true">#</a> Installation</h3><p>Run following commands</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git
<span class="token builtin class-name">cd</span> NotifyBC
<span class="token function">npm</span> i <span class="token parameter variable">-g</span> <span class="token function">yarn</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build
<span class="token function">yarn</span> start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If successful, you will see following output</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>...
Server is running at http://0.0.0.0:3000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,5),T={href:"http://localhost:3000",target:"_blank",rel:"noopener noreferrer"},D=t(`<p>The above commands installs the <em>main</em> version, i.e. main branch tip of <em>NotifyBC</em> GitHub repository. To install a specific version, say <em>v2.1.0</em>, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> <span class="token function">git</span> checkout tags/v2.1.0 <span class="token parameter variable">-b</span> v2.1.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,2),N=n("code",null,"cd NotifyBC",-1),M={href:"https://github.com/bcgov/NotifyBC/tags",target:"_blank",rel:"noopener noreferrer"},I=t(`<div class="custom-container tip"><p class="custom-container-title">install from behind firewall</p><p>If you want to install on a server behind firewall which restricts internet connection, you can work around the firewall as long as you have access to a http(s) forward proxy server. Assuming the proxy server is http://my_proxy:8080 which proxies both http and https requests, to use it:</p><ul><li><p>For Linux</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">http_proxy</span><span class="token operator">=</span>http://my_proxy:8080
<span class="token builtin class-name">export</span> <span class="token assign-left variable">https_proxy</span><span class="token operator">=</span>http://my_proxy:8080
<span class="token function">git</span> config <span class="token parameter variable">--global</span> url.<span class="token string">&quot;https://&quot;</span>.insteadOf git://
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>For Windows</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> config <span class="token parameter variable">--global</span> http.proxy http://my_proxy:8080
<span class="token function">git</span> config <span class="token parameter variable">--global</span> url.<span class="token string">&quot;https://&quot;</span>.insteadOf git://
<span class="token function">npm</span> config <span class="token builtin class-name">set</span> proxy http://my_proxy:8080
<span class="token function">npm</span> i <span class="token parameter variable">-g</span> <span class="token function">yarn</span>
<span class="token function">yarn</span> config <span class="token builtin class-name">set</span> proxy http://my_proxy:8080
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></div><h4 id="install-windows-service" tabindex="-1"><a class="header-anchor" href="#install-windows-service" aria-hidden="true">#</a> Install Windows Service</h4><p>After get the app running interactively, if your server is Windows and you want to install the app as a Windows service, run</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npm install -g node-windows
npm link node-windows
node windows-service.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),A=n("em",null,"notifyBC",-1),E=n("em",null,"windows-service.js",-1),O={href:"https://github.com/coreybutler/node-windows",target:"_blank",rel:"noopener noreferrer"},z=n("h2",{id:"deploy-to-kubernetes",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#deploy-to-kubernetes","aria-hidden":"true"},"#"),e(" Deploy to Kubernetes")],-1),R=n("em",null,"NotifyBC",-1),P={href:"https://github.com/orgs/bcgov/packages/container/package/notify-bc",target:"_blank",rel:"noopener noreferrer"},q={href:"https://helm.sh/",target:"_blank",rel:"noopener noreferrer"},F={href:"https://docs.microsoft.com/en-us/azure/aks/ingress-basic#create-an-ingress-controller",target:"_blank",rel:"noopener noreferrer"},K=n("p",null,"The deployment can be initiated from localhost or automated by CI service such as Jenkins. Regardless, at the initiator's side following software needs to be installed:",-1),V=n("li",null,"git",-1),H={href:"https://docs.microsoft.com/en-us/cli/azure/",target:"_blank",rel:"noopener noreferrer"},G={href:"https://docs.openshift.org/latest/cli_reference/index.html",target:"_blank",rel:"noopener noreferrer"},j={href:"https://helm.sh/docs/intro/install/",target:"_blank",rel:"noopener noreferrer"},L=t(`<p>To install,</p><ol><li><p>Follow your platform&#39;s instruction to login to the platform. For AKS, run <code>az login</code> and <code>az aks get-credentials</code>; for OpenShift, run <code>oc login</code></p></li><li><p>Run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git
<span class="token builtin class-name">cd</span> NotifyBC
helm <span class="token function">install</span> <span class="token parameter variable">-gf</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>replace &lt;platform&gt; with <em>openshift</em> or <em>aks</em> depending on your platform.</p><p>The above commands create following artifacts:</p><ul><li>A MongoDB cluster with 2 nodes and 1 arbiter, each implemented as a stateful set</li><li>Two deployments - <em>notify-bc-app</em> and <em>notify-bc-cron</em></li><li>One HPA - <em>notify-bc-cron</em></li><li>Four services - <em>notify-bc</em>, <em>notify-bc-smtp</em>, <em>mongodb-headless</em> and <em>mongodb-arbiter-headless</em></li><li>Two PVCs each for one MongoDB node</li><li>Two config maps - <em>notify-bc</em> and <em>mongodb-scripts</em></li><li>Two service accounts - <em>notify-bc</em> and <em>mongodb</em></li><li>One more more secrets, with the most important one being <em>mongodb</em>, containing MongoDB connection credentials</li><li>On AKS, <ul><li>a <em>notify-bc</em> ingress</li></ul></li><li>On OpenShift, <ul><li>2 routes - <em>notify-bc-web</em> and <em>notify-bc-smtp</em></li></ul></li></ul></li></ol><p>To upgrade,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">--set</span> <span class="token assign-left variable">mongodb.auth.rootPassword</span><span class="token operator">=</span><span class="token operator">&lt;</span>mongodb-root-password<span class="token operator">&gt;</span> <span class="token parameter variable">--set</span> <span class="token assign-left variable">mongodb.auth.replicaSetKey</span><span class="token operator">=</span><span class="token operator">&lt;</span>mongodb-replica-set-key<span class="token operator">&gt;</span> <span class="token parameter variable">--set</span> <span class="token assign-left variable">mongodb.auth.password</span><span class="token operator">=</span><span class="token operator">&lt;</span>mongodb-password<span class="token operator">&gt;</span> helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>replace &lt;release-name&gt; with installed helm release name and &lt;platform&gt; with <em>openshift</em> or <em>aks</em> depending on your platform. MongoDB credentials &lt;mongodb-root-password&gt;, &lt;mongodb-replica-set-key&gt; and &lt;mongodb-password&gt; can be found in secret <em>&lt;release-name&gt;-mongodb</em>. It is recommended to specify mongodb credentials in a file rather than command line. See <a href="#customizations">Customizations</a> below.</p><p>To uninstall,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm uninstall <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>replace &lt;release-name&gt; with installed helm release name.</p><h3 id="customizations" tabindex="-1"><a class="header-anchor" href="#customizations" aria-hidden="true">#</a> Customizations</h3>`,9),J=n("em",null,".local.yaml",-1),U=n("em",null,"helm/values.local.yaml",-1),W=n("em",null,"helm/values.yaml",-1),Y={href:"https://github.com/bitnami/charts/tree/master/bitnami/mongodb",target:"_blank",rel:"noopener noreferrer"},$=n("em",null,"helm/values.local.yaml",-1),Z=n("em",null,"helm/values.yaml",-1),Q=n("em",null,"mongodb",-1),X=n("em",null,"helm/values.local.yaml",-1),nn=t(`<p>To apply customizations, add <code>-f helm/values.local.yaml</code> to the helm command after <code>-f helm/platform-specific/&lt;platform&gt;.yaml</code>. For example, to install chart with customization on OpenShift,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm <span class="token function">install</span> <span class="token parameter variable">-gf</span> helm/platform-specific/openshift.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>to upgrade an existing release with customization on OpenShift,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/openshift.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">Backup <i>helm/values.local.yaml</i></p><p>Backup <em>helm/values.local.yaml</em> to a private secured SCM is highly recommended, especially for production environment.</p></div><p>Following are some common customizations</p>`,6),en=t(`<li><p>Update <em>config.local.js</em> in ConfigMap, for example to define <em>httpHost</em></p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">configMap</span><span class="token punctuation">:</span>
  <span class="token key atrule">config.local.js</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
    module.exports = <span class="token punctuation">{</span>
      <span class="token key atrule">httpHost</span><span class="token punctuation">:</span> <span class="token string">&#39;https://myNotifyBC.myOrg.com&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Set hostname on AKS,</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">ingress</span><span class="token punctuation">:</span>
  <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> myNotifyBC.myOrg.com
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,2),an={href:"https://docs.microsoft.com/en-us/azure/aks/ingress-tls",target:"_blank",rel:"noopener noreferrer"},sn=n("em",null,"helm/values.local.yaml",-1),tn=t(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">ingress</span><span class="token punctuation">:</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">cert-manager.io/cluster-issuer</span><span class="token punctuation">:</span> letsencrypt
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">secretName</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>secret
      <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> notify<span class="token punctuation">-</span>bc.local
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),ln=t(`<li><p>Route host names on Openshift are by default auto-generated. To set to fixed values</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">route</span><span class="token punctuation">:</span>
  <span class="token key atrule">web</span><span class="token punctuation">:</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> <span class="token string">&#39;myNotifyBC.myOrg.com&#39;</span>
  <span class="token key atrule">smtp</span><span class="token punctuation">:</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> <span class="token string">&#39;smtp.myNotifyBC.myOrg.com&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Add certificates to OpenShift web route</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">route</span><span class="token punctuation">:</span>
  <span class="token key atrule">web</span><span class="token punctuation">:</span>
    <span class="token key atrule">tls</span><span class="token punctuation">:</span>
      <span class="token key atrule">caCertificate</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>BEGIN CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
        <span class="token punctuation">...</span>
        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>END CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
      <span class="token key atrule">certificate</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>BEGIN CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
        <span class="token punctuation">...</span>
        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>END CERTIFICATE<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
      <span class="token key atrule">insecureEdgeTerminationPolicy</span><span class="token punctuation">:</span> Redirect
      <span class="token key atrule">key</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token punctuation">-</span>
        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>BEGIN PRIVATE KEY<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
        <span class="token punctuation">...</span>
        <span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>END PRIVATE KEY<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,2),on=n("p",null,"MongoDb",-1),rn=n("em",null,"NotifyBC",-1),cn={href:"https://github.com/bitnami/charts/tree/master/bitnami/mongodb",target:"_blank",rel:"noopener noreferrer"},pn=n("em",null,"mongodb",-1),un=n("em",null,"architecture",-1),dn=n("em",null,"standalone",-1),mn=t(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>
  <span class="token key atrule">architecture</span><span class="token punctuation">:</span> standalone
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To set credentials,</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>
  <span class="token key atrule">auth</span><span class="token punctuation">:</span>
    <span class="token key atrule">rootPassword</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
    <span class="token key atrule">replicaSetKey</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
    <span class="token key atrule">password</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To install a Helm chart, the above credentials can be randomly defined. To upgrade an existing release, they must match what&#39;s defined in secret <em>&lt;release-name&gt;-mongodb</em>.</p>`,4),vn=n("p",null,"Redis",-1),hn=n("em",null,"NotifyBC",-1),bn={href:"https://github.com/bitnami/charts/tree/master/bitnami/redis",target:"_blank",rel:"noopener noreferrer"},kn=n("em",null,"redis",-1),gn=t(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">redis</span><span class="token punctuation">:</span>
  <span class="token key atrule">auth</span><span class="token punctuation">:</span>
    <span class="token key atrule">password</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>To install a Helm chart, the above credential can be randomly defined. To upgrade an existing release, It must match what&#39;s defined in secret <em>&lt;release-name&gt;-redis</em>.</p>`,2),yn=n("li",null,[n("p",null,"Both Bitnami MongoDB and Redis use Docker Hub for docker registry. Rate limit imposed by Docker Hub can cause runtime problems. If your organization has JFrog artifactory, you can change the registry")],-1),fn=t(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">imageRegistry</span><span class="token punctuation">:</span> &lt;artifactory.myOrg.com<span class="token punctuation">&gt;</span>
  <span class="token key atrule">imagePullSecrets</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> &lt;docker<span class="token punctuation">-</span>pull<span class="token punctuation">-</span>secret<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),_n={href:"https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/#create-a-secret-by-providing-credentials-on-the-command-line",target:"_blank",rel:"noopener noreferrer"},xn=t(`<ul><li><p>Enable scheduled MongoDB backup CronJob</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">cronJob</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">schedule</span><span class="token punctuation">:</span> <span class="token string">&#39;1 0 * * *&#39;</span>
  <span class="token key atrule">retentionDays</span><span class="token punctuation">:</span> <span class="token number">7</span>
  <span class="token key atrule">timeZone</span><span class="token punctuation">:</span> UTC
  <span class="token key atrule">persistence</span><span class="token punctuation">:</span>
    <span class="token key atrule">size</span><span class="token punctuation">:</span> 5Gi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>where</p><ul><li>enabled: whether to enable the MongoDB backup CronJob or not; default to <code>false</code></li><li>schedule: the Unix crontab schedule; default to <code>&#39;1 0 * * *&#39;</code> which runs daily at 12:01AM</li><li>retentionDays: how many days the backup is retained; default to <code>7</code></li><li>timeZone: the Unix TZ environment variable; default to <code>UTC</code></li><li>persistence size: size of PVC; default to <code>5Gi</code></li></ul><p>The CronJob backs up MongoDB to a PVC named after the chart with suffix <em>-cronjob-mongodb-backup</em> and purges backups that are older than <em>retentionDays</em>.</p><p>To facilitate restoration, mount the PVC to MongoDB pod</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>
  <span class="token key atrule">extraVolumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> export
      <span class="token key atrule">persistentVolumeClaim</span><span class="token punctuation">:</span>
        <span class="token key atrule">claimName</span><span class="token punctuation">:</span> &lt;PVC_NAME<span class="token punctuation">&gt;</span>
  <span class="token key atrule">extraVolumeMounts</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> export
      <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /export
      <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Restoration can then be achieved by running in MongoDB pod</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>mongorestore <span class="token parameter variable">-u</span> <span class="token string">&quot;<span class="token variable">$MONGODB_USERNAME</span>&quot;</span> -p<span class="token string">&quot;<span class="token variable">$MONGODB_PASSWORD</span>&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">--uri</span><span class="token operator">=</span><span class="token string">&quot;mongodb://<span class="token variable">$K8S_SERVICE_NAME</span>&quot;</span> <span class="token parameter variable">--db</span> <span class="token variable">$MONGODB_DATABASE</span> <span class="token parameter variable">--gzip</span> <span class="token parameter variable">--drop</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">--archive</span><span class="token operator">=</span>/export/<span class="token operator">&lt;</span>mongodb-backup-YYMMDD-hhmmss.gz<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><em>NotifyBC</em> image tag defaults to latest published version. To change to <em>latest</em>, i.e. tip of the <em>main branch</em>,</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">image</span><span class="token punctuation">:</span>
  <span class="token key atrule">tag</span><span class="token punctuation">:</span> latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Enable autoscaling for app pod</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">autoscaling</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="deploy-docker-container" tabindex="-1"><a class="header-anchor" href="#deploy-docker-container" aria-hidden="true">#</a> Deploy Docker Container</h2><p>If you have git and Docker installed, you can run following command to deploy <em>NotifyBC</em> Docker container:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">--rm</span> <span class="token parameter variable">-dp</span> <span class="token number">3000</span>:3000 ghcr.io/bcgov/notify-bc
<span class="token comment"># open http://localhost:3000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>If successful, similar output is displayed as in source code installation.</p>`,5),wn={__name:"index.html",setup(Cn){const l=d();return(Bn,Sn)=>{const a=i("ExternalLinkIcon");return r(),c("div",null,[m,n("ul",null,[n("li",null,[e("Software "),n("ul",null,[v,n("li",null,[n("a",h,[e("Node.js"),s(a)]),e("@"+p(u(l).packageJson.engines.node),1)]),b])]),n("li",null,[e("Services "),n("ul",null,[k,g,n("li",null,[e("A tcp proxy server such as "),n("a",y,[e("nginx stream proxy"),s(a)]),e(" if list-unsubscribe by email is needed and "),f,e(" server cannot expose port 25 to internet")]),_,x,w,C])]),B]),S,n("p",null,[e("Now open "),n("a",T,[e("http://localhost:3000"),s(a)]),e(". The page displays NotifyBC Web Console.")]),D,n("p",null,[e("after "),N,e(". A list of versions can be found "),n("a",M,[e("here"),s(a)]),e(".")]),I,n("p",null,[e("This will create and start service "),A,e(". To change service name, modify file "),E,e(" before running it. See "),n("a",O,[e("node-windows"),s(a)]),e(" for other operations such as uninstalling the service.")]),z,n("p",null,[R,e(" provides a "),n("a",P,[e("container package"),s(a)]),e(" in GitHub Container Registry and a "),n("a",q,[e("Helm"),s(a)]),e(" chart to facilitate Deploying to Kubernetes. Azure AKS and OpenShift are the two tested platforms. Other Kubernetes platforms are likely to work subject to customizations. Before deploying to AKS, "),n("a",F,[e("create an ingress controller "),s(a)]),e(".")]),K,n("ul",null,[V,n("li",null,[e("Platform-specific CLI such as "),n("a",H,[e("Azure CLI"),s(a)]),e(" or "),n("a",G,[e("OpenShift CLI"),s(a)])]),n("li",null,[n("a",j,[e("Helm CLI"),s(a)])])]),L,n("p",null,[e("Various customizations can be made to chart. Some are platform dependent. To customize, first create a file with extension "),J,e(". The rest of the document assumes the file is "),U,e(". Then add customized parameters to the file. See "),W,e(" and Bitnami MongoDB chart "),n("a",Y,[e("readme"),s(a)]),e(" for customizable parameters. Parameters in "),$,e(" overrides corresponding ones in "),Z,e(". In particular, parameters under "),Q,e(" of "),X,e(" overrides Bitnami MongoDB chart parameters.")]),nn,n("ul",null,[en,n("li",null,[n("p",null,[e("Use "),n("a",an,[e("Let's Encrypt on AKS"),s(a)]),e(". After following the instructions in the link, add following ingress customizations to file "),sn]),tn]),ln,n("li",null,[on,n("p",null,[rn,e(" chart depends on "),n("a",cn,[e("Bitnami MongoDB chart"),s(a)]),e(" for MongoDB database provisioning. All documented parameters are customizable under "),pn,e(". For example, to change "),un,e(" to "),dn]),mn]),n("li",null,[vn,n("p",null,[hn,e(" chart depends on "),n("a",bn,[e("Bitnami Redis chart"),s(a)]),e(" for Redis provisioning. All documented parameters are customizable under "),kn,e(". For example, to set credential")]),gn]),yn]),fn,n("p",null,[e("The above settings assume you have setup secret <docker-pull-secret> to access <artifactory.myOrg.com>. The secret can be created using "),n("a",_n,[e("kubectl"),s(a)]),e(".")]),xn])}}},Dn=o(wn,[["__file","index.html.vue"]]);export{Dn as default};
