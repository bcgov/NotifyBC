import{_ as s,r as l,o as r,c as o,a as e,b as t,d as n,e as i}from"./app-18cb9bdb.js";const d={},p=i(`<h1 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h1><p>The configuration API, accessible by only super-admin requests, is used to define dynamic configurations. Dynamic configuration is needed in situations like</p><ul><li>RSA key pair generated automatically at boot time if not present</li><li>service-specific subscription confirmation request message template</li></ul><h2 id="model-schema" tabindex="-1"><a class="header-anchor" href="#model-schema" aria-hidden="true">#</a> Model Schema</h2><p>The API operates on following configuration data model fields:</p><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p><p class="description">config id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">name</p><p class="description">config name</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">value</p><div class="description">config value. </div></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">serviceName</p><p class="description">name of the service the config applicable to</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h2 id="get-configurations" tabindex="-1"><a class="header-anchor" href="#get-configurations" aria-hidden="true">#</a> Get Configurations</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /configurations
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,8),u=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),c=e("p",null,"inputs",-1),m=i("<p>a filter containing properties <em>where</em>, <em>fields</em>, <em>order</em>, <em>skip</em>, and <em>limit</em></p><ul><li>parameter name: filter</li><li>required: false</li><li>parameter type: query</li><li>data type: object</li></ul><p>The filter can be expressed as either</p>",3),h=e("li",null,"URL-encoded stringified JSON object (see example below); or",-1),f={href:"https://github.com/ljharb/qs",target:"_blank",rel:"noopener noreferrer"},g=e("code",null,'?filter[where][created][$gte]="2023-01-01"&filter[where][created][$lt]="2024-01-01"',-1),b=i(`<p>Regardless, the filter will have to be parsed into a JSON object conforming to</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;where&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">&quot;fields&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span>
    <span class="token property">&quot;order&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span>
    <span class="token property">&quot;skip&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span>
    <span class="token property">&quot;limit&quot;</span><span class="token operator">:</span> ...<span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>All properties are optional. The syntax for each property is documented, respectively</p>`,3),v=e("em",null,"where",-1),_={href:"https://www.mongodb.com/docs/manual/tutorial/query-documents/",target:"_blank",rel:"noopener noreferrer"},k=e("em",null,"fields",-1),q={href:"https://mongoosejs.com/docs/api/query.html#Query.prototype.select()",target:"_blank",rel:"noopener noreferrer"},y=e("em",null,"order",-1),x={href:"https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()",target:"_blank",rel:"noopener noreferrer"},w=e("em",null,"skip",-1),j={href:"https://www.mongodb.com/docs/manual/reference/method/cursor.skip/",target:"_blank",rel:"noopener noreferrer"},T=e("em",null,"limit",-1),A={href:"https://www.mongodb.com/docs/manual/reference/method/cursor.limit/",target:"_blank",rel:"noopener noreferrer"},C=i(`<li><p>outcome</p><p>For admin request, a list of config items matching the filter; forbidden for user request</p></li><li><p>example</p><p>to retrieve configs created in year 2023, run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token parameter variable">--header</span> <span class="token string">&#39;Accept: application/json&#39;</span> <span class="token string">&#39;http://localhost:3000/api/configurations?filter=%7B%22where%22%3A%7B%22created%22%3A%7B%22%24gte%22%3A%222023-01-01%22%2C%22%24lt%22%3A%222024-01-01%22%7D%7D%7D&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>the value of the filter query parameter is URL-encoded stringified JSON object</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;where&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">&quot;$gte&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2023-01-01&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;$lt&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2024-01-01&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,2),S=i(`<h2 id="create-a-configuration" tabindex="-1"><a class="header-anchor" href="#create-a-configuration" aria-hidden="true">#</a> Create a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /configurations
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>an object containing configuration data model fields. At a minimum all required fields that don&#39;t have a default value must be supplied. Id field should be omitted since it&#39;s auto-generated. The API explorer only created an empty object for field <em>value</em> but you should populate the child fields. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> performs following actions in sequence</p><ol><li>if it’s a user request, error is returned</li><li>inputs are validated. For example, required fields without default values must be populated. If validation fails, error is returned</li><li>if config item is <em>notification</em> with field <em>value.rss</em> populated, and if the field <em>value.httpHost</em> is missing, it is generated using this request&#39;s HTTP protocol , host name and port.</li><li>item is saved to database</li></ol></li></ul><ul><li><p>example</p><p>see the cURL command on how to create a <a href="../config-subscription#subscription-confirmation-request-template">dynamic subscription config</a></p></li></ul><h2 id="update-a-configuration" tabindex="-1"><a class="header-anchor" href="#update-a-configuration" aria-hidden="true">#</a> Update a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /configurations/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>an object containing fields to be updated. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>Similar to <em>POST</em> except field <em>update</em> is always updated with current timestamp.</p></li></ul><h2 id="update-configurations" tabindex="-1"><a class="header-anchor" href="#update-configurations" aria-hidden="true">#</a> Update Configurations</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /configurations
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,9),D=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),N=e("p",null,"inputs",-1),B=e("em",null,"where",-1),P={href:"https://www.mongodb.com/docs/manual/tutorial/query-documents/",target:"_blank",rel:"noopener noreferrer"},E=e("ul",null,[e("li",null,"parameter name: where"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),O=e("p",null,"The value can be expressed as either",-1),I=e("li",null,"URL-encoded stringified JSON object (see example below); or",-1),L={href:"https://github.com/ljharb/qs",target:"_blank",rel:"noopener noreferrer"},R=e("code",null,'?where[created][$gte]="2023-01-01"&where[created][$lt]="2024-01-01"',-1),U=e("li",null,[e("p",null,"an object containing fields to be updated."),e("ul",null,[e("li",null,"required: true"),e("li",null,"parameter type: body"),e("li",null,"data type: object")])],-1),$=i(`<li><p>outcome</p><p>Similar to <em>POST</em> except field <em>update</em> is always updated with current timestamp.</p></li><li><p>example</p><p>to set <em>serviceName</em> to <em>myService</em> for all configs created in year 2023 , run</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> PATCH <span class="token parameter variable">--header</span> <span class="token string">&#39;Content-Type: application/json&#39;</span> <span class="token string">&#39;http://localhost:3000/api/configurations?where=%7B%22created%22%3A%7B%22%24gte%22%3A%222023-01-01%22%2C%22%24lt%22%3A%222024-01-01%22%7D%7D&#39;</span> <span class="token parameter variable">-d</span> @- <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
{
  &quot;serviceName&quot;: &quot;myService&quot;,
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>the value of the <em>where</em> query parameter is URL-encoded stringified JSON object</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;$gte&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2023-01-01&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;$lt&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2024-01-01&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,2),M=i(`<h2 id="delete-a-configuration" tabindex="-1"><a class="header-anchor" href="#delete-a-configuration" aria-hidden="true">#</a> Delete a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /configurations/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><p>For admin request, delete the config item requested; forbidden for user request</p></li></ul><h2 id="replace-a-configuration" tabindex="-1"><a class="header-anchor" href="#replace-a-configuration" aria-hidden="true">#</a> Replace a Configuration</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /configurations/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is intended to be only used by admin web console to modify a configuration.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>configuration id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>configuration data <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p>For admin requests, replace configuration identified by <em>id</em> with parameter <em>data</em> and save to database.</p></li></ul>`,7);function F(H,J){const a=l("ExternalLinkIcon");return r(),o("div",null,[p,e("ul",null,[u,e("li",null,[c,e("ul",null,[e("li",null,[m,e("ol",null,[h,e("li",null,[t("in the format supported by "),e("a",f,[t("qs"),n(a)]),t(", for example "),g])]),b,e("ul",null,[e("li",null,[t("for "),v,t(" , see MongoDB "),e("a",_,[t("Query Documents"),n(a)])]),e("li",null,[t("for "),k,t(" , see Mongoose "),e("a",q,[t("select"),n(a)])]),e("li",null,[t("for "),y,t(", see Mongoose "),e("a",x,[t("sort"),n(a)])]),e("li",null,[t("for "),w,t(", see MongoDB "),e("a",j,[t("cursor.skip"),n(a)])]),e("li",null,[t("for "),T,t(", see MongoDB "),e("a",A,[t("cursor.limit"),n(a)])])])])])]),C]),S,e("ul",null,[D,e("li",null,[N,e("ul",null,[e("li",null,[e("p",null,[t("a "),B,t(" query parameter with value conforming to MongoDB "),e("a",P,[t("Query Documents"),n(a)])]),E,O,e("ol",null,[I,e("li",null,[t("in the format supported by "),e("a",L,[t("qs"),n(a)]),t(", for example "),R])])]),U])]),$]),M])}const V=s(d,[["render",F],["__file","index.html.vue"]]);export{V as default};
