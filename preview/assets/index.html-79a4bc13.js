import{_ as l,r,o,c as d,a as e,b as a,d as s,e as t}from"./app-bafea29c.js";const u={},p=t(`<h1 id="administrator" tabindex="-1"><a class="header-anchor" href="#administrator" aria-hidden="true">#</a> Administrator</h1><p>The administrator API provides knowledge factor authentication to identify admin request by access token (aka API token in other literatures) associated with a registered administrator maintained in <em>NotifyBC</em> database. Because knowledge factor authentication is vulnerable to brute-force attack, administrator API based access token authentication is less favorable than admin ip list, client certificate, or OIDC authentication.</p><div class="custom-container warning"><p class="custom-container-title">Avoid Administrator API</p><p>Administrator API was created to circumvent an OpenShift limitation - the source ip of a request initiated from an OpenShift pod cannot be exclusively allocated to the pod&#39;s project, rather it has to be shared by all OpenShift projects. Therefore it&#39;s difficult to impose granular access control based on source ip.</p><p>With the introduction client certificate in v2.4.0, most use cases, if not all, that need Administrator API including the OpenShift use case mentioned above can be addressed by client certificate. Therefore only use Administrator API sparingly as last resort.</p></div><p>To enable access token authentication,</p><ol><li><p>a super-admin <a href="#sign-up">signs up</a> an administrator</p><p>For example,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&quot;http://localhost:3000/api/administrators&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;accept: application/json&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;Content-Type: application/json&quot;</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>username<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>Foo<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>email<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>user@example.com<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>password<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The step can also be completed in web console using <span style="vertical-align:text-bottom;" class="material-icons">add</span> button in Administrators panel.</p></li><li><p>Either super-admin or the user <a href="#login">login</a> to generate an access token</p><p>For example,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&quot;http://localhost:3000/api/administrators/login&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;accept: application/json&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;Content-Type: application/json&quot;</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>email<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>user@example.com<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>password<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>tokenName<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>myApp<span class="token entity" title="\\&quot;">\\&quot;</span>}&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The step can also be completed in web console GUI by an anonymous user using <span style="vertical-align:text-bottom;" class="material-icons">login</span> button at top right corner. Access token generated by GUI is valid for 12hrs.</p></li><li><p>Apply access token to either <em>Authorization</em> header or <em>access_token</em> query parameter to make authenticated requests. For example, to get a list of notifications</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token assign-left variable">ACCESS_TOKEN</span><span class="token operator">=</span>6Nb2ti5QEXIoDBS5FQGWIz4poRFiBCMMYJbYXSGHWuulOuy0GTEuGx2VCEVvbpBK

<span class="token comment"># Authorization Header</span>
<span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: <span class="token variable">$ACCESS_TOKEN</span>&quot;</span> <span class="token punctuation">\\</span>
http://localhost:3000/api/notifications

<span class="token comment"># Query Parameter</span>
<span class="token function">curl</span> <span class="token parameter variable">-X</span> GET http://localhost:3000/api/notifications?access_token<span class="token operator">=</span><span class="token variable">$ACCESS_TOKEN</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In web console, once login as administrator, the access token is automatically applied.</p></li></ol><h2 id="model-schemas" tabindex="-1"><a class="header-anchor" href="#model-schemas" aria-hidden="true">#</a> Model Schemas</h2><p>The <em>Administrator</em> API operates on three related sub-models - <em>Administrator</em>, <em>UserCredential</em> and <em>AccessToken</em>. An administrator has one and only one user credential and zero or more access tokens. Their relationship is diagramed as</p>`,7),c=["src"],m=t(`<h3 id="administrator-1" tabindex="-1"><a class="header-anchor" href="#administrator-1" aria-hidden="true">#</a> Administrator</h3><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">email</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr><tr><td>unique</td><td>true</td></tr></table></td></tr><tr><td><p class="name">username</p><p class="description">user name</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h3 id="usercredential" tabindex="-1"><a class="header-anchor" href="#usercredential" aria-hidden="true">#</a> UserCredential</h3><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">password</p><p class="description">hashed password</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">userId</p><p class="description">foreign key to Administrator model</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr></table><h3 id="accesstoken" tabindex="-1"><a class="header-anchor" href="#accesstoken" aria-hidden="true">#</a> AccessToken</h3><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p><p class="description">64-byte random alphanumeric characters</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">userId</p><p class="description">foreign key to Administrator model</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">ttl</p><p class="description">Time-to-live in seconds. If absent, access token never expires.</p></td><td><table><tr><td>type</td><td>number</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">name</p><p class="description">Name of the access token. Can be used to identify applications that use the token.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h2 id="sign-up" tabindex="-1"><a class="header-anchor" href="#sign-up" aria-hidden="true">#</a> Sign Up</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin to create an admin.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li></ul></li><li><p>inputs</p><ul><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a name="password-complexity"></a>Password must meet following complexity rules:</p><ul><li>contains at least 10 characters</li><li>contains at least one lower case character a-z</li><li>contains at least one upper case character A-Z</li><li>contains at least one numeric character 0-9</li><li>contains at lease one special character in !_@#$&amp;*</li></ul><p><em>email</em> must be unique. <em>username</em> is optional.</p><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><ul><li>for super-admin requests, <ul><li>an <em>Administrator</em> is generated, populated with <em>email</em> and <em>username</em></li><li>a <em>UserCredential</em> is generated, populated with hashed <em>password</em></li><li><em>Administrator</em> is returned</li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="login" tabindex="-1"><a class="header-anchor" href="#login" aria-hidden="true">#</a> Login</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators/login
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows an admin to login and create an access token</p><ul><li><p>inputs</p><ul><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;tokenName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;ttl&quot;</span><span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>tokenName</em> and <em>ttl</em> are optional. If <em>ttl</em> is <em>absent</em>, access token never expires.</p><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><ul><li>if login is successful <ul><li>a new <em>AccessToken</em> is generated with <em>tokenName</em> is saved to <em>AccessToken.name</em> and <em>ttl</em> is saved to <em>AccessToken.ttl</em>.</li><li>the new access token is returned<div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;token&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="set-password" tabindex="-1"><a class="header-anchor" href="#set-password" aria-hidden="true">#</a> Set Password</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators/{id}/user-credential
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to create or update password by id. An admin can only create/update own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p>password</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The password must meet complexity rules specified in <a href="#sign-up">Sign Up</a>.</p><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin, <ol><li>hash the input password</li><li>remove any existing <em>UserCredential.password</em> for the <em>Administrator</em></li><li>create a new <em>UserCredential.password</em></li></ol></li><li>forbidden otherwise</li></ul></li></ul><h2 id="get-administrators" tabindex="-1"><a class="header-anchor" href="#get-administrators" aria-hidden="true">#</a> Get Administrators</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to search for administrators. An admin can only search for own record</p>`,22),h=e("li",null,[a("permissions required, one of "),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),b={href:"https://loopback.io/doc/en/lb4/Querying-data.html",target:"_blank",rel:"noopener noreferrer"},v=e("ul",null,[e("li",null,"parameter name: filter"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),g=e("li",null,[a("outcome "),e("ul",null,[e("li",null,[a("for super-admins, returns an array of "),e("em",null,"Administrators"),a(" matching the filter")]),e("li",null,"for admins, returns an array of one element - own record if the record matches the filter; empty array otherwise"),e("li",null,"forbidden otherwise")])],-1),k=t(`<h2 id="update-administrators" tabindex="-1"><a class="header-anchor" href="#update-administrators" aria-hidden="true">#</a> Update Administrators</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /administrators
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to update administrators. An admin can only update own record</p>`,3),q=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),f=e("p",null,"inputs",-1),y={href:"https://loopback.io/doc/en/lb4/Where-filter.html",target:"_blank",rel:"noopener noreferrer"},A=e("ul",null,[e("li",null,"parameter name: where"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),x=t(`<li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li>`,1),_=e("li",null,[e("p",null,"outcome"),e("ul",null,[e("li",null,"for super-admins or admin, successful count"),e("li",null,"forbidden otherwise")])],-1),w=t(`<h2 id="count-administrators" tabindex="-1"><a class="header-anchor" href="#count-administrators" aria-hidden="true">#</a> Count Administrators</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators/count
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to count administrators by filter. An admin can only count own record therefore the number is at most 1.</p>`,3),T=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),j=e("p",null,"inputs",-1),P={href:"https://loopback.io/doc/en/lb4/Where-filter.html",target:"_blank",rel:"noopener noreferrer"},I=e("ul",null,[e("li",null,"parameter name: where"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),C=e("li",null,[e("p",null,"outcome"),e("ul",null,[e("li",null,"for super-admins or admin, a count matching the filter"),e("li",null,"forbidden otherwise")])],-1),S=t(`<h2 id="delete-an-administrator" tabindex="-1"><a class="header-anchor" href="#delete-an-administrator" aria-hidden="true">#</a> Delete an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /administrators/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to delete administrator by id. An admin can only delete own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><em>Administrator</em> id <ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><ul><li>for super-admins or admin <ul><li>all <em>AccessToken</em> of the <em>Administrator</em> are deleted</li><li>the corresponding <em>UserCredential</em> is deleted</li><li>the <em>Administrator</em> is deleted</li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="get-an-administrator" tabindex="-1"><a class="header-anchor" href="#get-an-administrator" aria-hidden="true">#</a> Get an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to get administrator by id. An admin can only get own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><em>Administrator</em> id <ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><ul><li>for super-admins or admin, returns the <em>Administrator</em></li><li>forbidden otherwise</li></ul></li></ul><h2 id="update-an-administrator" tabindex="-1"><a class="header-anchor" href="#update-an-administrator" aria-hidden="true">#</a> Update an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /administrators/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to update administrator fields by id. An admin can only update own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin, updates the <em>Administrator</em></li><li>forbidden otherwise</li></ul></li></ul><h2 id="replace-an-administrator" tabindex="-1"><a class="header-anchor" href="#replace-an-administrator" aria-hidden="true">#</a> Replace an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /administrators/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to replace administrator records by id. An admin can only replace own record. This API is different from <a href="#update-an-administrator">Update an Administrator</a> in that update/patch needs only to contain fields that are changed, ie the delta, whereas replace/put needs to contain all fields to be saved.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin, updates the <em>Administrator</em>. If <em>password</em> is also supplied, the password is handled same way as <a href="#set-password">Set Password</a> API</li><li>forbidden otherwise</li></ul></li></ul><h2 id="get-an-administrator-s-accesstokens" tabindex="-1"><a class="header-anchor" href="#get-an-administrator-s-accesstokens" aria-hidden="true">#</a> Get an Administrator&#39;s AccessTokens</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators/{id}/access-tokens
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to get access tokens by <em>Administrator</em> id. An admin can only get own records.</p>`,21),E=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),N=e("p",null,"inputs",-1),G=e("li",null,[e("em",null,"Administrator"),a(" id "),e("ul",null,[e("li",null,"required: true"),e("li",null,"parameter type: path"),e("li",null,"data type: string")])],-1),O=e("em",null,"AccessToken",-1),U={href:"https://loopback.io/doc/en/lb4/Querying-data.html",target:"_blank",rel:"noopener noreferrer"},H=e("ul",null,[e("li",null,"parameter name: filter"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),B=t(`<ul><li>outcome <ul><li>for super-admins or admin, a list of <em>AccessToken</em>s matching the filter</li><li>forbidden otherwise</li></ul></li></ul><h2 id="update-an-administrator-s-accesstokens" tabindex="-1"><a class="header-anchor" href="#update-an-administrator-s-accesstokens" aria-hidden="true">#</a> Update an Administrator&#39;s AccessTokens</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /administrators/{id}/access-tokens
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to update access tokens by <em>Administrator</em> id. An admin can only update own records.</p>`,4),D=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),L=e("p",null,"inputs",-1),Q=e("li",null,[e("p",null,[e("em",null,"Administrator"),a(" id")]),e("ul",null,[e("li",null,"required: true"),e("li",null,"parameter type: path"),e("li",null,"data type: string")])],-1),W={href:"https://loopback.io/doc/en/lb4/Where-filter.html",target:"_blank",rel:"noopener noreferrer"},z=e("ul",null,[e("li",null,"parameter name: where"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),F=t(`<li><p><em>AccessToken</em> information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;ttl&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li>`,1),V=t(`<ul><li>outcome <ul><li>for super-admins or admin, success count</li><li>forbidden otherwise</li></ul></li></ul><h2 id="create-an-administrator-s-accesstoken" tabindex="-1"><a class="header-anchor" href="#create-an-administrator-s-accesstoken" aria-hidden="true">#</a> Create an Administrator&#39;s AccessToken</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators/{id}/access-tokens
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to create an access token by <em>Administrator</em> id. An admin can only create own records.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p><em>AccessToken</em> information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;ttl&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin <ul><li>Create and save <em>AccessToken</em></li><li>return <em>AccessToken</em> created</li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="delete-an-administrator-s-accesstokens" tabindex="-1"><a class="header-anchor" href="#delete-an-administrator-s-accesstokens" aria-hidden="true">#</a> Delete an Administrator&#39;s AccessTokens</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /administrators/{id}/access-tokens
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to delete access tokens by <em>Administrator</em> id. An admin can only delete own records.</p>`,9),X=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin")])],-1),K=e("p",null,"inputs",-1),$=e("li",null,[e("em",null,"Administrator"),a(" id "),e("ul",null,[e("li",null,"required: true"),e("li",null,"parameter type: path"),e("li",null,"data type: string")])],-1),M=e("em",null,"AccessToken",-1),R={href:"https://loopback.io/doc/en/lb4/Where-filter.html",target:"_blank",rel:"noopener noreferrer"},Y=e("ul",null,[e("li",null,"parameter name: where"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),J=e("ul",null,[e("li",null,[a("outcome "),e("ul",null,[e("li",null,[a("for super-admins or admin "),e("ul",null,[e("li",null,[a("delete all "),e("em",null,"AccessToken"),a(" under the "),e("em",null,"Administrator"),a(" matching the filter")]),e("li",null,"return success count")])]),e("li",null,"forbidden otherwise")])])],-1);function Z(i,ee){const n=r("ExternalLinkIcon");return o(),d("div",null,[p,e("img",{src:i.$withBase("/img/admin-data-models.svg"),alt:"administrator model diagram"},null,8,c),m,e("ul",null,[h,e("li",null,[a("inputs "),e("ul",null,[e("li",null,[a("a filter defining fields, where, include, order, offset, and limit. See "),e("a",b,[a("Loopback Querying Data"),s(n)]),a(" for valid syntax and examples "),v])])]),g]),k,e("ul",null,[q,e("li",null,[f,e("ul",null,[e("li",null,[e("p",null,[a("a "),e("a",y,[a("where filter"),s(n)])]),A]),x])]),_]),w,e("ul",null,[T,e("li",null,[j,e("ul",null,[e("li",null,[a("a "),e("a",P,[a("where filter"),s(n)]),I])])]),C]),S,e("ul",null,[E,e("li",null,[N,e("ul",null,[G,e("li",null,[a("a "),O,a(" filter defining fields, where, include, order, offset, and limit. See "),e("a",U,[a("Loopback Querying Data"),s(n)]),a(" for valid syntax and examples "),H])])])]),B,e("ul",null,[D,e("li",null,[L,e("ul",null,[Q,e("li",null,[e("p",null,[a("a "),e("a",W,[a("where filter"),s(n)])]),z]),F])])]),V,e("ul",null,[X,e("li",null,[K,e("ul",null,[$,e("li",null,[a("an "),M,a(),e("a",R,[a("where filter"),s(n)]),Y])])])]),J])}const te=l(u,[["render",Z],["__file","index.html.vue"]]);export{te as default};
