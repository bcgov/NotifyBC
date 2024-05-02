import{_ as r,r as i,o as p,c,a as e,b as a,d as n,w as t,e as o}from"./app-3fbc716c.js";const d={},u=o('<h1 id="upgrade-guide" tabindex="-1"><a class="header-anchor" href="#upgrade-guide" aria-hidden="true">#</a> Upgrade Guide</h1><p>Major version can only be upgraded incrementally from immediate previous major version, i.e. from <em>N</em> to <em>N+1</em>.</p><h2 id="v1-to-v2" tabindex="-1"><a class="header-anchor" href="#v1-to-v2" aria-hidden="true">#</a> v1 to v2</h2><p>Upgrading <em>NotifyBC</em> from v1 to v2 involves two steps</p><ol><li><a href="#update-your-client-code">Update your client code</a> if needed</li><li><a href="#upgrade-notifybc-server">Upgrade <em>NotifyBC</em> server</a></li></ol><h3 id="update-your-client-code" tabindex="-1"><a class="header-anchor" href="#update-your-client-code" aria-hidden="true">#</a> Update your client code</h3><p><em>NotifyBC</em> v2 introduced backward incompatible API changes documented in the rest of this section. If your client code will be impacted by the changes, update your code to address the incompatibility first.</p><h4 id="query-parameter-array-syntax" tabindex="-1"><a class="header-anchor" href="#query-parameter-array-syntax" aria-hidden="true">#</a> Query parameter array syntax</h4><p>In v1 array can be specified in query parameter using two formats</p><ol><li>by enclosing array elements in square brackets such as <code>&amp;additionalServices=[&quot;s1&quot;,&quot;s2]</code> in one query parameter</li><li>by repeating the query parameters, for example <code>&amp;additionalServices=s1&amp;additionalServices=s2</code></li></ol><p>In v2 only the latter format is supported.</p><h4 id="date-time-fields" tabindex="-1"><a class="header-anchor" href="#date-time-fields" aria-hidden="true">#</a> Date-Time fields</h4><p>In v1 date-time fields can be specified in date-only string such as 2020-01-01. In v2 the field must be specified in ISO 8601 extended format such as 2020-01-01T00:00:00Z.</p><h4 id="return-status-codes" tabindex="-1"><a class="header-anchor" href="#return-status-codes" aria-hidden="true">#</a> Return status codes</h4><p>HTTP response code of success calls to following APIs are changed from 200 to 204</p>',15),m=e("h4",{id:"administrator-api",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#administrator-api","aria-hidden":"true"},"#"),a(" Administrator API")],-1),v=e("em",null,"Administrator",-1),h=e("em",null,"UserCredential",-1),b=o(`<h3 id="upgrade-notifybc-server" tabindex="-1"><a class="header-anchor" href="#upgrade-notifybc-server" aria-hidden="true">#</a> Upgrade <em>NotifyBC</em> server</h3><p>The procedure to upgrade from v1 to v2 depends on how v1 was installed.</p><h4 id="source-code-installation" tabindex="-1"><a class="header-anchor" href="#source-code-installation" aria-hidden="true">#</a> Source-code Installation</h4><ol><li>Stop <em>NotifyBC</em></li><li>Backup app root and database!</li><li>Make sure current branch is tracking correct remote branch<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> remote set-url origin https://github.com/bcgov/NotifyBC.git
<span class="token function">git</span> branch <span class="token parameter variable">-u</span> origin/main
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li>Make a note of any extra packages added to <em>package.json</em></li><li>Run <code>git pull &amp;&amp; git checkout tags/v2.x.x -b &lt;branch_name&gt;</code> from app root, replace <em>v2.x.x</em> with a v2 release, preferably latest, found in GitHub such as <em>v2.9.0</em>.</li><li>Make sure <em>version</em> property in <em>package.json</em> is <em>2.x.x</em></li><li>Add back extra packages noted in step 4</li><li>Move <em>server/config.(local|dev|production).(js|json)</em> to <em>src/</em> if exists</li><li>Move <em>server/datasources.(local|dev|production).(js|json)</em> to <em>src/datasources/db.datasource.(local|dev|production).(js|json)</em> if exists. Notice the file name has changed.</li><li>Move <em>server/middleware.*.(js|json)</em> to <em>src/</em> if exists. Reorganize top level properties to <em>all</em> or <em>apiOnly</em>, where <em>all</em> applies to all requests including web console and <em>apiOnly</em> applies to API requests only. For example, given</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">initial</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">compression</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token string-property property">&#39;routes:before&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">morgan</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>if <em>compression</em> middleware will be applied to all requests and <em>morgan</em> will be applied to API requests only, then change the file to</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">all</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">compression</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">apiOnly</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">morgan</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="11"><li>Run</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> i <span class="token operator">&amp;&amp;</span> <span class="token function">npm</span> run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="11"><li>Start server by running <code>npm run start</code> or Windows Service</li></ol><h4 id="openshift-installation" tabindex="-1"><a class="header-anchor" href="#openshift-installation" aria-hidden="true">#</a> OpenShift Installation</h4>`,11),g=o(`<li><p>Run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git
<span class="token builtin class-name">cd</span> NotifyBC
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc delete bc/notify-bc
oc process <span class="token parameter variable">-f</span> .openshift-templates/notify-bc-build.yml <span class="token operator">|</span> oc create -f-
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>ignore <em>AlreadyExists</em> errors</p></li>`,2),f=e("p",null,"For each environment,",-1),k=o(`<li><p>run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc project <span class="token operator">&lt;</span>yourprojectname-<span class="token operator">&lt;</span>env<span class="token operator">&gt;&gt;</span>
oc delete dc/notify-bc-app dc/notify-bc-cron
oc process <span class="token parameter variable">-f</span> .openshift-templates/notify-bc.yml <span class="token operator">|</span> oc create -f-
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ignore <em>AlreadyExists</em> errors</p></li><li><p>copy value of environment variable <em>MONGODB_USER</em> from <em>mongodb</em> deployment config to the same environment variable of deployment config <em>notify-bc-app</em> and <em>notify-bc-cron</em>, replacing existing value</p></li><li><p>remove <em>middleware.local.json</em> from configMap <em>notify-bc</em></p></li><li><p>add <em>middleware.local.js</em> to configMap <em>notify-bc</em> with following content</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">apiOnly</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">morgan</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,4),y=o('<h2 id="openshift-template-to-helm" tabindex="-1"><a class="header-anchor" href="#openshift-template-to-helm" aria-hidden="true">#</a> OpenShift template to Helm</h2><p>Upgrading <em>NotifyBC</em> on OpenShift created from OpenShift template to Helm involves 2 steps</p><ol><li><a href="#customize-and-install-helm-chart">Customize and Install Helm chart</a></li><li><a href="#migrate-mongodb-data">Migrate MongoDB data</a></li></ol><h3 id="customize-and-install-helm-chart" tabindex="-1"><a class="header-anchor" href="#customize-and-install-helm-chart" aria-hidden="true">#</a> Customize and install Helm chart</h3>',4),_=e("em",null,"helm/values.local.yaml",-1),x=o(`<ul><li><em>notify-bc</em> configMap</li><li>web route host name and certificates</li></ul><p>Then run <code>helm install</code> with documented arguments to install a release.</p><h3 id="migrate-mongodb-data" tabindex="-1"><a class="header-anchor" href="#migrate-mongodb-data" aria-hidden="true">#</a> Migrate MongoDB data</h3><ol><li><p>backup data from source</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>mongodb-pod<span class="token operator">&gt;</span> -- <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&#39;mongodump -u &quot;$MONGODB_USER&quot; \\
-p &quot;$MONGODB_PASSWORD&quot; -d $MONGODB_DATABASE --gzip --archive&#39;</span> <span class="token operator">&gt;</span> notify-bc.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>replace &lt;mongodb-pod&gt; with the mongodb pod name.</p></li><li><p>restore backup to target</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> notify-bc.gz <span class="token operator">|</span> oc <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>mongodb-pod-<span class="token operator"><span class="token file-descriptor important">0</span>&gt;</span> -- <span class="token punctuation">\\</span>
<span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&#39;mongorestore -u &quot;$MONGODB_USERNAME&quot; -p&quot;$MONGODB_PASSWORD&quot; \\
--uri=&quot;mongodb://$K8S_SERVICE_NAME&quot; --db $MONGODB_DATABASE --gzip --drop --archive&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>replace &lt;mongodb-pod-0&gt; with the first pod name in the mongodb stateful set.</p></li></ol><p>If both source and target are in the same OpenShift cluster, the two operations can be combined into one</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>mongodb-pod<span class="token operator">&gt;</span> -- <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&#39;mongodump -u &quot;$MONGODB_USER&quot; \\
-p &quot;$MONGODB_PASSWORD&quot; -d $MONGODB_DATABASE --gzip --archive&#39;</span> <span class="token operator">|</span> <span class="token punctuation">\\</span>
oc <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>mongodb-pod-<span class="token operator"><span class="token file-descriptor important">0</span>&gt;</span> -- <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token punctuation">\\</span>
<span class="token string">&#39;mongorestore -u &quot;$MONGODB_USERNAME&quot; -p&quot;$MONGODB_PASSWORD&quot; \\
--uri=&quot;mongodb://$K8S_SERVICE_NAME&quot; --db $MONGODB_DATABASE --gzip --drop --archive&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="v2-to-v3" tabindex="-1"><a class="header-anchor" href="#v2-to-v3" aria-hidden="true">#</a> v2 to v3</h2><p>v3 introduced following backward incompatible changes</p><ol><li>Changed output-only fields <em>failedDispatches</em> and <em>successDispatches</em> to <em>dispatch.failed</em> and <em>dispatch.successful</em> respectively in <em>Notification</em> api. If your client app depends on the fields, change accordingly.</li><li>Changed config <em>notification.logSuccessfulBroadcastDispatches</em> to <em>notification.guaranteedBroadcastPushDispatchProcessing</em> and reversed default value from <em>false</em> to <em>true</em>. If you don&#39;t want <em>NotifyBC</em> guarantees processing all subscriptions to a broadcast push notification in a node failure resilient way, perhaps for performance reason, set the value to <em>false</em> in file <em>/src/config.local.js</em>.</li></ol><p>After above changes are addressed, upgrading to v3 is as simple as</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v3.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token function">npm</span> i <span class="token operator">&amp;&amp;</span> <span class="token function">npm</span> run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>or, if <em>NotifyBC</em> is deployed to Kubernetes using Helm.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v3.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace <em>v3.x.x</em> with a v3 release, preferably latest, found in GitHub such as <em>v3.1.2</em>.</p><h2 id="v3-to-v4" tabindex="-1"><a class="header-anchor" href="#v3-to-v4" aria-hidden="true">#</a> v3 to v4</h2><p>v4 introduced following backward incompatible changes that need to be addressed in this order</p>`,16),q=o("<li><p>The precedence of config, middleware and datasource files has been changed. Local file takes higher precedence than environment specific file. For example, for config file, the new precedence in ascending order is</p><ol><li>default file <em>/src/config.ts</em></li><li>environment specific file <em>/src/config.&lt;env&gt;.js</em>, where &lt;env&gt; is determined by environment variable <em>NODE_ENV</em></li><li>local file <em>/src/config.local.js</em></li></ol><p>To upgrade, if you have environment specific file, merge its content into the local file, then delete it.</p></li>",1),w=e("em",null,"smtp",-1),S=e("em",null,"email.smtp",-1),B=e("em",null,"inboundSmtpServer",-1),M=e("em",null,"email.inboundSmtpServer",-1),N=e("em",null,"email.inboundSmtpServer.bounce",-1),D=e("em",null,"email.bounce",-1),O=e("li",null,[e("p",null,[a("Config "),e("em",null,"notification.handleBounce"),a(" is changed to "),e("em",null,"email.bounce.enabled"),a(".")])],-1),j=e("em",null,"notification.handleListUnsubscribeByEmail",-1),A=e("em",null,"email.listUnsubscribeByEmail.enabled",-1),C=e("em",null,"smsServiceProvider",-1),I=e("em",null,"sms.provider",-1),E=e("em",null,"sms",-1),P=e("em",null,"sms.providerSettings",-1),$=e("em",null,"sms",-1),R=e("em",null,"provider",-1),T=e("em",null,"providerSettings",-1),U=e("em",null,"throttle",-1),G=e("li",null,[e("p",null,[a("Legacy config "),e("em",null,"subscription.unsubscriptionEmailDomain"),a(" is removed. If you have it defined in your file "),e("em",null,"/src/config.local.js"),a(", replace with "),e("em",null,"email.inboundSmtpServer.domain"),a(".")])],-1),H=e("li",null,[e("p",null,[a("Helm chart added Redis that requires authentication by default. Create a new password in "),e("em",null,"helm/values.local.yaml"),a(" to facilitate upgrading")])],-1),z=o(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">redis</span><span class="token punctuation">:</span>
  <span class="token key atrule">auth</span><span class="token punctuation">:</span>
    <span class="token key atrule">password</span><span class="token punctuation">:</span> <span class="token string">&#39;&lt;secret&gt;&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After above changes are addressed, upgrading to v4 is as simple as</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v4.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token function">npm</span> i <span class="token operator">&amp;&amp;</span> <span class="token function">npm</span> run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>or, if <em>NotifyBC</em> is deployed to Kubernetes using Helm.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v4.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace <em>v4.x.x</em> with a v4 release, preferably latest, found in GitHub such as <em>v4.0.0</em>.</p><h2 id="v4-to-v5" tabindex="-1"><a class="header-anchor" href="#v4-to-v5" aria-hidden="true">#</a> v4 to v5</h2><p>v5 introduced following backward incompatible changes</p>`,8),L=e("li",null,[e("p",null,"Replica set is required for MongoDB. If you deployed NotifyBC using Helm, replica set is already enabled by default.")],-1),F=e("li",null,[e("p",null,[a("If you use default in-memory database, data in "),e("em",null,"server/database/data.json"),a(" will not be migrated automatically. Manually migrate if necessary.")])],-1),V=e("p",null,[a("Update file "),e("em",null,"src/datasources/db.datasource.local.[json|js|ts]")],-1),K=e("li",null,[a("rename "),e("em",null,"url"),a(" property to "),e("em",null,"uri")],-1),W={href:"https://loopback.io/doc/en/lb4/MongoDB-connector.html#creating-a-mongodb-data-source",target:"_blank",rel:"noopener noreferrer"},Q={href:"https://mongoosejs.com/docs/connections.html#options",target:"_blank",rel:"noopener noreferrer"},Z=e("em",null,"host",-1),J=e("em",null,"port",-1),X=e("em",null,"database",-1),Y=e("em",null,"uri",-1),ee=o(`<p>For example, change</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;db&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;connector&quot;</span><span class="token operator">:</span> <span class="token string">&quot;mongodb&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;mongodb://127.0.0.1:27017/notifyBC&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>to</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;uri&quot;</span><span class="token operator">:</span> <span class="token string">&quot;mongodb://127.0.0.1:27017/notifyBC&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you deployed NotifyBC using Helm, this is taken care of.</p>`,5),ae={href:"https://loopback.io/doc/en/lb4/Where-filter.html#operators",target:"_blank",rel:"noopener noreferrer"},ne={href:"https://www.mongodb.com/docs/manual/reference/operator/query/",target:"_blank",rel:"noopener noreferrer"},se=o("<table><thead><tr><th>Loopback operators</th><th>MongoDB operators</th></tr></thead><tbody><tr><td>eq</td><td>$eq</td></tr><tr><td>and</td><td>$and</td></tr><tr><td>or</td><td>$or</td></tr><tr><td>gt, gte</td><td>$gt, $gte</td></tr><tr><td>lt, lte</td><td>$lt, $lte</td></tr><tr><td>between</td><td>(no equivalent, replace with $gt, $and and $lt)</td></tr><tr><td>inq, nin</td><td>$in, $nin</td></tr><tr><td>near</td><td>$near</td></tr><tr><td>neq</td><td>$ne</td></tr><tr><td>like, nlike</td><td>(replace with $regexp)</td></tr><tr><td>like, nlike, options: i</td><td>(replace with $regexp)</td></tr><tr><td>regexp</td><td>$regex</td></tr></tbody></table>",1),te=e("em",null,"order",-1),oe={href:"https://loopback.io/doc/en/lb4/Order-filter.html",target:"_blank",rel:"noopener noreferrer"},le={href:"https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()",target:"_blank",rel:"noopener noreferrer"},ie=o(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET http://localhost:3000/api/configurations?filter={&quot;order&quot;:[&quot;serviceName asc&quot;]}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>change to either</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET http://localhost:3000/api/configurations?filter={&quot;order&quot;:[[&quot;serviceName&quot;,&quot;asc&quot;]]}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>or</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET http://localhost:3000/api/configurations?filter={&quot;order&quot;:&quot;serviceName&quot;}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,5),re=e("li",null,[e("p",null,"In MongoDB administrator collection, email has changed from case-sensitively unique to case-insensitively unique. Make sure administrator emails differ not just by case.")],-1),pe=e("li",null,[e("p",null,[a("When a subscription is created by anonymous user, the "),e("em",null,"data"),a(" field is preserved. In earlier versions this field is deleted.")])],-1),ce=e("li",null,[e("p",null,"Dynamic tokens in subscription confirmation request message and duplicated subscription message are not replaced with subscription data, for example {subscription::...} tokens are left unchanged. Update the template of the two messages if dynamic tokens in them depends on subscription data.")],-1),de=o(`<li><p>If you deployed <em>NotifyBC</em> using Helm, change MongoDB password format in your local values yaml file from</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>
  <span class="token key atrule">auth</span><span class="token punctuation">:</span>
    <span class="token key atrule">rootPassword</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
    <span class="token key atrule">replicaSetKey</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
    <span class="token key atrule">password</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>to</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">mongodb</span><span class="token punctuation">:</span>
  <span class="token key atrule">auth</span><span class="token punctuation">:</span>
    <span class="token key atrule">rootPassword</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
    <span class="token key atrule">replicaSetKey</span><span class="token punctuation">:</span> &lt;secret<span class="token punctuation">&gt;</span>
    <span class="token key atrule">passwords</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> &lt;secret<span class="token punctuation">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),ue=o(`<p>After above changes are addressed, to upgrade <em>NotifyBC</em> to v5,</p><ul><li><p>if <em>NotifyBC</em> is deployed from source code, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v5.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token function">npm</span> i <span class="token operator">&amp;&amp;</span> <span class="token function">npm</span> run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>if <em>NotifyBC</em> is deployed to Kubernetes using Helm,</p><ol><li>backup MongoDB database</li><li>run<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>helm uninstall <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>Replace &lt;release-name&gt; with installed helm release name</li><li>delete PVCs used by MongoDB stateful set</li><li>run<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v5.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
helm <span class="token function">install</span> <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>Replace <ul><li><em>v5.x.x</em> with a v5 release, preferably latest, found in GitHub such as <em>v5.0.0</em>.</li><li>&lt;release-name&gt; with installed helm release name</li><li>&lt;platform&gt; with openshift or aks depending on your platform</li></ul></li><li>restore MongoDB database</li></ol></li></ul>`,2);function me(ve,he){const s=i("RouterLink"),l=i("ExternalLinkIcon");return p(),c("div",null,[u,e("ul",null,[e("li",null,[a("most PATCH by id requests except for "),n(s,{to:"/docs/api-subscription/#update-a-subscription"},{default:t(()=>[a("Update a Subscription ")]),_:1})]),e("li",null,[a("most PUT by id requests except for "),n(s,{to:"/docs/api-subscription/#replace-a-subscription"},{default:t(()=>[a("Replace a Subscription")]),_:1})]),e("li",null,[a("most DELETE by id requests except for "),n(s,{to:"/docs/api-subscription/#delete-a-subscription-unsubscribing"},{default:t(()=>[a("Delete a Subscription (unsubscribing)")]),_:1})])]),m,e("ul",null,[e("li",null,[a("Password is saved to "),v,a(" in v1 and "),h,a(" in v2. Password is not migrated. New password has to be created by following "),n(s,{to:"/docs/api-administrator/#create-update-an-administrator-s-usercredential"},{default:t(()=>[a("Create/Update an Administrator's UserCredential ")]),_:1}),a(".")]),e("li",null,[n(s,{to:"/docs/api/administrator.html#sign-up"},{default:t(()=>[a("Complexity rules")]),_:1}),a(" have been applied to passwords.")]),e("li",null,[n(s,{to:"/docs/api-administrator/#login"},{default:t(()=>[a("login")]),_:1}),a(" API is open to non-admin")])]),b,e("ol",null,[g,e("li",null,[e("p",null,[a("Follow OpenShift "),n(s,{to:"/docs/installation/#build"},{default:t(()=>[a("Build")]),_:1})])]),e("li",null,[f,e("ol",null,[k,e("li",null,[e("p",null,[a("Follow OpenShift "),n(s,{to:"/docs/installation/#deploy"},{default:t(()=>[a("Deploy")]),_:1}),a(" or "),n(s,{to:"/docs/installation/#change-propagation"},{default:t(()=>[a("Change Propagation")]),_:1}),a(" to tag image")])])])])]),y,e("p",null,[a("Follow "),n(s,{to:"/docs/installation/#customizations"},{default:t(()=>[a("customizations")]),_:1}),a(" to create file "),_,a(" containing customized configs such as")]),x,e("ol",null,[q,e("li",null,[e("p",null,[a("Config "),w,a(" is changed to "),S,a(". See "),n(s,{to:"/docs/config/email.html#smtp"},{default:t(()=>[a("SMTP")]),_:1}),a(" for example.")])]),e("li",null,[e("p",null,[a("Config "),B,a(" is changed to "),M,a(". See "),n(s,{to:"/docs/config/email.html#inbound-smtp-server"},{default:t(()=>[a("Inbound SMTP Server")]),_:1}),a(" for example.")])]),e("li",null,[e("p",null,[a("Config "),N,a(" is changed to "),D,a(". See "),n(s,{to:"/docs/config/email.html#bounce"},{default:t(()=>[a("Bounce")]),_:1}),a(" for example.")])]),O,e("li",null,[e("p",null,[a("Config "),j,a(" is changed to "),A,a(". See "),n(s,{to:"/docs/config/email.html#list-unsubscribe-by-email"},{default:t(()=>[a("List-unsubscribe by Email")]),_:1}),a(" for example.")])]),e("li",null,[e("p",null,[a("Config "),C,a(" is changed to "),I,a(". See "),n(s,{to:"/docs/config/sms.html#provider"},{default:t(()=>[a("Provider")]),_:1}),a(" for example.")])]),e("li",null,[e("p",null,[a("SMS service provider specific settings defined in config "),E,a(" are changed to "),P,a(". See "),n(s,{to:"/docs/config/sms.html#provider-settings"},{default:t(()=>[a("Provider Settings")]),_:1}),a(" for example. The config object "),$,a(" now encapsulates all SMS configs - "),R,a(", "),T,a(" and "),U,a(".")])]),G,H]),z,e("ol",null,[L,F,e("li",null,[V,e("ol",null,[K,e("li",null,[a("for other properties, instead of following "),e("a",W,[a("LoopBack MongoDB data source"),n(l)]),a(", follow "),e("a",Q,[a("Mongoose connection options"),n(l)]),a(". In particular, "),Z,a(", "),J,a(" and "),X,a(" properties are no longer supported. Use "),Y,a(" instead.")])]),ee]),e("li",null,[e("p",null,[a("API querying operators have changed. Replace following "),e("a",ae,[a("Loopback operators"),n(l)]),a(" with corresponding "),e("a",ne,[a("MongoDB operators"),n(l)]),a(" at your client-side API call.")]),se]),e("li",null,[e("p",null,[a("API "),te,a(" filter syntax has changed. Replace syntax from "),e("a",oe,[a("Loopback"),n(l)]),a(" to "),e("a",le,[a("Mongoose"),n(l)]),a(" at client-side API call. For example, if your client-side code generates following API call")]),ie]),re,pe,ce,e("li",null,[e("p",null,[n(s,{to:"/docs/config-email/#inbound-smtp-server"},{default:t(()=>[a("Inbound SMTP Server")]),_:1}),a(" no longer accepts command line arguments or environment variables as inputs. All inputs have to be defined in config files shown in the link.")])]),de]),ue])}const ge=r(d,[["render",me],["__file","index.html.vue"]]);export{ge as default};
