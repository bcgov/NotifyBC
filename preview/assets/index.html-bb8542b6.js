import{_ as e,o as a,c as n,e as o}from"./app-d3ea43be.js";const s={},t=o(`<h1 id="memory-dump" tabindex="-1"><a class="header-anchor" href="#memory-dump" aria-hidden="true">#</a> Memory Dump</h1><p>To troubleshoot memory related issues, Super-admin can get a memory dump of <em>NotifyBC</em> by querying <code>/memory</code> API end point. For example</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-s</span> http://localhost:3000/api/memory
Heap.20240513.114015.22037.0.001.heapsnapshot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>The output is the file name of the memory dump. The dump file can be loaded by, for example, Chrome DevTools.</p><p><em>fileName</em> query parameter can be used to specify the file path and name</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-s</span> http://localhost:3000/api/memory?fileName<span class="token operator">=</span>/tmp/my.heapsnapshot
/tmp/my.heapsnapshot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">How to get memory dump of a particular node?</p><p>If you call <code>/memory</code> from a client-facing URL end point, which is usually load balanced, the memory dump occurs only on node handling your request. To perform it on the node you want to troubleshoot, in particular the <em>primary</em> node, run the command from the node. Make sure 127.0.0.1 is in <em>adminIps</em>.</p></div>`,7),r=[t];function i(m,d){return a(),n("div",null,r)}const c=e(s,[["render",i],["__file","index.html.vue"]]);export{c as default};