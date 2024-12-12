import{_ as a,c as n,e as i,o as t}from"./app-BS18NLbj.js";const s={};function l(r,e){return t(),n("div",null,e[0]||(e[0]=[i(`<h1 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration"><span>Configuration</span></a></h1><p>The configuration API, accessible by only super-admin requests, is used to define dynamic configurations. Dynamic configuration is needed in situations like</p><ul><li>RSA key pair generated automatically at boot time if not present</li><li>service-specific subscription confirmation request message template</li></ul><h2 id="model-schema" tabindex="-1"><a class="header-anchor" href="#model-schema"><span>Model Schema</span></a></h2><p>The API operates on following configuration data model fields:</p><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p><p class="description">config id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">name</p><p class="description">config name</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">value</p><div class="description">config value. </div></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">serviceName</p><p class="description">name of the service the config applicable to</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h2 id="get-configurations" tabindex="-1"><a class="header-anchor" href="#get-configurations"><span>Get Configurations</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">GET /configurations</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p>a filter containing properties <em>where</em>, <em>fields</em>, <em>order</em>, <em>skip</em>, and <em>limit</em></p><ul><li>parameter name: filter</li><li>required: false</li><li>parameter type: query</li><li>data type: object</li></ul><p>The filter can be expressed as either</p><ol><li>URL-encoded stringified JSON object (see example below); or</li><li>in the format supported by <a href="https://github.com/ljharb/qs" target="_blank" rel="noopener noreferrer">qs</a>, for example <code>?filter[where][created][$gte]=&quot;2023-01-01&quot;&amp;filter[where][created][$lt]=&quot;2024-01-01&quot;</code></li></ol><p>Regardless, the filter will have to be parsed into a JSON object conforming to</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;where&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;fields&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;order&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;skip&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;limit&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>All properties are optional. The syntax for each property is documented, respectively</p><ul><li>for <em>where</em> , see MongoDB <a href="https://www.mongodb.com/docs/manual/tutorial/query-documents/" target="_blank" rel="noopener noreferrer">Query Documents</a></li><li>for <em>fields</em> , see Mongoose <a href="https://mongoosejs.com/docs/api/query.html#Query.prototype.select()" target="_blank" rel="noopener noreferrer">select</a></li><li>for <em>order</em>, see Mongoose <a href="https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()" target="_blank" rel="noopener noreferrer">sort</a></li><li>for <em>skip</em>, see MongoDB <a href="https://www.mongodb.com/docs/manual/reference/method/cursor.skip/" target="_blank" rel="noopener noreferrer">cursor.skip</a></li><li>for <em>limit</em>, see MongoDB <a href="https://www.mongodb.com/docs/manual/reference/method/cursor.limit/" target="_blank" rel="noopener noreferrer">cursor.limit</a></li></ul></li></ul></li><li><p>outcome</p><p>For admin request, a list of config items matching the filter; forbidden for user request</p></li><li><p>example</p><p>to retrieve configs created in year 2023, run</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token parameter variable">--header</span> <span class="token string">&#39;Accept: application/json&#39;</span> <span class="token string">&#39;http://localhost:3000/api/configurations?filter=%7B%22where%22%3A%7B%22created%22%3A%7B%22%24gte%22%3A%222023-01-01%22%2C%22%24lt%22%3A%222024-01-01%22%7D%7D%7D&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>the value of the filter query parameter is URL-encoded stringified JSON object</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;where&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;$gte&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2023-01-01&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;$lt&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2024-01-01&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="create-a-configuration" tabindex="-1"><a class="header-anchor" href="#create-a-configuration"><span>Create a Configuration</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">POST /configurations</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>an object containing configuration data model fields. At a minimum all required fields that don&#39;t have a default value must be supplied. Id field should be omitted since it&#39;s auto-generated. The API explorer only created an empty object for field <em>value</em> but you should populate the child fields. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> performs following actions in sequence</p><ol><li>if it’s a user request, error is returned</li><li>inputs are validated. For example, required fields without default values must be populated. If validation fails, error is returned</li><li>if config item is <em>notification</em> with field <em>value.rss</em> populated, and if the field <em>value.httpHost</em> is missing, it is generated using this request&#39;s HTTP protocol , host name and port.</li><li>item is saved to database</li></ol></li></ul><ul><li><p>example</p><p>see the cURL command on how to create a <a href="../config-subscription#subscription-confirmation-request-template">dynamic subscription config</a></p></li></ul><h2 id="update-a-configuration" tabindex="-1"><a class="header-anchor" href="#update-a-configuration"><span>Update a Configuration</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">PATCH /configurations/{id}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>an object containing fields to be updated. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>Similar to <em>POST</em> except field <em>update</em> is always updated with current timestamp.</p></li></ul><h2 id="update-configurations" tabindex="-1"><a class="header-anchor" href="#update-configurations"><span>Update Configurations</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">PATCH /configurations</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p>a <em>where</em> query parameter with value conforming to MongoDB <a href="https://www.mongodb.com/docs/manual/tutorial/query-documents/" target="_blank" rel="noopener noreferrer">Query Documents</a></p><ul><li>parameter name: where</li><li>required: false</li><li>parameter type: query</li><li>data type: object</li></ul><p>The value can be expressed as either</p><ol><li>URL-encoded stringified JSON object (see example below); or</li><li>in the format supported by <a href="https://github.com/ljharb/qs" target="_blank" rel="noopener noreferrer">qs</a>, for example <code>?where[created][$gte]=&quot;2023-01-01&quot;&amp;where[created][$lt]=&quot;2024-01-01&quot;</code></li></ol></li><li><p>an object containing fields to be updated.</p><ul><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>Similar to <em>POST</em> except field <em>update</em> is always updated with current timestamp.</p></li><li><p>example</p><p>to set <em>serviceName</em> to <em>myService</em> for all configs created in year 2023 , run</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">curl</span> <span class="token parameter variable">-X</span> PATCH <span class="token parameter variable">--header</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token string">&#39;http://localhost:3000/api/configurations?where=%7B%22created%22%3A%7B%22%24gte%22%3A%222023-01-01%22%2C%22%24lt%22%3A%222024-01-01%22%7D%7D&#39;</span> <span class="token parameter variable">-d</span> @- <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">{</span>
<span class="line">  &quot;serviceName&quot;: &quot;myService&quot;,</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>the value of the <em>where</em> query parameter is URL-encoded stringified JSON object</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;$gte&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2023-01-01&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;$lt&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2024-01-01&quot;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="delete-a-configuration" tabindex="-1"><a class="header-anchor" href="#delete-a-configuration"><span>Delete a Configuration</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">DELETE /configurations/{id}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><p>For admin request, delete the config item requested; forbidden for user request</p></li></ul><h2 id="replace-a-configuration" tabindex="-1"><a class="header-anchor" href="#replace-a-configuration"><span>Replace a Configuration</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">PUT /configurations/{id}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>This API is intended to be only used by admin web console to modify a configuration.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>configuration data <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>For admin requests, replace configuration identified by <em>id</em> with parameter <em>data</em> and save to database.</p></li></ul>`,26)]))}const p=a(s,[["render",l],["__file","index.html.vue"]]),d=JSON.parse('{"path":"/docs/api-config/","title":"Configuration","lang":"en-US","frontmatter":{"permalink":"/docs/api-config/"},"headers":[{"level":2,"title":"Model Schema","slug":"model-schema","link":"#model-schema","children":[]},{"level":2,"title":"Get Configurations","slug":"get-configurations","link":"#get-configurations","children":[]},{"level":2,"title":"Create a Configuration","slug":"create-a-configuration","link":"#create-a-configuration","children":[]},{"level":2,"title":"Update a Configuration","slug":"update-a-configuration","link":"#update-a-configuration","children":[]},{"level":2,"title":"Update Configurations","slug":"update-configurations","link":"#update-configurations","children":[]},{"level":2,"title":"Delete a Configuration","slug":"delete-a-configuration","link":"#delete-a-configuration","children":[]},{"level":2,"title":"Replace a Configuration","slug":"replace-a-configuration","link":"#replace-a-configuration","children":[]}],"git":{},"filePathRelative":"docs/api/config.md"}');export{p as comp,d as data};