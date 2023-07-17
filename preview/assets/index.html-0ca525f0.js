import{_ as o,r as l,o as r,c as p,a,b as e,d as s,w as t,e as i}from"./app-36923215.js";const c={},d=i('<h1 id="upgrade-guide" tabindex="-1"><a class="header-anchor" href="#upgrade-guide" aria-hidden="true">#</a> Upgrade Guide</h1><h2 id="v1-to-v2" tabindex="-1"><a class="header-anchor" href="#v1-to-v2" aria-hidden="true">#</a> v1 to v2</h2><p>Upgrading <em>NotifyBC</em> from v1 to v2 involves two steps</p><ol><li><a href="#update-your-client-code">Update your client code</a> if needed</li><li><a href="#upgrade-notifybc-server">Upgrade <em>NotifyBC</em> server</a></li></ol><h3 id="update-your-client-code" tabindex="-1"><a class="header-anchor" href="#update-your-client-code" aria-hidden="true">#</a> Update your client code</h3><p><em>NotifyBC</em> v2 introduced backward incompatible API changes documented in the rest of this section. If your client code will be impacted by the changes, update your code to address the incompatibility first.</p><h4 id="query-parameter-array-syntax" tabindex="-1"><a class="header-anchor" href="#query-parameter-array-syntax" aria-hidden="true">#</a> Query parameter array syntax</h4><p>In v1 array can be specified in query parameter using two formats</p><ol><li>by enclosing array elements in square brackets such as <code>&amp;additionalServices=[&quot;s1&quot;,&quot;s2]</code> in one query parameter</li><li>by repeating the query parameters, for example <code>&amp;additionalServices=s1&amp;additionalServices=s2</code></li></ol><p>In v2 only the latter format is supported.</p><h4 id="date-time-fields" tabindex="-1"><a class="header-anchor" href="#date-time-fields" aria-hidden="true">#</a> Date-Time fields</h4><p>In v1 date-time fields can be specified in date-only string such as 2020-01-01. In v2 the field must be specified in ISO 8601 extended format such as 2020-01-01T00:00:00Z.</p><h4 id="return-status-codes" tabindex="-1"><a class="header-anchor" href="#return-status-codes" aria-hidden="true">#</a> Return status codes</h4><p>HTTP response code of success calls to following APIs are changed from 200 to 204</p>',14),u=a("h4",{id:"administrator-api",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#administrator-api","aria-hidden":"true"},"#"),e(" Administrator API")],-1),m=a("em",null,"Administrator",-1),v=a("em",null,"UserCredential",-1),h=i(`<h3 id="upgrade-notifybc-server" tabindex="-1"><a class="header-anchor" href="#upgrade-notifybc-server" aria-hidden="true">#</a> Upgrade <em>NotifyBC</em> server</h3><p>The procedure to upgrade from v1 to v2 depends on how v1 was installed.</p><h4 id="source-code-installation" tabindex="-1"><a class="header-anchor" href="#source-code-installation" aria-hidden="true">#</a> Source-code Installation</h4><ol><li>Stop <em>NotifyBC</em></li><li>Backup app root and database!</li><li>Make sure current branch is tracking correct remote branch<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> remote set-url origin https://github.com/bcgov/NotifyBC.git
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="11"><li>Run</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="11"><li>Start server by running <code>yarn start</code> or Windows Service</li></ol><h4 id="openshift-installation" tabindex="-1"><a class="header-anchor" href="#openshift-installation" aria-hidden="true">#</a> OpenShift Installation</h4>`,11),b=i(`<li><p>Run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/bcgov/NotifyBC.git
<span class="token builtin class-name">cd</span> NotifyBC
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc delete bc/notify-bc
oc process <span class="token parameter variable">-f</span> .openshift-templates/notify-bc-build.yml <span class="token operator">|</span> oc create -f-
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>ignore <em>AlreadyExists</em> errors</p></li>`,2),g=a("p",null,"For each environment,",-1),f=i(`<li><p>run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc project <span class="token operator">&lt;</span>yourprojectname-<span class="token operator">&lt;</span>env<span class="token operator">&gt;&gt;</span>
oc delete dc/notify-bc-app dc/notify-bc-cron
oc process <span class="token parameter variable">-f</span> .openshift-templates/notify-bc.yml <span class="token operator">|</span> oc create -f-
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>ignore <em>AlreadyExists</em> errors</p></li><li><p>copy value of environment variable <em>MONGODB_USER</em> from <em>mongodb</em> deployment config to the same environment variable of deployment config <em>notify-bc-app</em> and <em>notify-bc-cron</em>, replacing existing value</p></li><li><p>remove <em>middleware.local.json</em> from configMap <em>notify-bc</em></p></li><li><p>add <em>middleware.local.js</em> to configMap <em>notify-bc</em> with following content</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">apiOnly</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">morgan</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">enabled</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,4),k=i('<h2 id="openshift-template-to-helm" tabindex="-1"><a class="header-anchor" href="#openshift-template-to-helm" aria-hidden="true">#</a> OpenShift template to Helm</h2><p>Upgrading <em>NotifyBC</em> on OpenShift created from OpenShift template to Helm involves 2 steps</p><ol><li><a href="#customize-and-install-helm-chart">Customize and Install Helm chart</a></li><li><a href="#migrate-mongodb-data">Migrate MongoDB data</a></li></ol><h3 id="customize-and-install-helm-chart" tabindex="-1"><a class="header-anchor" href="#customize-and-install-helm-chart" aria-hidden="true">#</a> Customize and install Helm chart</h3>',4),y=a("em",null,"helm/values.local.yaml",-1),_=i(`<ul><li><em>notify-bc</em> configMap</li><li>web route host name and certificates</li></ul><p>Then run <code>helm install</code> with documented arguments to install a release.</p><h3 id="migrate-mongodb-data" tabindex="-1"><a class="header-anchor" href="#migrate-mongodb-data" aria-hidden="true">#</a> Migrate MongoDB data</h3><ol><li><p>backup data from source</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>oc <span class="token builtin class-name">exec</span> <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>mongodb-pod<span class="token operator">&gt;</span> -- <span class="token function">bash</span> <span class="token parameter variable">-c</span> <span class="token string">&#39;mongodump -u &quot;$MONGODB_USER&quot; \\
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
<span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>or, if <em>NotifyBC</em> is deployed to Kubernetes using Helm.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v3.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace <em>v3.x.x</em> with a v3 release, preferably latest, found in GitHub such as <em>v3.1.2</em>.</p><h2 id="v3-to-v4" tabindex="-1"><a class="header-anchor" href="#v3-to-v4" aria-hidden="true">#</a> v3 to v4</h2><p>v4 introduced following backward incompatible changes that need to be addressed in this order</p>`,16),x=i("<li><p>The precedence of config, middleware and datasource files has been changed. Local file takes higher precedence than environment specific file. For example, for config file, the new precedence in ascending order is</p><ol><li>default file <em>/src/config.ts</em></li><li>environment specific file <em>/src/config.&lt;env&gt;.js</em>, where &lt;env&gt; is determined by environment variable <em>NODE_ENV</em></li><li>local file <em>/src/config.local.js</em></li></ol><p>To upgrade, if you have environment specific file, merge its content into the local file, then delete it.</p></li>",1),S=a("em",null,"smtp",-1),w=a("em",null,"email.smtp",-1),O=a("em",null,"inboundSmtpServer",-1),B=a("em",null,"email.inboundSmtpServer",-1),N=a("em",null,"email.inboundSmtpServer.bounce",-1),q=a("em",null,"email.bounce",-1),A=a("li",null,[a("p",null,[e("Config "),a("em",null,"notification.handleBounce"),e(" is changed to "),a("em",null,"email.bounce.enabled"),e(".")])],-1),M=a("em",null,"notification.handleListUnsubscribeByEmail",-1),C=a("em",null,"email.listUnsubscribeByEmail.enabled",-1),D=a("em",null,"smsServiceProvider",-1),E=a("em",null,"sms.provider",-1),j=a("em",null,"sms",-1),P=a("em",null,"sms.providerSettings",-1),R=a("em",null,"sms",-1),I=a("em",null,"provider",-1),T=a("em",null,"providerSettings",-1),U=a("em",null,"throttle",-1),G=a("li",null,[a("p",null,[e("Legacy config "),a("em",null,"subscription.unsubscriptionEmailDomain"),e(" is removed. If you have it defined in your file "),a("em",null,"/src/config.local.js"),e(", replace with "),a("em",null,"email.inboundSmtpServer.domain"),e(".")])],-1),z=a("li",null,[a("p",null,[e("Helm chart added Redis that requires authentication by default. Create a new password in "),a("em",null,"helm/values.local.yaml"),e(" to facilitate upgrading")])],-1),$=i(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># in file helm/values.local.yaml</span>
<span class="token key atrule">redis</span><span class="token punctuation">:</span>
  <span class="token key atrule">auth</span><span class="token punctuation">:</span>
    <span class="token key atrule">password</span><span class="token punctuation">:</span> <span class="token string">&#39;&lt;secret&gt;&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>After above changes are addressed, upgrading to v4 is as simple as</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v4.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token function">yarn</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">yarn</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>or, if <em>NotifyBC</em> is deployed to Kubernetes using Helm.</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> pull
<span class="token function">git</span> checkout tags/v4.x.x <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
helm upgrade <span class="token operator">&lt;</span>release-name<span class="token operator">&gt;</span> <span class="token parameter variable">-f</span> helm/platform-specific/<span class="token operator">&lt;</span>platform<span class="token operator">&gt;</span>.yaml <span class="token parameter variable">-f</span> helm/values.local.yaml helm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Replace <em>v4.x.x</em> with a v4 release, preferably latest, found in GitHub such as <em>v4.0.0</em>.</p>`,6);function H(L,V){const n=l("RouterLink");return r(),p("div",null,[d,a("ul",null,[a("li",null,[e("most PATCH by id requests except for "),s(n,{to:"/docs/api-subscription/#update-a-subscription"},{default:t(()=>[e("Update a Subscription ")]),_:1})]),a("li",null,[e("most PUT by id requests except for "),s(n,{to:"/docs/api-subscription/#replace-a-subscription"},{default:t(()=>[e("Replace a Subscription")]),_:1})]),a("li",null,[e("most DELETE by id requests except for "),s(n,{to:"/docs/api-subscription/#delete-a-subscription-unsubscribing"},{default:t(()=>[e("Delete a Subscription (unsubscribing)")]),_:1})])]),u,a("ul",null,[a("li",null,[e("Password is saved to "),m,e(" in v1 and "),v,e(" in v2. Password is not migrated. New password has to be created by following "),s(n,{to:"/docs/api-administrator/#create-update-an-administrator-s-usercredential"},{default:t(()=>[e("Create/Update an Administrator's UserCredential ")]),_:1}),e(".")]),a("li",null,[s(n,{to:"/docs/api/administrator.html#sign-up"},{default:t(()=>[e("Complexity rules")]),_:1}),e(" have been applied to passwords.")]),a("li",null,[s(n,{to:"/docs/api-administrator/#login"},{default:t(()=>[e("login")]),_:1}),e(" API is open to non-admin")])]),h,a("ol",null,[b,a("li",null,[a("p",null,[e("Follow OpenShift "),s(n,{to:"/docs/installation/#build"},{default:t(()=>[e("Build")]),_:1})])]),a("li",null,[g,a("ol",null,[f,a("li",null,[a("p",null,[e("Follow OpenShift "),s(n,{to:"/docs/installation/#deploy"},{default:t(()=>[e("Deploy")]),_:1}),e(" or "),s(n,{to:"/docs/installation/#change-propagation"},{default:t(()=>[e("Change Propagation")]),_:1}),e(" to tag image")])])])])]),k,a("p",null,[e("Follow "),s(n,{to:"/docs/installation/#customizations"},{default:t(()=>[e("customizations")]),_:1}),e(" to create file "),y,e(" containing customized configs such as")]),_,a("ol",null,[x,a("li",null,[a("p",null,[e("Config "),S,e(" is changed to "),w,e(". See "),s(n,{to:"/docs/config/email.html#smtp"},{default:t(()=>[e("SMTP")]),_:1}),e(" for example.")])]),a("li",null,[a("p",null,[e("Config "),O,e(" is changed to "),B,e(". See "),s(n,{to:"/docs/config/email.html#inbound-smtp-server"},{default:t(()=>[e("Inbound SMTP Server")]),_:1}),e(" for example.")])]),a("li",null,[a("p",null,[e("Config "),N,e(" is changed to "),q,e(". See "),s(n,{to:"/docs/config/email.html#bounce"},{default:t(()=>[e("Bounce")]),_:1}),e(" for example.")])]),A,a("li",null,[a("p",null,[e("Config "),M,e(" is changed to "),C,e(". See "),s(n,{to:"/docs/config/email.html#list-unsubscribe-by-email"},{default:t(()=>[e("List-unsubscribe by Email")]),_:1}),e(" for example.")])]),a("li",null,[a("p",null,[e("Config "),D,e(" is changed to "),E,e(". See "),s(n,{to:"/docs/config/sms.html#provider"},{default:t(()=>[e("Provider")]),_:1}),e(" for example.")])]),a("li",null,[a("p",null,[e("SMS service provider specific settings defined in config "),j,e(" are changed to "),P,e(". See "),s(n,{to:"/docs/config/sms.html#provider-settings"},{default:t(()=>[e("Provider Settings")]),_:1}),e(" for example. The config object "),R,e(" now encapsulates all SMS configs - "),I,e(", "),T,e(" and "),U,e(".")])]),G,z]),$])}const W=o(c,[["render",H],["__file","index.html.vue"]]);export{W as default};
