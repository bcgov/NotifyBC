import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="administrator" tabindex="-1"><a class="header-anchor" href="#administrator" aria-hidden="true">#</a> Administrator</h1><p>The administrator API provides knowledge factor authentication to identify admin request by access token (aka API token in other literatures) associated with a registered administrator maintained in <em>NotifyBC</em> database. Because knowledge factor authentication is vulnerable to brute-force attack, administrator API based access token authentication is less favorable than admin ip list, client certificate, or OIDC authentication.</p><div class="custom-container warning"><p class="custom-container-title">Avoid Administrator API</p><p>Administrator API was created to circumvent an OpenShift limitation - the source ip of a request initiated from an OpenShift pod cannot be exclusively allocated to the pod&#39;s project, rather it has to be shared by all OpenShift projects. Therefore it&#39;s difficult to impose granular access control based on source ip.</p><p>With the introduction client certificate in v2.4.0, most use cases, if not all, that need Administrator API including the OpenShift use case mentioned above can be addressed by client certificate. Therefore only use Administrator API sparingly as last resort.</p></div><p>To enable access token authentication,</p><ol><li><p>a super-admin <a href="#sign-up">signs up</a> an administrator</p><p>For example,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&quot;http://localhost:3000/api/administrators&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;accept: application/json&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;Content-Type: application/json&quot;</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>username<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>Foo<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>email<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>user@example.com<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>password<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>}&quot;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The step can also be completed in web console using <span style="vertical-align:text-bottom;" class="material-icons">add</span> button in Administrators panel.</p></li><li><p>Either super-admin or the user <a href="#login">login</a> to generate an access token</p><p>For example,</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> POST <span class="token string">&quot;http://localhost:3000/api/administrators/login&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;accept: application/json&quot;</span> <span class="token parameter variable">-H</span>  <span class="token string">&quot;Content-Type: application/json&quot;</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>email<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>user@example.com<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>password<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>,<span class="token entity" title="\\&quot;">\\&quot;</span>tokenName<span class="token entity" title="\\&quot;">\\&quot;</span>:<span class="token entity" title="\\&quot;">\\&quot;</span>myApp<span class="token entity" title="\\&quot;">\\&quot;</span>}&quot;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The step can also be completed in web console GUI by an anonymous user using <span style="vertical-align:text-bottom;" class="material-icons">login</span> button at top right corner. Access token generated by GUI is valid for 12hrs.</p></li><li><p>Apply access token to either <em>Authorization</em> header or <em>access_token</em> query parameter to make authenticated requests. For example, to get a list of notifications</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token assign-left variable">ACCESS_TOKEN</span><span class="token operator">=</span>6Nb2ti5QEXIoDBS5FQGWIz4poRFiBCMMYJbYXSGHWuulOuy0GTEuGx2VCEVvbpBK\n\n<span class="token comment"># Authorization Header</span>\n<span class="token function">curl</span> <span class="token parameter variable">-X</span> GET <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: <span class="token variable">$ACCESS_TOKEN</span>&quot;</span> <span class="token punctuation">\\</span>\nhttp://localhost:3000/api/notifications\n\n<span class="token comment"># Query Parameter</span>\n<span class="token function">curl</span> <span class="token parameter variable">-X</span> GET http://localhost:3000/api/notifications?access_token<span class="token operator">=</span><span class="token variable">$ACCESS_TOKEN</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In web console, once login as administrator, the access token is automatically applied.</p></li></ol><h2 id="model-schemas" tabindex="-1"><a class="header-anchor" href="#model-schemas" aria-hidden="true">#</a> Model Schemas</h2><p>The <em>Administrator</em> API operates on three related sub-models - <em>Administrator</em>, <em>UserCredential</em> and <em>AccessToken</em>. An administrator has one and only one user credential and zero or more access tokens. Their relationship is diagramed as</p>', 7);
const _hoisted_8 = ["src"];
const _hoisted_9 = /* @__PURE__ */ createStaticVNode('<h3 id="administrator-1" tabindex="-1"><a class="header-anchor" href="#administrator-1" aria-hidden="true">#</a> Administrator</h3><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">email</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr><tr><td>unique</td><td>true</td></tr></table></td></tr><tr><td><p class="name">username</p><p class="description">user name</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h3 id="usercredential" tabindex="-1"><a class="header-anchor" href="#usercredential" aria-hidden="true">#</a> UserCredential</h3><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">password</p><p class="description">hashed password</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">userId</p><p class="description">foreign key to Administrator model</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr></table><h3 id="accesstoken" tabindex="-1"><a class="header-anchor" href="#accesstoken" aria-hidden="true">#</a> AccessToken</h3><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p><p class="description">64-byte random alphanumeric characters</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">userId</p><p class="description">foreign key to Administrator model</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">ttl</p><p class="description">Time-to-live in seconds. If absent, access token never expires.</p></td><td><table><tr><td>type</td><td>number</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">name</p><p class="description">Name of the access token. Can be used to identify applications that use the token.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr></table><h2 id="sign-up" tabindex="-1"><a class="header-anchor" href="#sign-up" aria-hidden="true">#</a> Sign Up</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin to create an admin.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li></ul></li><li><p>inputs</p><ul><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a name="password-complexity"></a>Password must meet following complexity rules:</p><ul><li>contains at least 10 characters</li><li>contains at least one lower case character a-z</li><li>contains at least one upper case character A-Z</li><li>contains at least one numeric character 0-9</li><li>contains at lease one special character in !_@#$&amp;*</li></ul><p><em>email</em> must be unique. <em>username</em> is optional.</p><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><ul><li>for super-admin requests, <ul><li>an <em>Administrator</em> is generated, populated with <em>email</em> and <em>username</em></li><li>a <em>UserCredential</em> is generated, populated with hashed <em>password</em></li><li><em>Administrator</em> is returned</li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="login" tabindex="-1"><a class="header-anchor" href="#login" aria-hidden="true">#</a> Login</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators/login\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows an admin to login and create an access token</p><ul><li><p>inputs</p><ul><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;tokenName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;ttl&quot;</span><span class="token operator">:</span> <span class="token number">0</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>tokenName</em> and <em>ttl</em> are optional. If <em>ttl</em> is <em>absent</em>, access token never expires.</p><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><ul><li>if login is successful <ul><li>a new <em>AccessToken</em> is generated with <em>tokenName</em> is saved to <em>AccessToken.name</em> and <em>ttl</em> is saved to <em>AccessToken.ttl</em>.</li><li>the new access token is returned<div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;token&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="set-password" tabindex="-1"><a class="header-anchor" href="#set-password" aria-hidden="true">#</a> Set Password</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators/{id}/user-credential\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to create or update password by id. An admin can only create/update own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p>password</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;password&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The password must meet complexity rules specified in <a href="#sign-up">Sign Up</a>.</p><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin, <ol><li>hash the input password</li><li>remove any existing <em>UserCredential.password</em> for the <em>Administrator</em></li><li>create a new <em>UserCredential.password</em></li></ol></li><li>forbidden otherwise</li></ul></li></ul><h2 id="get-administrators" tabindex="-1"><a class="header-anchor" href="#get-administrators" aria-hidden="true">#</a> Get Administrators</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to search for administrators. An admin can only search for own record</p>', 22);
const _hoisted_31 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("permissions required, one of "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_32 = {
  href: "https://loopback.io/doc/en/lb4/Querying-data.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_33 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: filter"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_34 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("outcome "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, [
        /* @__PURE__ */ createTextVNode("for super-admins, returns an array of "),
        /* @__PURE__ */ createBaseVNode("em", null, "Administrators"),
        /* @__PURE__ */ createTextVNode(" matching the filter")
      ]),
      /* @__PURE__ */ createBaseVNode("li", null, "for admins, returns an array of one element - own record if the record matches the filter; empty array otherwise"),
      /* @__PURE__ */ createBaseVNode("li", null, "forbidden otherwise")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_35 = /* @__PURE__ */ createStaticVNode('<h2 id="update-administrators" tabindex="-1"><a class="header-anchor" href="#update-administrators" aria-hidden="true">#</a> Update Administrators</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /administrators\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to update administrators. An admin can only update own record</p>', 3);
const _hoisted_38 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_39 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_40 = {
  href: "https://loopback.io/doc/en/lb4/Where-filter.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_41 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: where"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_42 = /* @__PURE__ */ createStaticVNode('<li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li>', 1);
const _hoisted_43 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "outcome"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "for super-admins or admin, successful count"),
      /* @__PURE__ */ createBaseVNode("li", null, "forbidden otherwise")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_44 = /* @__PURE__ */ createStaticVNode('<h2 id="count-administrators" tabindex="-1"><a class="header-anchor" href="#count-administrators" aria-hidden="true">#</a> Count Administrators</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators/count\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to count administrators by filter. An admin can only count own record therefore the number is at most 1.</p>', 3);
const _hoisted_47 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_48 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_49 = {
  href: "https://loopback.io/doc/en/lb4/Where-filter.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_50 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: where"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_51 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "outcome"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "for super-admins or admin, a count matching the filter"),
      /* @__PURE__ */ createBaseVNode("li", null, "forbidden otherwise")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_52 = /* @__PURE__ */ createStaticVNode('<h2 id="delete-an-administrator" tabindex="-1"><a class="header-anchor" href="#delete-an-administrator" aria-hidden="true">#</a> Delete an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /administrators/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to delete administrator by id. An admin can only delete own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><em>Administrator</em> id <ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><ul><li>for super-admins or admin <ul><li>all <em>AccessToken</em> of the <em>Administrator</em> are deleted</li><li>the corresponding <em>UserCredential</em> is deleted</li><li>the <em>Administrator</em> is deleted</li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="get-an-administrator" tabindex="-1"><a class="header-anchor" href="#get-an-administrator" aria-hidden="true">#</a> Get an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to get administrator by id. An admin can only get own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><em>Administrator</em> id <ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><ul><li>for super-admins or admin, returns the <em>Administrator</em></li><li>forbidden otherwise</li></ul></li></ul><h2 id="update-an-administrator" tabindex="-1"><a class="header-anchor" href="#update-an-administrator" aria-hidden="true">#</a> Update an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /administrators/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to update administrator fields by id. An admin can only update own record.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin, updates the <em>Administrator</em></li><li>forbidden otherwise</li></ul></li></ul><h2 id="replace-an-administrator" tabindex="-1"><a class="header-anchor" href="#replace-an-administrator" aria-hidden="true">#</a> Replace an Administrator</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /administrators/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to replace administrator records by id. An admin can only replace own record. This API is different from <a href="#update-an-administrator">Update an Administrator</a> in that update/patch needs only to contain fields that are changed, ie the delta, whereas replace/put needs to contain all fields to be saved.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p>user information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;username&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;email&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin, updates the <em>Administrator</em>. If <em>password</em> is also supplied, the password is handled same way as <a href="#set-password">Set Password</a> API</li><li>forbidden otherwise</li></ul></li></ul><h2 id="get-an-administrator-s-accesstokens" tabindex="-1"><a class="header-anchor" href="#get-an-administrator-s-accesstokens" aria-hidden="true">#</a> Get an Administrator&#39;s AccessTokens</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /administrators/{id}/access-tokens\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to get access tokens by <em>Administrator</em> id. An admin can only get own records.</p>', 21);
const _hoisted_73 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_74 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_75 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "Administrator"),
    /* @__PURE__ */ createTextVNode(" id "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "required: true"),
      /* @__PURE__ */ createBaseVNode("li", null, "parameter type: path"),
      /* @__PURE__ */ createBaseVNode("li", null, "data type: string")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_76 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "AccessToken",
  -1
  /* HOISTED */
);
const _hoisted_77 = {
  href: "https://loopback.io/doc/en/lb4/Querying-data.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_78 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: filter"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_79 = /* @__PURE__ */ createStaticVNode('<ul><li>outcome <ul><li>for super-admins or admin, a list of <em>AccessToken</em>s matching the filter</li><li>forbidden otherwise</li></ul></li></ul><h2 id="update-an-administrator-s-accesstokens" tabindex="-1"><a class="header-anchor" href="#update-an-administrator-s-accesstokens" aria-hidden="true">#</a> Update an Administrator&#39;s AccessTokens</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /administrators/{id}/access-tokens\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to update access tokens by <em>Administrator</em> id. An admin can only update own records.</p>', 4);
const _hoisted_83 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_84 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_85 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, [
      /* @__PURE__ */ createBaseVNode("em", null, "Administrator"),
      /* @__PURE__ */ createTextVNode(" id")
    ]),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "required: true"),
      /* @__PURE__ */ createBaseVNode("li", null, "parameter type: path"),
      /* @__PURE__ */ createBaseVNode("li", null, "data type: string")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_86 = {
  href: "https://loopback.io/doc/en/lb4/Where-filter.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_87 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: where"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_88 = /* @__PURE__ */ createStaticVNode('<li><p><em>AccessToken</em> information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;ttl&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li>', 1);
const _hoisted_89 = /* @__PURE__ */ createStaticVNode('<ul><li>outcome <ul><li>for super-admins or admin, success count</li><li>forbidden otherwise</li></ul></li></ul><h2 id="create-an-administrator-s-accesstoken" tabindex="-1"><a class="header-anchor" href="#create-an-administrator-s-accesstoken" aria-hidden="true">#</a> Create an Administrator&#39;s AccessToken</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /administrators/{id}/access-tokens\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to create an access token by <em>Administrator</em> id. An admin can only create own records.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li><p><em>Administrator</em> id</p><ul><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li><p><em>AccessToken</em> information</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;ttl&quot;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;string&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>required: true</li><li>parameter type: request body</li><li>data type: object</li></ul></li></ul></li></ul><ul><li>outcome <ul><li>for super-admins or admin <ul><li>Create and save <em>AccessToken</em></li><li>return <em>AccessToken</em> created</li></ul></li><li>forbidden otherwise</li></ul></li></ul><h2 id="delete-an-administrator-s-accesstokens" tabindex="-1"><a class="header-anchor" href="#delete-an-administrator-s-accesstokens" aria-hidden="true">#</a> Delete an Administrator&#39;s AccessTokens</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /administrators/{id}/access-tokens\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows a super-admin or admin to delete access tokens by <em>Administrator</em> id. An admin can only delete own records.</p>', 9);
const _hoisted_98 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_99 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_100 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "Administrator"),
    /* @__PURE__ */ createTextVNode(" id "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "required: true"),
      /* @__PURE__ */ createBaseVNode("li", null, "parameter type: path"),
      /* @__PURE__ */ createBaseVNode("li", null, "data type: string")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_101 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "AccessToken",
  -1
  /* HOISTED */
);
const _hoisted_102 = {
  href: "https://loopback.io/doc/en/lb4/Where-filter.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_103 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, "parameter name: where"),
    /* @__PURE__ */ createBaseVNode("li", null, "required: false"),
    /* @__PURE__ */ createBaseVNode("li", null, "parameter type: query"),
    /* @__PURE__ */ createBaseVNode("li", null, "data type: object")
  ],
  -1
  /* HOISTED */
);
const _hoisted_104 = /* @__PURE__ */ createBaseVNode(
  "ul",
  null,
  [
    /* @__PURE__ */ createBaseVNode("li", null, [
      /* @__PURE__ */ createTextVNode("outcome "),
      /* @__PURE__ */ createBaseVNode("ul", null, [
        /* @__PURE__ */ createBaseVNode("li", null, [
          /* @__PURE__ */ createTextVNode("for super-admins or admin "),
          /* @__PURE__ */ createBaseVNode("ul", null, [
            /* @__PURE__ */ createBaseVNode("li", null, [
              /* @__PURE__ */ createTextVNode("delete all "),
              /* @__PURE__ */ createBaseVNode("em", null, "AccessToken"),
              /* @__PURE__ */ createTextVNode(" under the "),
              /* @__PURE__ */ createBaseVNode("em", null, "Administrator"),
              /* @__PURE__ */ createTextVNode(" matching the filter")
            ]),
            /* @__PURE__ */ createBaseVNode("li", null, "return success count")
          ])
        ]),
        /* @__PURE__ */ createBaseVNode("li", null, "forbidden otherwise")
      ])
    ])
  ],
  -1
  /* HOISTED */
);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("img", {
      src: _ctx.$withBase("/img/admin-data-models.svg"),
      alt: "administrator model diagram"
    }, null, 8, _hoisted_8),
    _hoisted_9,
    createBaseVNode("ul", null, [
      _hoisted_31,
      createBaseVNode("li", null, [
        createTextVNode("inputs "),
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("a filter defining fields, where, include, order, offset, and limit. See "),
            createBaseVNode("a", _hoisted_32, [
              createTextVNode("Loopback Querying Data"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            createTextVNode(" for valid syntax and examples "),
            _hoisted_33
          ])
        ])
      ]),
      _hoisted_34
    ]),
    _hoisted_35,
    createBaseVNode("ul", null, [
      _hoisted_38,
      createBaseVNode("li", null, [
        _hoisted_39,
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createBaseVNode("p", null, [
              createTextVNode("a "),
              createBaseVNode("a", _hoisted_40, [
                createTextVNode("where filter"),
                createVNode(_component_ExternalLinkIcon)
              ])
            ]),
            _hoisted_41
          ]),
          _hoisted_42
        ])
      ]),
      _hoisted_43
    ]),
    _hoisted_44,
    createBaseVNode("ul", null, [
      _hoisted_47,
      createBaseVNode("li", null, [
        _hoisted_48,
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("a "),
            createBaseVNode("a", _hoisted_49, [
              createTextVNode("where filter"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            _hoisted_50
          ])
        ])
      ]),
      _hoisted_51
    ]),
    _hoisted_52,
    createBaseVNode("ul", null, [
      _hoisted_73,
      createBaseVNode("li", null, [
        _hoisted_74,
        createBaseVNode("ul", null, [
          _hoisted_75,
          createBaseVNode("li", null, [
            createTextVNode("a "),
            _hoisted_76,
            createTextVNode(" filter defining fields, where, include, order, offset, and limit. See "),
            createBaseVNode("a", _hoisted_77, [
              createTextVNode("Loopback Querying Data"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            createTextVNode(" for valid syntax and examples "),
            _hoisted_78
          ])
        ])
      ])
    ]),
    _hoisted_79,
    createBaseVNode("ul", null, [
      _hoisted_83,
      createBaseVNode("li", null, [
        _hoisted_84,
        createBaseVNode("ul", null, [
          _hoisted_85,
          createBaseVNode("li", null, [
            createBaseVNode("p", null, [
              createTextVNode("a "),
              createBaseVNode("a", _hoisted_86, [
                createTextVNode("where filter"),
                createVNode(_component_ExternalLinkIcon)
              ])
            ]),
            _hoisted_87
          ]),
          _hoisted_88
        ])
      ])
    ]),
    _hoisted_89,
    createBaseVNode("ul", null, [
      _hoisted_98,
      createBaseVNode("li", null, [
        _hoisted_99,
        createBaseVNode("ul", null, [
          _hoisted_100,
          createBaseVNode("li", null, [
            createTextVNode("an "),
            _hoisted_101,
            createTextVNode(),
            createBaseVNode("a", _hoisted_102, [
              createTextVNode("where filter"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            _hoisted_103
          ])
        ])
      ])
    ]),
    _hoisted_104
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-0cde9cbb.js.map
