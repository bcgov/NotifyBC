import{_ as a,c as o,e as i,a as t,f as n,b as l,d as r,r as d,o as p}from"./app-BS18NLbj.js";const c={};function u(h,e){const s=d("RouteLink");return p(),o("div",null,[e[6]||(e[6]=i(`<h1 id="developer-notes" tabindex="-1"><a class="header-anchor" href="#developer-notes"><span>Developer Notes</span></a></h1><h2 id="setup-development-environment" tabindex="-1"><a class="header-anchor" href="#setup-development-environment"><span>Setup development environment</span></a></h2><p>Install Visual Studio Code and <a href="https://github.com/bcgov/NotifyBC/blob/main/.vscode/extensions.json" target="_blank" rel="noopener noreferrer">recommended extensions</a>.</p><p>Multiple run configs have been created to facilitate debugging server, client, test and docs.</p><div class="hint-container warning"><p class="hint-container-title">Client certificate authentication doesn&#39;t work in client debugger</p><p>Because Vue cli webpack dev server cannot proxy passthrough HTTPS connections, client certificate authentication doesn&#39;t work in client debugger. If testing client certificate authentication in web console is needed, run <code>npm run build</code> to generate prod client distribution and launch server debugger on https://localhost:3000</p></div><h2 id="automated-testing" tabindex="-1"><a class="header-anchor" href="#automated-testing"><span>Automated Testing</span></a></h2><p><em>NotifyBC</em> uses <a href="https://jestjs.io/" target="_blank" rel="noopener noreferrer">Jest</a> test framework bundled in NestJS. To launch test, run <code>npm run test:e2e</code>. A <em>Test</em> launch config is provided to debug in VS Code.</p><p>Github Actions runs tests as part of the build. All test scripts should be able to run unattended, headless, quickly and depend only on local resources.</p><p>To run automated testing on Windows, Docker Desktop needs to be running.</p><h3 id="writing-test-specs" tabindex="-1"><a class="header-anchor" href="#writing-test-specs"><span>Writing Test Specs</span></a></h3><p>Thanks to <a href="https://github.com/visionmedia/supertest" target="_blank" rel="noopener noreferrer">supertest</a> and <a href="https://github.com/nodkz/mongodb-memory-server" target="_blank" rel="noopener noreferrer">MongoDB In-Memory Server</a>, test specs can be written to cover nearly end-to-end request processing workflow (only <em>sendMail</em> and <em>sendSMS</em> need to be mocked). This allows test specs to anchor onto business requirements rather than program units such as functions or files, resulting in regression tests that are more resilient to code refactoring. Whenever possible, a test spec should be written to</p><ul><li>start at a processing phase as early as possible. For example, to test a REST end point, start with the HTTP user request.</li><li>assert outcome of a processing phase as late and down below as possible - the HTTP response body/code, the database record created, for example.</li><li>avoid asserting middleware function input/output to facilitate code refactoring.</li><li>mock email/sms sending function (implemented by default). Inspect the input of the function, or at least assert the function has been called.</li></ul><h2 id="install-docs-website" tabindex="-1"><a class="header-anchor" href="#install-docs-website"><span>Install Docs Website</span></a></h2><p>If you want to contribute to <em>NotifyBC</em> docs beyond simple fix ups, run</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token builtin class-name">cd</span> docs <span class="token operator">&amp;&amp;</span> <span class="token function">npm</span> <span class="token function">install</span> <span class="token operator">&amp;&amp;</span> <span class="token function">npm</span> run dev</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>If everything goes well, the last line of the output will be</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">&gt; VuePress dev server listening at http://localhost:8080/NotifyBC/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>You can now browse to the local docs site <a href="http://localhost:8080/NotifyBC/" target="_blank" rel="noopener noreferrer">http://localhost:8080/NotifyBC</a></p><h2 id="publish-version-checklist" tabindex="-1"><a class="header-anchor" href="#publish-version-checklist"><span>Publish Version Checklist</span></a></h2>`,19)),t("ol",null,[e[3]||(e[3]=t("li",null,[n("update "),t("em",null,"version"),n(" in "),t("em",null,"package.json")],-1)),e[4]||(e[4]=t("li",null,[n("update "),t("em",null,"version"),n(),t("em",null,"appVersion"),n(" in "),t("em",null,"helm/Chart.yaml"),n(" (major/minor only)")],-1)),t("li",null,[e[1]||(e[1]=n("update ")),l(s,{to:"/docs/getting-started/what's-new.html"},{default:r(()=>e[0]||(e[0]=[n("What's new")])),_:1}),e[2]||(e[2]=n(" (major/minor only)"))]),e[5]||(e[5]=t("li",null,"create a new Github release",-1))])])}const b=a(c,[["render",u],["__file","index.html.vue"]]),g=JSON.parse('{"path":"/docs/developer-notes/","title":"Developer Notes","lang":"en-US","frontmatter":{"permalink":"/docs/developer-notes/"},"headers":[{"level":2,"title":"Setup development environment","slug":"setup-development-environment","link":"#setup-development-environment","children":[]},{"level":2,"title":"Automated Testing","slug":"automated-testing","link":"#automated-testing","children":[{"level":3,"title":"Writing Test Specs","slug":"writing-test-specs","link":"#writing-test-specs","children":[]}]},{"level":2,"title":"Install Docs Website","slug":"install-docs-website","link":"#install-docs-website","children":[]},{"level":2,"title":"Publish Version Checklist","slug":"publish-version-checklist","link":"#publish-version-checklist","children":[]}],"git":{},"filePathRelative":"docs/miscellaneous/developer-notes.md"}');export{b as comp,g as data};
