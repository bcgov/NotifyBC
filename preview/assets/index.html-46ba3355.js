import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="notification" tabindex="-1"><a class="header-anchor" href="#notification" aria-hidden="true">#</a> Notification</h1><p>The notification API encapsulates the backend workflow of staging and dispatching a message to targeted user after receiving the message from event source.</p><p>Depending on whether an API call comes from user browser as a user request or from an authorized server application as an admin request, <em>NotifyBC</em> applies different permissions. Admin request allows full CRUD operations. An authenticated user request, on the other hand, are only allowed to get a list of in-app pull notifications targeted to the current user and changing the state of the notifications. An unauthenticated user request can not access any API.</p><p>When a notification is created by the event source server application, the message is saved to database prior to responding to API caller. In addition, for push notification, the message is delivered immediately, i.e. the API call is synchronous. For in-app pull notification, the message, which by default is in state <em>new</em>, can be retrieved later on by browser user request. A user request can only get the list of in-app messages targeted to the current user. A user request can then change the message state to <em>read</em> or <em>deleted</em> depending on user action. A deleted message cannot be retrieved subsequently by user requests, but the state can be updated given the correct <em>id</em>.</p><div class="custom-container warning"><p class="custom-container-title"><i>Deleted</i> message is still kept in database.</p><p><i>NotifyBC</i> provides API for deleting a notification. For the purpose of auditing and recovery, this API only marks the <i>state</i> field as deleted rather than deleting the record from database.</p></div><div class="custom-container tip"><p class="custom-container-title">undo in-app notification deletion within a session</p><p>Because &quot;deleted&quot; message is still kept in database, you can implement undo feature for in-app notification as long as the message id is retained prior to deletion within the current session. To undo, call <a href="#update-a-notification">update</a> API to set desired state.</p></div><p>In-app pull notification also supports message expiration by setting a date in field <em>validTill</em>. An expired message cannot be retrieved by user requests.</p><p>A message, regardless of push or pull, can be unicast or broadcast. A unicast message is intended for an individual user whereas a broadcast message is intended for all confirmed subscribers of a service. A unicast message must have field <em>userChannelId</em> populated. The value of <em>userChannelId</em> is channel dependent. In the case of email for example, this would be user&#39;s email address. A broadcast message must set <em>isBroadcast</em> to true and leave <em>userChannelId</em> empty.</p><div class="custom-container warning"><p class="custom-container-title">Why field <i>isBroadcast</i>?</p><p>Unicast and broadcast message can be distinguished by whether field <i>userChannelId</i> is empty or not alone. So why the extra field <i>isBroadcast</i>? This is in order to prevent inadvertent marking a unicast message broadcast by omitting <i>userChannelId</i> or populating it with empty value. The precaution is necessary because in-app notifications may contain personalized and confidential information.</p></div><p><em>NotifyBC</em> ensures the state of an in-app broadcast message is isolated by user, so that for example, a message read by one user is still new to another user. To achieve this, <em>NotifyBC</em> maintains two internal fields of array type - <em>readBy</em> and <em>deletedBy</em>. When a user request updates the <em>state</em> field of an in-app broadcast message to <em>read</em> or <em>deleted</em>, instead of altering the <em>state</em> field, <em>NotifyBC</em> appends the current user to <em>readBy</em> or <em>deletedBy</em> list. When user request retrieving in-app messages, the <em>state</em> field of the broadcast message in HTTP response is updated based on whether the user exists in field <em>deletedBy</em> and <em>readBy</em>. If existing in both fields, <em>deletedBy</em> takes precedence (the message therefore is not returned). The record in database, meanwhile, is unchanged. Neither field <em>deletedBy</em> nor <em>readBy</em> is visible to user request.</p><h2 id="model-schema" tabindex="-1"><a class="header-anchor" href="#model-schema" aria-hidden="true">#</a> Model Schema</h2><p>The API operates on following notification data model fields:</p><table><tr><th>Name</th><th>Attributes</th></tr><tr><td><p class="name">id</p><p class="description">notification id</p></td><td><table><tr><td>type</td><td>string, format depends on db</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">serviceName</p><p class="description">name of the service</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">channel</p><p class="description">name of the delivery channel. Valid values: inApp, email, sms.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr><tr><td>default</td><td>inApp</td></tr></table></td></tr><tr><td><p class="name">userChannelId</p><p class="description">user&#39;s delivery channel id, for example, email address. For unicast inApp notification, this is authenticated user id. When sending unicast push notification, either <i>userChannelId</i> or <i>userId</i> is required.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">userId</p><p class="description">authenticated user id. When sending unicast push notification, either <i>userChannelId</i> or <i>userId</i> is required.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">state</p><p class="description">state of notification. Valid values: <i>new</i>, <i>read</i> (inApp only), <i>deleted</i> (inApp only), <i>sent</i> (push only) or <i>error</i>. For inApp broadcast notification, if the user has read or deleted the message, the value of this field retrieved by admin request will still be new. The state for the user is tracked in fields <i>readBy</i> and <i>deletedBy</i> in such case. For user request, the value contains correct state.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>true</td></tr><tr><td>default</td><td>new</td></tr></table></td></tr><tr><td><p class="name">created</p><p class="description">date and time of creation</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">updated</p><p class="description">date and time of last update</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">isBroadcast</p><p class="description">whether it&#39;s a broadcast message. A broadcast message should omit <i>userChannelId</i> and <i>userId</i>, in addition to setting <i>isBroadcast</i> to true</p></td><td><table><tr><td>type</td><td>boolean</td></tr><tr><td>required</td><td>false</td></tr><tr><td>default</td><td>false</td></tr></table></td></tr><tr><td><p class="name">skipSubscriptionConfirmationCheck</p><p class="description">When sending unicast push notification, whether or not to verify if the recipient has a confirmed subscription. This field allows subscription information be kept elsewhere and <i>NotifyBC</i> be used as a unicast push notification gateway only.</p></td><td><table><tr><td>type</td><td>boolean</td></tr><tr><td>required</td><td>false</td></tr><tr><td>default</td><td>false</td></tr></table></td></tr><tr><td><p class="name">validTill</p><p class="description">expiration date-time of the message. Applicable to inApp notification only.</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">invalidBefore</p><p class="description">date-time in the future after which the notification can be dispatched.</p></td><td><table><tr><td>type</td><td>date</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name"><a name="field-message"></a>message</p><div class="description">an object whose child fields are channel dependent: <ul><li><div> for inApp, <i>NotifyBC</i> doesn&#39;t have any restriction as long as web application can handle the message. <i>subject</i> and <i>body</i> are common examples. </div></li><li><div> for email: <i>from, subject, textBody, htmlBody</i></div><ul><li>type: string</li><li> these are email template fields. </li></ul></li><li><div> for sms: <i>textBody</i></div><ul><li>type: string</li><li> sms message template. </li></ul></li></ul><a href="../overview/#mail-merge">Mail merge</a> is performed on email and sms message templates. </div></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>true</td></tr></table></td></tr><tr><td><p class="name">httpHost</p><p class="description">This field is used to replace token <i>{http_host}</i> in push notification message template during <a href="../overview/#mail-merge">mail merge</a> and overrides config <i>httpHost</i>.</p></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr><tr><td>default</td><td>&lt;http protocol, host and port of current request&gt; for push notification</td></tr></table></td></tr><tr><td><p class="name">asyncBroadcastPushNotification</p><div class="description">this field determines if the API call to create an immediate (i.e. not future-dated) broadcast push notification is asynchronous or not. If omitted, the API call is synchronous, i.e. the API call blocks until all subscribers have been processed. If set, valid values and corresponding behaviors are <ul><li>true - async without callback</li><li>false - sync </li><li>a string contain callback url - async with callback of the supplied url upon completion</li></ul></div></td><td><table><tr><td>type</td><td>string or boolean</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name"><a name="data"></a>data</p><div class="description">the event that triggers the notification, for example, a RSS feed item when the notification is generated automatically by RSS cron job. Field <i>data</i> serves two purposes <ul><li>to replace <a href="../overview/#dynamic-tokens">dynamic tokens</a> in <i>message</i> template fields</li><li>to match against filter defined in subscription field <a href="../api-subscription#broadcastPushNotificationFilter">broadcastPushNotificationFilter</a>, if supplied, for broadcast push notifications to determine if the notification should be delivered to the subscriber</li></ul></div></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name"><a name="broadcastPushNotificationSubscriptionFilter"></a>broadcastPushNotificationSubscriptionFilter</p><div class="description">a string conforming to jmespath <a href="http://jmespath.org/specification.html#filter-expressions">filter expressions syntax</a> after the question mark (?). The filter is matched against the <i><a href="../api-subscription#data">data</a></i> field of the subscription. Examples of filter <ul><li>simple <br><i>province == &#39;BC&#39;</i></li><li>calling jmespath&#39;s <a href="http://jmespath.org/specification.html#built-in-functions">built-in functions</a> <br><i>contains(province,&#39;B&#39;)</i></li><li>calling <a href="../config-notification/#broadcast-push-notification-custom-filter-functions">custom filter functions</a><br><i>contains_ci(province,&#39;b&#39;)</i></li><li>compound <br><i>(contains(province,&#39;BC&#39;) || contains_ci(province,&#39;b&#39;)) &amp;&amp; city == &#39;Victoria&#39; </i></li></ul> All of above filters will match data object <i>{&quot;province&quot;: &quot;BC&quot;, &quot;city&quot;: &quot;Victoria&quot;}</i></div></td><td><table><tr><td>type</td><td>string</td></tr><tr><td>required</td><td>false</td></tr></table></td></tr><tr><td><p class="name">readBy</p><p class="description">this is an internal field to track the list of users who have read an inApp broadcast message. It&#39;s not visible to a user request.</p></td><td><table><tr><td>type</td><td>array</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">deletedBy</p><p class="description">this is an internal field to track the list of users who have marked an inApp broadcast message as deleted. It&#39;s not visible to a user request.</p></td><td><table><tr><td>type</td><td>array</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr><tr><td><p class="name">dispatch</p><p class="description">this is an internal field to track the broadcast push notification dispatch outcome. It consists of up to four arrays</p><ul><li>failed - a list of objects containing subscription IDs and error of failed dispatching</li><li>successful - a list of strings containing subscription IDs of successful dispatching</li><li>skipped - a list of strings containing subscription IDs of skipped dispatching</li><li>candidates - a list of strings containing IDs of confirmed subscriptions to the service. Dispatching to a subscription is subject to filtering.</li></ul></td><td><table><tr><td>type</td><td>object</td></tr><tr><td>required</td><td>false</td></tr><tr><td>auto-generated</td><td>true</td></tr></table></td></tr></table><h2 id="get-notifications" tabindex="-1"><a class="header-anchor" href="#get-notifications" aria-hidden="true">#</a> Get Notifications</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /notifications\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 15);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("permissions required, one of "),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "authenticated user")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_17 = {
  href: "https://loopback.io/doc/en/lb4/Querying-data.html#filters",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_18 = /* @__PURE__ */ createBaseVNode(
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
const _hoisted_19 = /* @__PURE__ */ createStaticVNode("<li>outcome <ul><li>for admin requests, returns unabridged array of notification data matching the filter</li><li>for authenticated user requests, in addition to filter, following constraints are imposed on the returned array <ul><li>only inApp notifications</li><li>only non-deleted notifications. For broadcast notification, non-deleted means not marked by current user as deleted</li><li>only non-expired notifications</li><li>for unicast notifications, only the ones targeted to current user</li><li>if current user is in <em>readBy</em>, then the <em>state</em> is changed to <em>read</em></li><li>the internal field <em>readBy</em> and <em>deletedBy</em> are removed</li></ul></li><li>forbidden to anonymous user requests</li></ul></li>", 1);
const _hoisted_20 = /* @__PURE__ */ createStaticVNode('<h2 id="get-notification-count" tabindex="-1"><a class="header-anchor" href="#get-notification-count" aria-hidden="true">#</a> Get Notification Count</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GET /notifications/count\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 2);
const _hoisted_22 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "permissions required, one of"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "super admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "admin"),
      /* @__PURE__ */ createBaseVNode("li", null, "authenticated user")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_23 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "inputs",
  -1
  /* HOISTED */
);
const _hoisted_24 = {
  href: "https://loopback.io/doc/en/lb4/Where-filter.html",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_25 = /* @__PURE__ */ createBaseVNode(
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
const _hoisted_26 = /* @__PURE__ */ createStaticVNode('<li><p>outcome</p><p>Validations rules are the same as <em>GET /notifications</em>. If passed, the output is a count of notifications matching the query</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;count&quot;</span><span class="token operator">:</span> &lt;number&gt;\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>', 1);
const _hoisted_27 = /* @__PURE__ */ createStaticVNode('<h2 id="create-send-notifications" tabindex="-1"><a class="header-anchor" href="#create-send-notifications" aria-hidden="true">#</a> Create/Send Notifications</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /notifications\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>', 2);
const _hoisted_29 = /* @__PURE__ */ createStaticVNode('<li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>an object containing notification data model fields. At a minimum all required fields that don&#39;t have a default value must be supplied. Id field should be omitted since it&#39;s auto-generated. The API explorer only created an empty object for field <em>message</em> but you should populate the child fields according to <a href="#model-schema">model schema</a><ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li>', 2);
const _hoisted_31 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "outcome",
  -1
  /* HOISTED */
);
const _hoisted_32 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  [
    /* @__PURE__ */ createBaseVNode("em", null, "NotifyBC"),
    /* @__PURE__ */ createTextVNode(" performs following actions in sequence")
  ],
  -1
  /* HOISTED */
);
const _hoisted_33 = /* @__PURE__ */ createStaticVNode("<li><p>if it&#39;s a user request, error is returned</p></li><li><p>inputs are validated. If validation fails, error is returned. In particular, for unicast push notification, the recipient as identified by either <em>userChannelId</em> or <em>userId</em> must have a confirmed subscription if field <em>skipSubscriptionConfirmationCheck</em> is not set to true. If <em>skipSubscriptionConfirmationCheck</em> is set to true, then the subscription check is skipped, but in such case the request must contain <em>userChannelId</em>, not <em>userId</em> as subscription data is not queried to obtain <em>userChannelId</em> from <em>userId</em>.</p></li><li><p>for push notification, if field <em>httpHost</em> is empty, it is populated based on request&#39;s http protocol and host.</p></li><li><p>the notification request is saved to database</p></li><li><p>if the notification is future-dated, then all subsequent request processing is skipped and response is sent back to user. Steps 7-11 below will be carried out later on by the cron job when the notification becomes current.</p></li><li><p>if it&#39;s an async broadcast push notification, then response is sent back to user but steps 7-12 below is processed separately</p></li>", 6);
const _hoisted_39 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "for unicast push notification, the message is dispatched to targeted user; for broadcast push notification, following actions are performed:",
  -1
  /* HOISTED */
);
const _hoisted_40 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "number of confirmed subscriptions is retrieved")
  ],
  -1
  /* HOISTED */
);
const _hoisted_41 = /* @__PURE__ */ createStaticVNode("<li><p>when processing an individual subscription,</p><ol><li>if the subscription has filter rule defined in field <em>broadcastPushNotificationFilter</em> and notification contains field <em>data</em>, then the data is matched against the filter rule. Notification message is only dispatched if there is a match.</li><li>if the notification has filter rule defined in field <em>broadcastPushNotificationSubscriptionFilter</em> and subscription contains field <em>data</em>, then the data is matched against the filter rule. Notification message is only dispatched if there is a match.</li></ol><p>If the subscription failed to pass any of the two filters, and if both <em>guaranteedBroadcastPushDispatchProcessing</em> and <em>logSkippedBroadcastPushDispatches</em> are true, the subscription id is logged to <em>dispatch.skipped</em></p></li>", 1);
const _hoisted_42 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "Regardless of unicast or broadcast, mail merge is performed on messages before dispatching.",
  -1
  /* HOISTED */
);
const _hoisted_43 = /* @__PURE__ */ createStaticVNode("<li><p>the state of push notification is updated to <em>sent</em> or <em>error</em> depending on sending status. For broadcast push notification, the dispatching could be failed only for a subset of users. In such case, the field <em>dispatch.failed</em> contains a list of objects of {userChannelId, subscriptionId, error} the message failed to deliver to, but the state will still be set to <em>sent</em>.</p></li><li><p>For broadcast push notifications, if <em>guaranteedBroadcastPushDispatchProcessing</em> is <em>true</em>, then field <em>dispatch.successful</em> is populated with a list of <em>subscriptionId</em> of the successful dispatches.</p></li><li><p>For push notifications, the bounce records of successful dispatches are updated</p></li><li><p>the updated notification is saved back to database</p></li><li><p>if it&#39;s an async broadcast push notification with a callback url, then the url is called with POST verb containing the notification with updated status as the request body</p></li><li><p>for synchronous notification, the saved record is returned unless there is an error saving to database, in which case error is returned</p></li>", 6);
const _hoisted_49 = /* @__PURE__ */ createStaticVNode('<li><p>example</p><p>To send a unicast email push notification, copy and paste following json object to the data value box in API explorer, change email addresses as needed, and click <em>Try it out!</em> button:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;serviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;education&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;userChannelId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;foo@bar.com&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;skipSubscriptionConfirmationCheck&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@bar.com&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;This is a test&quot;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;email&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>As the result, <em>foo@bar.com</em> should receive an email notification even if the user is not a confirmed subscriber, and following json object is returned to caller upon sending the email successfully:</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>\n  <span class="token property">&quot;serviceName&quot;</span><span class="token operator">:</span> <span class="token string">&quot;education&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;state&quot;</span><span class="token operator">:</span> <span class="token string">&quot;sent&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;userChannelId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;foo@bar.com&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;skipSubscriptionConfirmationCheck&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;message&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">&quot;from&quot;</span><span class="token operator">:</span> <span class="token string">&quot;no_reply@bar.com&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;subject&quot;</span><span class="token operator">:</span> <span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span>\n    <span class="token property">&quot;textBody&quot;</span><span class="token operator">:</span> <span class="token string">&quot;This is a test&quot;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;created&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2016-09-30T20:37:06.011Z&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;updated&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2016-09-30T20:37:06.011Z&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;channel&quot;</span><span class="token operator">:</span> <span class="token string">&quot;email&quot;</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;isBroadcast&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n  <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;57eeccf23427b61a4820775e&quot;</span>\n<span class="token punctuation">}</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>', 1);
const _hoisted_50 = /* @__PURE__ */ createStaticVNode('<h2 id="update-a-notification" tabindex="-1"><a class="header-anchor" href="#update-a-notification" aria-hidden="true">#</a> Update a Notification</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PATCH /notifications/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is mainly used for updating an inApp notification.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li><li>authenticated user</li></ul></li><li><p>inputs</p><ul><li>notification id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>an object containing fields to be updated. <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><ul><li>for user requests, <em>NotifyBC</em> performs following actions in sequence <ol><li>for unicast notification, if the notification is not targeted to current user, error is returned</li><li>all fields except for <em>state</em> are discarded from the input</li><li>for broadcast notification, current user id in appended to array <em>readBy</em> or <em>deletedBy</em>, depending on whether <em>state</em> is <em>read</em> or <em>deleted</em>, unless the user id is already in the array. The <em>state</em> field itself is then discarded</li><li>the notification identified by <em>id</em> is merged with the updates and saved to database</li><li>HTTP response code 204 is returned, unless there is error.</li></ol></li><li>admin requests are allowed to update any field</li></ul></li></ul><h2 id="delete-a-notification" tabindex="-1"><a class="header-anchor" href="#delete-a-notification" aria-hidden="true">#</a> Delete a Notification</h2><p>This API is mainly used for marking an inApp notification deleted. It has the same effect as updating a notification with state set to <em>deleted</em>.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE /notifications/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>permissions required, one of <ul><li>super admin</li><li>admin</li><li>authenticated user</li></ul></li><li>inputs <ul><li>notification id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li></ul></li><li>outcome: same as the outcome of <a href="#update-a-notification">Update a Notification</a> with <em>state</em> set to <em>deleted</em>.</li></ul><h2 id="replace-a-notification" tabindex="-1"><a class="header-anchor" href="#replace-a-notification" aria-hidden="true">#</a> Replace a Notification</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /notifications/{id}\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>This API is intended to be only used by admin web console to modify a notification in <em>new</em> state. Notifications in such state are typically future-dated or of channel <em>in-app</em>.</p><ul><li><p>permissions required, one of</p><ul><li>super admin</li><li>admin</li></ul></li><li><p>inputs</p><ul><li>notification id <ul><li>parameter name: id</li><li>required: true</li><li>parameter type: path</li><li>data type: string</li></ul></li><li>notification data <ul><li>parameter name: data</li><li>required: true</li><li>parameter type: body</li><li>data type: object</li></ul></li></ul></li><li><p>outcome</p><p><em>NotifyBC</em> process the request same way as <a href="#createsend-notifications">Create/Send Notifications</a> except that notification data is saved with <em>id</em> supplied in the parameter, replacing existing one.</p></li></ul>', 12);
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("ul", null, [
      _hoisted_16,
      createBaseVNode("li", null, [
        createTextVNode("inputs "),
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("a filter defining fields, where, include, order, offset, and limit. See "),
            createBaseVNode("a", _hoisted_17, [
              createTextVNode("Loopback Querying Data"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            createTextVNode(" for valid syntax and examples "),
            _hoisted_18
          ])
        ])
      ]),
      _hoisted_19
    ]),
    _hoisted_20,
    createBaseVNode("ul", null, [
      _hoisted_22,
      createBaseVNode("li", null, [
        _hoisted_23,
        createBaseVNode("ul", null, [
          createBaseVNode("li", null, [
            createTextVNode("a "),
            createBaseVNode("a", _hoisted_24, [
              createTextVNode("where filter"),
              createVNode(_component_ExternalLinkIcon)
            ]),
            _hoisted_25
          ])
        ])
      ]),
      _hoisted_26
    ]),
    _hoisted_27,
    createBaseVNode("ul", null, [
      _hoisted_29,
      createBaseVNode("li", null, [
        _hoisted_31,
        _hoisted_32,
        createBaseVNode("ol", null, [
          _hoisted_33,
          createBaseVNode("li", null, [
            _hoisted_39,
            createBaseVNode("ol", null, [
              _hoisted_40,
              createBaseVNode("li", null, [
                createBaseVNode("p", null, [
                  createTextVNode("the subscriptions are partitioned and processed concurrently as described in config section "),
                  createVNode(_component_RouterLink, { to: "/docs/config-notification/#broadcast-push-notification-task-concurrency" }, {
                    default: withCtx(() => [
                      createTextVNode("Broadcast Push Notification Task Concurrency")
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ])
              ]),
              _hoisted_41
            ]),
            _hoisted_42
          ]),
          _hoisted_43
        ])
      ]),
      _hoisted_49
    ]),
    _hoisted_50
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-46ba3355.js.map
