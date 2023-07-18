import{_ as d,r as l,o as u,c,a as e,b as t,d as n,w as a,e as i}from"./app-c47379d7.js";const p={},m=e("h1",{id:"subscription",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#subscription","aria-hidden":"true"},"#"),t(" Subscription")],-1),f=e("p",null,[t("The subscription API encapsulates the backend workflow of user subscription and un-subscription of push notification service. Depending on whether a API call comes from user browser as a user request or from an authorized server as an admin request, "),e("em",null,"NotifyBC"),t(" applies different validation rules. For user requests, the notification channel entered by user is unconfirmed. A confirmation code will be associated with this request. The confirmation code can be created in one of two ways:")],-1),b=e("em",null,"NotifyBC",-1),h=e("em",null,"subscription.confirmationRequest.<channel>.confirmationCodeRegex",-1),v=e("em",null,"NotifyBC",-1),g=e("em",null,"NotifyBC",-1),q=e("em",null,"NotifyBC",-1),y=e("em",null,"NotifyBC",-1),k=e("em",null,"NotifyBC",-1),_=e("p",null,[t("Equipped with the confirmation code and a message template, "),e("em",null,"NotifyBC"),t(" can now send out confirmation request to unconfirmed subscription channel. At a minimum this confirmation request should contain the confirmation code. When user receives the message, he/she echos the confirmation code back to a "),e("em",null,"NotifyBC"),t(" provided API to verify against saved record. If match, the state of the subscription request is changed to confirmed.")],-1),x=e("p",null,[t("For admin requests, "),e("em",null,"NotifyBC"),t(" can still perform the above confirmation process. But admin request has full CRUD privilege, including set the subscription state to confirmed, bypassing the confirmation process.")],-1),w=e("em",null,"NotifyBC",-1),C=["src"],I=e("p",null,[t("In the case user subscribing to notifications offered by different service providers in separate trust domains, the confirmation code is generated by a third-party server app trusted by all "),e("em",null,"NotifyBC"),t(" instances. Following sequence diagram shows the workflow. The diagram indicates "),e("em",null,"NotifyBC API Server 2"),t(" is chosen to send confirmation request.")],-1),j=["src"],N=i(`<h2 id="model-schema" tabindex="-1"><a class="header-anchor" href="#model-schema" aria-hidden="true">#</a> Model Schema</h2><p>The API operates on following subscription data model fields:</p><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">serviceName</p><p class="description">name of the service. Avoid prefixing the name with underscore (_), or it may conflict with internal implementation.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">channel</p><p class="description">name of the delivery channel. Valid values: email and sms. Notice inApp is invalid as in-app notification doesn&#39;t need subscription.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr><tr><td>default</td><td>email</td></tr></table></td></tr><tr><td><p class="name">userChannelId</p><p class="description">user&#39;s delivery channel id, for example, email address</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">id</p><p class="description">subscription id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">state</p><p class="description">state of subscription. Valid values: unconfirmed, confirmed, deleted</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr><tr><td>default</td><td>unconfirmed</td></tr></table></td></tr><tr><td><p class="name">userId</p><p class="description">user id. Auto-populated for authenticated user requests.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">created</p><p class="description">date and time of creation</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">updated</p><p class="description">date and time of last update</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">confirmationRequest</p><div class="description">an object containing these child fields <ul><li><div class="name"> confirmationCodeRegex </div><ul><li>type: string</li><li>regular expression used to generate confirmation code </li></ul></li><li><div class="name"> confirmationCodeEncrypted </div><ul><li>type: string</li><li>encrypted confirmation code </li></ul></li><li><div class="name"> sendRequest </div><ul><li>type: boolean</li><li> whether to send confirmation request </li></ul></li><li><div class="name"> from, subject, textBody, htmlBody </div><ul><li>type: string</li><li> these are email template fields used for sending email confirmation request. If confirmationRequest.sendRequest is true and channel is email, then these fields should be supplied in order to send confirmation email. </li></ul></li></ul></div></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>true for user request with encrypted confirmation code; false otherwise</td></tr></table></td></tr><tr><td><p class="name"><a name="broadcastPushNotificationFilter"></a>broadcastPushNotificationFilter</p><div class="description">a string conforming to jmespath <a href="http://jmespath.org/specification.html#filter-expressions">filter expressions syntax</a> after the question mark (?). The filter is matched against the <i><a href="../api-notification#data">data</a></i> field of broadcast push notification. Examples of filter <ul><li>simple <br><i>province == &#39;BC&#39;</i></li><li>calling jmespath&#39;s <a href="http://jmespath.org/specification.html#built-in-functions">built-in functions</a> <br><i>contains(province,&#39;B&#39;)</i></li><li>calling <a href="../config-notification/#broadcast-push-notification-custom-filter-functions">custom filter functions</a><br><i>contains_ci(province,&#39;b&#39;)</i></li><li>compound <br><i>(contains(province,&#39;BC&#39;) || contains_ci(province,&#39;b&#39;)) &amp;&amp; city == &#39;Victoria&#39; </i></li></ul> All of above filters will match data object <i>{&quot;province&quot;: &quot;BC&quot;, &quot;city&quot;: &quot;Victoria&quot;}</i></div></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name"><a name="data"></a>data</p><p class="description">An object used by filter <a href="../api-notification#broadcastPushNotificationSubscriptionFilter">broadcastPushNotificationSubscriptionFilter</a> specified by the broadcast push notification sender to determine if the notification should be delivered to the subscriber.</p></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">unsubscriptionCode</p><p class="description">generated randomly according to RegEx config <i>anonymousUnsubscription.code.regex</i> during anonymous subscription if config <i>anonymousUnsubscription.code.required</i> is set to true</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">unsubscribedAdditionalServices</p><p class="description">generated if parameter <i>additionalServices</i> is supplied in unsubscription request. Contains 2 sub-fields: ids and names, each being a list identifying the additional unsubscribed subscriptions.</p></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr></table><h2 id="get-subscriptions" tabindex="-1"><a class="header-anchor" href="#get-subscriptions" aria-hidden="true">#</a> Get Subscriptions</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /subscriptions
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,5),T=e("li",null,[t("permissions required, one of "),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin"),e("li",null,"authenticated user")])],-1),R={href:"https://loopback.io/doc/en/lb4/Querying-data.html",target:"_blank",rel:"noopener noreferrer"},S=e("ul",null,[e("li",null,"parameter name: filter"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),B=e("li",null,[t("outcome "),e("ul",null,[e("li",null,"for admin requests, returns unabridged array of subscription data matching the filter"),e("li",null,[t("for authenticated user requests, in addition to filter, following constraints are imposed on the returned array "),e("ul",null,[e("li",null,"only non-deleted subscriptions"),e("li",null,"only subscriptions created by the user"),e("li",null,[t("the "),e("em",null,"confirmationRequest"),t(" field is removed.")])])]),e("li",null,"forbidden for anonymous user requests")])],-1),A=i(`<h2 id="get-subscription-count" tabindex="-1"><a class="header-anchor" href="#get-subscription-count" aria-hidden="true">#</a> Get Subscription Count</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /subscriptions/count?where[property]=value
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,2),E=e("li",null,[e("p",null,"permissions required, one of"),e("ul",null,[e("li",null,"super admin"),e("li",null,"admin"),e("li",null,"authenticated user")])],-1),P=e("p",null,"inputs",-1),G={href:"https://loopback.io/doc/en/lb4/Where-filter.html",target:"_blank",rel:"noopener noreferrer"},U=e("ul",null,[e("li",null,"parameter name: where"),e("li",null,"required: false"),e("li",null,"parameter type: query"),e("li",null,"data type: object")],-1),V=i(`<li><p>outcome</p><p>Validations rules are the same as <em>GET /subscriptions</em>. If passed, the output is a count of subscriptions matching the query</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;count&quot;</span><span class="token operator">:</span> &lt;number&gt;
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>`,1),F=e("p",null,"examples",-1),L={href:"http://loopback.io/doc/en/lb3/PersistedModel-REST-API.html#get-instance-count",target:"_blank",rel:"noopener noreferrer"},D=i(`<h2 id="create-a-subscription" tabindex="-1"><a class="header-anchor" href="#create-a-subscription" aria-hidden="true">#</a> Create a Subscription</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /subscriptions
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,2),W=e("li",null,[e("p",null,"inputs"),e("ul",null,[e("li",null,[t("an object containing subscription data model fields. At a minimum all required fields that don't have a default value must be supplied. Id field should be omitted since it's auto-generated. "),e("ul",null,[e("li",null,"parameter name: data"),e("li",null,"required: true"),e("li",null,"parameter type: body"),e("li",null,"data type: object")])])])],-1),Z=e("p",null,"outcome",-1),M=e("p",null,[e("em",null,"NotifyBC"),t(" performs following actions in sequence")],-1),K=i("<li><p>inputs are validated. If validation fails, error is returned.</p></li><li><p>for user requests, the <em>state</em> field is forced to <em>unconfirmed</em></p></li><li><p>for authenticated user request, <em>userId</em> field is populated with authenticated userId</p></li><li><p>otherwise, <em>unsubscriptionCode</em> is generated if config <em>subscription.anonymousUnsubscription.code.required</em> is <em>true</em>, unless if the request is made by admin and the field is already populated</p></li><li><p>if <em>confirmationRequest.confirmationCodeEncrypted</em> is populated, a confirmation code is generated by decrypting this field using private RSA key, then put decrypted confirmation code to field <em>confirmationRequest.confirmationCode</em></p></li><li><p>otherwise, for user requests and for admin requests missing message template, the message template is set to configured value. Then, if <em>confirmationRequest.confirmationCodeRegex</em> is populated, a confirmation code is generated conforming to regex and put to field <em>confirmationRequest.confirmationCode</em></p></li><li><p>the subscription request is saved to database.</p></li>",7),O=i("<p>if <em>confirmationRequest.sendRequest</em> is true, then a message is sent to <em>userChannelId</em>. The message template is determined by</p><ol><li>if <em>detectDuplicatedSubscription</em> is true and there is already a confirmed subscription to the same <em>serviceName</em>, <em>channel</em> and <em>userChannelId</em>, then message is sent using <em>duplicatedSubscriptionNotification</em> as template;</li><li>otherwise, a confirmation request is sent to using the template fields in <em>confirmationRequest</em>.</li></ol>",2),Q=e("li",null,[e("p",null,[t("The subscription data, including auto-generated id, is returned as response unless there is error when sending confirmation request or saving to database. For user request, some fields containing sensitive information such as "),e("em",null,"confirmationRequest"),t(" are removed prior to sending the response.")])],-1),$=i(`<li><p>examples</p><ol><li>To subscribe a user to service <em>education</em>, copy and paste following json object to the data value box in API explorer, change email addresses as needed, and click <em>Try it out!</em> button:</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
  &quot;serviceName&quot;: &quot;education&quot;,
  &quot;channel&quot;: &quot;email&quot;,
  &quot;userChannelId&quot;: &quot;foo@bar.com&quot;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>As a result, <em>foo@bar.com</em> should receive an email confirmation request, and following json object is returned to caller upon sending the email successfully for admin request:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;serviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;education&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;email&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;userChannelId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;foo@bar.com&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> <span class="token string">&quot;unconfirmed&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;confirmationRequest&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;confirmationCodeRegex&quot;</span><span class="token operator">:</span> <span class="token string">&quot;\\\\d{5}&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;sendRequest&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@bar.com&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;confirmation&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Enter {confirmation_code} on screen&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;confirmationCode&quot;</span><span class="token operator">:</span> <span class="token string">&quot;45304&quot;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2016-10-03T17:35:40.202Z&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;updated&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2016-10-03T17:35:40.202Z&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;57f296ec7eead50554c61de7&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>For non-admin request, the field <em>confirmationRequest</em> is removed from response, and field <em>userId</em> is populated if request is authenticated:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;serviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;education&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;email&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;userChannelId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;foo@bar.com&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> <span class="token string">&quot;unconfirmed&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;userId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;user_id&gt;&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2016-10-03T18:17:09.778Z&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;updated&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2016-10-03T18:17:09.778Z&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;57f2a0a5b1aa0e2d5009eced&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><p>To subscribe a user to service <em>education</em> with RSA public key encrypted confirmation code supplied, POST following request</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;serviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;education&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;email&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;userChannelId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;foo@bar.com&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;confirmationRequest&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;confirmationCodeEncrypted&quot;</span><span class="token operator">:</span> <span class="token string">&quot;&lt;encrypted-confirmation-code&gt;&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;sendRequest&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@bar.com&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;confirmation&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Enter {confirmation_code} on screen&quot;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>As a result, <em>NotifyBC</em> will decrypt the confirmation code using the private RSA key, replace placeholder <em>{confirmation_code}</em> in the email template with the confirmation code, and send confirmation request to <em>foo@bar.com</em>.</p></li></ol></li>`,1),z=i(`<h2 id="verify-a-confirmation-code" tabindex="-1"><a class="header-anchor" href="#verify-a-confirmation-code" aria-hidden="true">#</a> Verify a Confirmation Code</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /subscriptions/{id}/verify
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p>inputs</p><ul><li>subscription id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>confirmation code <ul><li>parameter name: confirmationCode</li><li>required: true</li><li>parameter type: query</li><li>data type: string</li></ul></li><li>whether or not replacing existing subscriptions <ul><li>parameter name: replace</li><li>required: false</li><li>parameter type: query</li><li>data type: boolean</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> performs following actions in sequence</p><ol><li>the subscription identified by <em>id</em> is retrieved</li><li>for user request, the <em>userId</em> of the subscription is checked against current request user, if not match, error is returned; otherwise</li><li>input parameter <em>confirmationCode</em> is checked against <em>confirmationRequest.confirmationCode</em>. If not match, error is returned; otherwise</li><li>if input parameter <em>replace</em> is supplied and set to <em>true</em>, then existing confirmed subscriptions from the same <em>serviceName</em>, <em>channel</em> and <em>userChannelId</em> are deleted. No unsubscription acknowledgement notification is sent</li><li><em>state</em> is set to <em>confirmed</em></li><li>the subscription is saved back to database</li><li>displays acknowledgement message according to <a href="../config-subscription#confirmation-verification-acknowledgement-messages">configuration</a></li></ol></li></ul><h2 id="update-a-subscription" tabindex="-1"><a class="header-anchor" href="#update-a-subscription" aria-hidden="true">#</a> Update a Subscription</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /subscriptions/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is used by authenticated user to change user channel id (such as email address) and resend confirmation code.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li><li>authenticated user</li></ul></li><li><p>inputs</p><ul><li>subscription id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>an object containing fields to be updated. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> processes the request similarly as creating a subscription except during input validation it imposes following extra constraints to user request</p><ul><li>only fields <em>userChannelId</em>, <em>state</em> and <em>confirmationRequest</em> can be updated</li><li>when changing <em>userChannelId</em>, <em>confirmationRequest</em> must also be supplied</li><li>if <em>userChannelId</em> is different from the saved record, <em>state</em> is forced to <em>unconfirmed</em>.</li></ul></li></ul><h2 id="delete-a-subscription-unsubscribing" tabindex="-1"><a class="header-anchor" href="#delete-a-subscription-unsubscribing" aria-hidden="true">#</a> Delete a Subscription (unsubscribing)</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /subscriptions/{id}?unsubscriptionCode={unsubscriptionCode}&amp;additionalServices[]={additionalServices}&amp;userChannelId={userChannelId}
or
GET /subscriptions/{id}/unsubscribe?unsubscriptionCode={unsubscriptionCode}&amp;additionalServices[]={additionalServices}&amp;userChannelId={userChannelId}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),H=i('<li><p>inputs</p><ul><li>subscription id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>unsubscription code for anonymous request <ul><li>parameter name: unsubscriptionCode</li><li>required: false</li><li>parameter type: query</li><li>data type: string</li></ul></li><li>additional service names to unsubscribe <ul><li>parameter name: additionalServices</li><li>required: false</li><li>parameter type: query</li><li>data type: array of strings. If there is only one item and its value is <em>_all</em>, then all services the user subscribed on this <em>NotifyBC</em> instance are included. Supply multiple items by repeating this query parameter.</li></ul></li><li>user channel id for extended validation <ul><li>parameter name: userChannelId</li><li>required: false</li><li>parameter type: query</li><li>data type: string</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> performs following actions in sequence</p><ol><li>the subscription identified by <em>id</em> is retrieved</li><li>for user request,</li></ol><ul><li>if request is authenticated, the <em>userId</em> of the subscription is checked against current request user, if not match, request is rejected</li><li>if request is anonymous, and server is configured to require unsubscription code, the input unsubscription code is matched against the <em>unsubscriptionCode</em> field. Request is rejected if not match. In addition, if input parameter <em>userChannelId</em> is populated but doesn&#39;t match, request is rejected</li></ul><ol start="3"><li>if the subscription state is not <em>confirmed</em>, request is rejected</li><li>if <em>additionalServices</em> is populated, database is queried to retrieve the <em>serviceName</em> and <em>id</em> fields of the additional subscriptions</li><li>the field <em>state</em> is set to <em>deleted</em> for the subscription identified by <em>id</em> as well as additional subscriptions retrieved in previous step</li><li>if <em>additionalServices</em> is not empty, the service names and ids of the additional subscriptions are added to field <em>unsubscribedAdditionalServices</em> of the subscription identified by <em>id</em> to allow bulk undo unsubscription later on</li><li>for anonymous unsubscription, an acknowledgement notification is sent to user if configured so</li><li>returns</li></ol><ul><li>for anonymous request, either the message or redirect as configured in <em>anonymousUnsubscription.acknowledgements.onScreen</em></li><li>for authenticated user or admin requests, number of records affected or error message if occurred.</li></ul></li>',2),J=e("p",null,[e("a",{name:"unsubscription-example"}),t(" examples")],-1),X=e("em",null,"{unsubscription_url}",-1),Y=e("li",null,[t("To allow an anonymous subscriber to unsubscribe all subscriptions, provide url token "),e("em",null,"{unsubscription_all_url}"),t(" in notification messages.")],-1),ee=i(`<h2 id="un-deleting-a-subscription" tabindex="-1"><a class="header-anchor" href="#un-deleting-a-subscription" aria-hidden="true">#</a> Un-deleting a Subscription</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /subscriptions/{id}/unsubscribe/undo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API allows an anonymous subscriber to undo an unsubscription.</p>`,3),te=i("<li><p>inputs</p><ul><li>subscription id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>unsubscription code <ul><li>parameter name: unsubscriptionCode</li><li>required: false</li><li>parameter type: query</li><li>data type: string</li></ul></li></ul></li>",1),ie=i("<p>outcome</p><p><em>NotifyBC</em> performs following actions in sequence</p><ol><li>the subscription identified by <em>id</em> is retrieved</li><li>for user request,</li></ol><ul><li>if request is anonymous, and server is configured to require unsubscription code, the input unsubscription code is matched against the <em>unsubscriptionCode</em> field. Request is rejected if not match</li><li>if request is authenticated, request is rejected</li><li>if the subscription state is not <em>deleted</em>, request is rejected</li></ul>",4),ne={start:"3"},se=e("li",null,[t("the field "),e("em",null,"state"),t(" is set to "),e("em",null,"confirmed"),t(" for the subscription identified by "),e("em",null,"id"),t(" as well as additional subscriptions identified in field "),e("em",null,"unsubscribedAdditionalServices"),t(", if populated")],-1),ae=e("li",null,[t("field "),e("em",null,"unsubscribedAdditionalServices"),t(" is removed if populated")],-1),oe=e("p",null,"example",-1),re=e("em",null,"{unsubscription_reversion_url}",-1),le=i(`<h2 id="get-all-services-with-confirmed-subscribers" tabindex="-1"><a class="header-anchor" href="#get-all-services-with-confirmed-subscribers" aria-hidden="true">#</a> Get all services with confirmed subscribers</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /subscriptions/services
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is designed to facilitate implementing autocomplete for admin web console.</p><ul><li>permissions required, one of <ul><li>super admin</li><li>admin</li></ul></li><li>inputs - none</li><li>outcome <ul><li>for admin requests, returns an array of unique service names with confirmed subscribers</li><li>forbidden for non-admin requests</li></ul></li></ul><h2 id="replace-a-subscription" tabindex="-1"><a class="header-anchor" href="#replace-a-subscription" aria-hidden="true">#</a> Replace a Subscription</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /subscriptions/{id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is intended to be only used by admin web console to modify a subscription without triggering any confirmation or acknowledgement notification.</p><ul><li>permissions required, one of <ul><li>super admin</li><li>admin</li></ul></li><li>permissions required, one of <ul><li>super admin</li><li>admin</li><li>authenticated user</li></ul></li><li>inputs <ul><li>subscription id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>subscription data <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li>outcome <ul><li>for admin requests, replace subscription identified by <em>id</em> with parameter <em>data</em> and save to database. No notification is sent.</li><li>forbidden for non-admin requests</li></ul></li></ul>`,8);function de(r,ue){const s=l("RouterLink"),o=l("ExternalLinkIcon");return u(),c("div",null,[m,f,e("ul",null,[e("li",null,[t("by "),b,t(" based on channel dependent "),h,t(),n(s,{to:"/docs/config-subscription/#confirmation-request-message"},{default:a(()=>[t("config")]),_:1}),t(".")]),e("li",null,[t("by a trusted third party. This trusted third party encrypts the confirmation code using the public RSA key of the "),v,t(" instance (see more about "),n(s,{to:"/docs/config-rsaKeys/"},{default:a(()=>[t("RSA Key Config")]),_:1}),t(") and pass the encrypted confirmation code to "),g,t(" via user browser in the same subscription request. "),q,t(" then decrypts to obtain the confirmation code. This method allows user subscribe to multiple notification services provided by "),y,t(" instances in different trust domains (i.e. service providers) and only have to confirm the subscription channel once during one browser session. In such case only one "),k,t(" instance should be chosen to deliver confirmation request to user.")])]),_,x,e("p",null,[t("The workflow of user subscribing to notification services offered by a single service provider is illustrated by sequence diagram below. In this case, the confirmation code is generated by "),w,t(". "),e("img",{src:r.$withBase("/img/subscription-single-service-provider.png"),alt:"single service provider subscription"},null,8,C)]),I,e("img",{src:r.$withBase("/img/subscription-multi-service-provider.png"),alt:"multi service provider subscription"},null,8,j),N,e("ul",null,[T,e("li",null,[t("inputs "),e("ul",null,[e("li",null,[t("a filter defining fields, where, include, order, offset, and limit. See "),e("a",R,[t("Loopback Querying Data"),n(o)]),t(" for valid syntax and examples "),S])])]),B]),A,e("ul",null,[E,e("li",null,[P,e("ul",null,[e("li",null,[t("a "),e("a",G,[t("where filter"),n(o)]),U])])]),V,e("li",null,[F,e("p",null,[t("See LoopBack "),e("a",L,[t("Get instance count"),n(o)]),t(" for examples.")])])]),D,e("ul",null,[W,e("li",null,[Z,M,e("ol",null,[K,e("li",null,[O,e("p",null,[n(s,{to:"/docs/overview/#mail-merge"},{default:a(()=>[t("Mail merge")]),_:1}),t(" is performed on the template regardless.")])]),Q])]),$]),z,e("ul",null,[H,e("li",null,[J,e("ol",null,[e("li",null,[t("To allow an anonymous subscriber to unsubscribe single subscription, provide url token "),X,t(" in notification messages. When sending notification, "),n(s,{to:"/docs/overview/#mail-merge"},{default:a(()=>[t("mail merge")]),_:1}),t(" is performed on the token resolving to the GET API url and parameters.")]),Y])])]),ee,e("ul",null,[te,e("li",null,[ie,e("ol",ne,[se,ae,e("li",null,[t("returns either the message or redirect as configured in "),e("em",null,[n(s,{to:"/docs/config-subscription/#anonymousUndoUnsubscription"},{default:a(()=>[t("anonymousUndoUnsubscription")]),_:1})])])])]),e("li",null,[oe,e("p",null,[t("To allow an anonymous subscriber to undo unsubscription, provide link token "),re,t(" in unsubscription acknowledgement notification, which is by default set. When sending notification, "),n(s,{to:"/docs/overview/#mail-merge"},{default:a(()=>[t("mail merge")]),_:1}),t(" is performed on this token resolving to the API url and parameters.")])])]),le])}const pe=d(p,[["render",de],["__file","index.html.vue"]]);export{pe as default};
