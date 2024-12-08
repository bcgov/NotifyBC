import{_ as o,c as n,e as l,a as t,f as i,b as r,d as s,r as d,o as h}from"./app-DnEKRe3o.js";const v={};function p(u,e){const a=d("RouteLink");return h(),n("div",null,[e[17]||(e[17]=l('<h1 id="what-s-new" tabindex="-1"><a class="header-anchor" href="#what-s-new"><span>What&#39;s New</span></a></h1><p><em>NotifyBC</em> uses <a href="https://semver.org/" target="_blank" rel="noopener noreferrer">semantic versioning</a>.</p><h2 id="v6" tabindex="-1"><a class="header-anchor" href="#v6"><span>v6</span></a></h2><ul><li>Replaced Bottleneck with BullMQ</li><li>Redis is required</li><li>Bitnami Redis Helm chart is updated from version 16.13.2 to 20.1.0, with corresponding Redis from 6.2.7 to 7.4.0</li><li>Bitnami MongoDB Helm chart is updated from version 14.3.2 to 16.3.3, with corresponding MongoDB from 7.0.4 to 8.0.4</li><li>Added <code>loggingLevels</code> config</li></ul><h2 id="v5" tabindex="-1"><a class="header-anchor" href="#v5"><span>v5</span></a></h2><h3 id="v5-1-0" tabindex="-1"><a class="header-anchor" href="#v5-1-0"><span>v5.1.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/85" target="_blank" rel="noopener noreferrer">#85</a>: added health check</li><li>Changed package manager from yarn to npm</li></ul><h3 id="v5-0-0" tabindex="-1"><a class="header-anchor" href="#v5-0-0"><span>v5.0.0</span></a></h3>',8)),t("p",null,[e[1]||(e[1]=i("See ")),r(a,{to:"/docs/upgrade/#v4-to-v5"},{default:s(()=>e[0]||(e[0]=[i("Upgrade Guide")])),_:1}),e[2]||(e[2]=i(" for more information."))]),e[18]||(e[18]=l('<ul><li>Runs on <em>NestJS</em></li><li>Bitnami MongoDB Helm chart is updated from version 10.7.1 to 14.3.2, with corresponding MongoDB from 4.4 to 7.0.4</li><li>Bitnami Redis Helm chart is updated from version 14.7.2 to 16.13.2, with corresponding Redis from 6.2.4 to 6.2.7</li></ul><div class="hint-container tip"><p class="hint-container-title">Why v5?</p><p><em>NotifyBC</em> was built on <a href="https://loopback.io/" target="_blank" rel="noopener noreferrer">LoopBack</a> since the beginning. While <em>Loopback</em> is an awesome framework at the time, it is evident by 2022 <em>Loopback</em> is no longer actively maintained</p><ol><li>features such as GraphQL have been in experimental state for years</li><li>recent commits are mostly chores rather than enhancements</li><li>core developers have ceased to contribute</li></ol><p>To pave the way for future growth, switching platform becomes necessary. <em>NestJS</em> was chosen because</p><ol><li>both <em>NestJS</em> and <em>Loopback</em> are server-side Node.js frameworks</li><li><em>NestJS</em> has the closest feature set as <em>Loopback</em>. To a large extent <em>NestJS</em> is a superset of <em>Loopback</em></li><li><em>NestJS</em> incorporates more technologies</li></ol></div><h2 id="v4" tabindex="-1"><a class="header-anchor" href="#v4"><span>v4</span></a></h2><h3 id="v4-1-0" tabindex="-1"><a class="header-anchor" href="#v4-1-0"><span>v4.1.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/50" target="_blank" rel="noopener noreferrer">#50</a>: Email message throttle</li><li>applied sms throttle to all sms messages rather than just broadcast push notification.</li><li>docs updates</li></ul><h3 id="v4-0-0" tabindex="-1"><a class="header-anchor" href="#v4-0-0"><span>v4.0.0</span></a></h3>',6)),t("p",null,[e[4]||(e[4]=i("See ")),r(a,{to:"/docs/upgrade/#v3-to-v4"},{default:s(()=>e[3]||(e[3]=[i("v3 to v4 upgrade guide")])),_:1}),e[5]||(e[5]=i(" for more information."))]),e[19]||(e[19]=l('<ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/48" target="_blank" rel="noopener noreferrer">#48</a>: SMS message throttle</li><li>Re-ordered config file precedence</li><li>Re-organized Email and SMS configs</li><li>docs updates</li></ul><h2 id="v3" tabindex="-1"><a class="header-anchor" href="#v3"><span>v3</span></a></h2><h3 id="v3-1-0" tabindex="-1"><a class="header-anchor" href="#v3-1-0"><span>v3.1.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/45" target="_blank" rel="noopener noreferrer">#45</a>: Reliability - Log skipped dispatches for broadcast push notifications</li><li>docs updates</li></ul><h3 id="v3-0-0" tabindex="-1"><a class="header-anchor" href="#v3-0-0"><span>v3.0.0</span></a></h3>',5)),t("p",null,[e[7]||(e[7]=i("See ")),r(a,{to:"/docs/upgrade/#v2-to-v3"},{default:s(()=>e[6]||(e[6]=[i("v2 to v3 upgrade guide")])),_:1}),e[8]||(e[8]=i(" for more information."))]),e[20]||(e[20]=l('<ul><li>Reliability improvements - issues <a href="https://github.com/bcgov/NotifyBC/issues/36" target="_blank" rel="noopener noreferrer">#36</a>,<a href="https://github.com/bcgov/NotifyBC/issues/37" target="_blank" rel="noopener noreferrer">#37</a>,<a href="https://github.com/bcgov/NotifyBC/issues/38" target="_blank" rel="noopener noreferrer">#38</a>,<a href="https://github.com/bcgov/NotifyBC/issues/39" target="_blank" rel="noopener noreferrer">#39</a>,<a href="https://github.com/bcgov/NotifyBC/issues/40" target="_blank" rel="noopener noreferrer">#40</a>,<a href="https://github.com/bcgov/NotifyBC/issues/41" target="_blank" rel="noopener noreferrer">#41</a>,<a href="https://github.com/bcgov/NotifyBC/issues/42" target="_blank" rel="noopener noreferrer">#42</a></li><li>docs updates</li></ul><h2 id="v2" tabindex="-1"><a class="header-anchor" href="#v2"><span>v2</span></a></h2><h3 id="v2-9-0" tabindex="-1"><a class="header-anchor" href="#v2-9-0"><span>v2.9.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/34" target="_blank" rel="noopener noreferrer">#34</a>: Helm - add k8s cronJob to backup MongoDB</li><li>docs updates</li></ul><h3 id="v2-8-0" tabindex="-1"><a class="header-anchor" href="#v2-8-0"><span>v2.8.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/28" target="_blank" rel="noopener noreferrer">#28</a>: Allow subscription data be used by mail merge dynamic tokens</li><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/32" target="_blank" rel="noopener noreferrer">#32</a>: Allow escape mail merge delimiter</li><li>docs updates</li></ul><h3 id="v2-7-0" tabindex="-1"><a class="header-anchor" href="#v2-7-0"><span>v2.7.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/26" target="_blank" rel="noopener noreferrer">#26</a>: Allow filter specified in a notification</li><li>docs updates</li></ul><h3 id="v2-6-0" tabindex="-1"><a class="header-anchor" href="#v2-6-0"><span>v2.6.0</span></a></h3><ul><li>Helm chart updates</li><li>docs updates</li></ul><h3 id="v2-5-0" tabindex="-1"><a class="header-anchor" href="#v2-5-0"><span>v2.5.0</span></a></h3>',11)),t("ul",null,[t("li",null,[e[10]||(e[10]=i("added ")),e[11]||(e[11]=t("a",{href:"https://github.com/bcgov/NotifyBC/tree/main/helm",target:"_blank",rel:"noopener noreferrer"},"helm chart",-1)),e[12]||(e[12]=i(". See ")),r(a,{to:"/docs/miscellaneous/upgrade.html#openshift-template-to-helm"},{default:s(()=>e[9]||(e[9]=[i("OpenShift template to Helm upgrade guide")])),_:1})]),e[13]||(e[13]=t("li",null,"docs updates",-1))]),e[21]||(e[21]=l('<h3 id="v2-4-0" tabindex="-1"><a class="header-anchor" href="#v2-4-0"><span>v2.4.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/16" target="_blank" rel="noopener noreferrer">#16</a>: Support client certificate authentication</li><li>misc web console adjustments</li><li>docs updates</li></ul><h3 id="v2-3-0" tabindex="-1"><a class="header-anchor" href="#v2-3-0"><span>v2.3.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/15" target="_blank" rel="noopener noreferrer">#15</a>: Support OIDC authentication for both admin and non-admin user</li><li>misc web console adjustments</li><li>docs updates</li></ul><h3 id="v2-2-0" tabindex="-1"><a class="header-anchor" href="#v2-2-0"><span>v2.2.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/14" target="_blank" rel="noopener noreferrer">#14</a>: Support Administrator login, changing password, obtain access token in web console</li><li>misc web console adjustments</li><li>docs updates</li></ul><h3 id="v2-1-0" tabindex="-1"><a class="header-anchor" href="#v2-1-0"><span>v2.1.0</span></a></h3><ul><li>Issue <a href="https://github.com/bcgov/NotifyBC/issues/13" target="_blank" rel="noopener noreferrer">#13</a>: Upgraded Vuetify from v0.16.9 to v2.4.3</li><li>misc web console adjustments</li><li>docs updates</li></ul><h3 id="v2-0-0" tabindex="-1"><a class="header-anchor" href="#v2-0-0"><span>v2.0.0</span></a></h3>',9)),t("p",null,[e[15]||(e[15]=i("See ")),r(a,{to:"/docs/upgrade/#v1-to-v2"},{default:s(()=>e[14]||(e[14]=[i("Upgrade Guide")])),_:1}),e[16]||(e[16]=i(" for more information."))]),e[22]||(e[22]=l('<ul><li>Runs on LoopBack v4</li><li>All code is converted to TypeScript</li><li>Upgraded <a href="https://swagger.io/specification/" target="_blank" rel="noopener noreferrer">OAS</a> from v2 to v3</li><li>Docs is converted from Jekyll to VuePress</li></ul><div class="hint-container tip"><p class="hint-container-title">Why v2?</p><p><em>NotifyBC</em> has been built on Node.js <a href="https://loopback.io/" target="_blank" rel="noopener noreferrer">LoopBack</a> framework since 2016. LoopBack v4, which was released in 2019, is backward incompatible. To keep software stack up-to-date, unless rewriting from scratch, it is necessary to port <em>NotifyBC</em> to LoopBack v4. Great care has been taken to minimize upgrade effort.</p></div>',2))])}const f=o(v,[["render",p],["__file","index.html.vue"]]),m=JSON.parse(`{"path":"/docs/what's-new/","title":"What's New","lang":"en-US","frontmatter":{"permalink":"/docs/what's-new/","next":"/docs/config-overview/"},"headers":[{"level":2,"title":"v6","slug":"v6","link":"#v6","children":[]},{"level":2,"title":"v5","slug":"v5","link":"#v5","children":[{"level":3,"title":"v5.1.0","slug":"v5-1-0","link":"#v5-1-0","children":[]},{"level":3,"title":"v5.0.0","slug":"v5-0-0","link":"#v5-0-0","children":[]}]},{"level":2,"title":"v4","slug":"v4","link":"#v4","children":[{"level":3,"title":"v4.1.0","slug":"v4-1-0","link":"#v4-1-0","children":[]},{"level":3,"title":"v4.0.0","slug":"v4-0-0","link":"#v4-0-0","children":[]}]},{"level":2,"title":"v3","slug":"v3","link":"#v3","children":[{"level":3,"title":"v3.1.0","slug":"v3-1-0","link":"#v3-1-0","children":[]},{"level":3,"title":"v3.0.0","slug":"v3-0-0","link":"#v3-0-0","children":[]}]},{"level":2,"title":"v2","slug":"v2","link":"#v2","children":[{"level":3,"title":"v2.9.0","slug":"v2-9-0","link":"#v2-9-0","children":[]},{"level":3,"title":"v2.8.0","slug":"v2-8-0","link":"#v2-8-0","children":[]},{"level":3,"title":"v2.7.0","slug":"v2-7-0","link":"#v2-7-0","children":[]},{"level":3,"title":"v2.6.0","slug":"v2-6-0","link":"#v2-6-0","children":[]},{"level":3,"title":"v2.5.0","slug":"v2-5-0","link":"#v2-5-0","children":[]},{"level":3,"title":"v2.4.0","slug":"v2-4-0","link":"#v2-4-0","children":[]},{"level":3,"title":"v2.3.0","slug":"v2-3-0","link":"#v2-3-0","children":[]},{"level":3,"title":"v2.2.0","slug":"v2-2-0","link":"#v2-2-0","children":[]},{"level":3,"title":"v2.1.0","slug":"v2-1-0","link":"#v2-1-0","children":[]},{"level":3,"title":"v2.0.0","slug":"v2-0-0","link":"#v2-0-0","children":[]}]}],"git":{},"filePathRelative":"docs/getting-started/what's-new.md"}`);export{f as comp,m as data};
