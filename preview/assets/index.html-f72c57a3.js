import { _ as _export_sfc, r as resolveComponent, o as openBlock, c as createElementBlock, a as createBaseVNode, b as createTextVNode, d as createVNode, w as withCtx, e as createStaticVNode } from "./app-fffec9eb.js";
const index_html_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createStaticVNode('<h1 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h1><p><em>NotifyBC</em> is a general purpose API Server to manage subscriptions and dispatch notifications. It aims to implement some common backend processes of a notification service without imposing any constraints on the UI frontend, nor impeding other server components&#39; functionality. This is achieved by interacting with user browser and other server components through RESTful API and other standard protocols in a loosely coupled way.</p><h2 id="features" tabindex="-1"><a class="header-anchor" href="#features" aria-hidden="true">#</a> Features</h2><p><em>NotifyBC</em> facilitates both anonymous and authentication-enabled secure webapps implementing notification feature. A <em>NotifyBC</em> server instance supports multiple notification services. A service is a topic of interest that user wants to receive updates. It is used as the partition of notification messages and user subscriptions. A user may subscribe to a service in multiple push delivery channels allowed. A user may subscribe to multiple services. In-app pull notification doesn&#39;t require subscription as it&#39;s not intrusive to user.</p><h3 id="notification" tabindex="-1"><a class="header-anchor" href="#notification" aria-hidden="true">#</a> notification</h3><ul><li>both in-app pull notifications (a.k.a. messages or alerts) and push notifications</li><li>multiple push notifications delivery channels <ul><li>email</li><li>sms</li></ul></li><li>unicast and broadcast message types</li><li>future-dated notifications</li><li>for in-app pull notifications <ul><li>support read and deleted message states</li><li>message expiration</li><li>deleted messages are not deleted immediately for auditing and recovery purposes</li></ul></li><li>for broadcast push notifications <ul><li>allow both sync and async <em>POST</em> API calls. For async API call, an optional callback url is supported</li><li>can be auto-generated from RSS feeds</li><li>allow user to specify filter rules evaluated against data contained in the notification</li><li>allow sender to specify filter rules evaluated against data contained in the subscription</li><li>allow application developer to create custom filter functions used by the filter rules mentioned above</li></ul></li></ul><h3 id="subscription-and-un-subscription" tabindex="-1"><a class="header-anchor" href="#subscription-and-un-subscription" aria-hidden="true">#</a> subscription and un-subscription</h3><ul><li>verify the ownership of push notification subscription channel: <ul><li>generates confirmation code based on a regex input</li><li>send confirmation request to unconfirmed subscription channel</li><li>verify confirmation code</li></ul></li><li>generate random un-subscription code</li><li>send acknowledgement message after un-subscription for anonymous subscribers</li><li>bulk unsubscription</li><li>list-unsubscribe by email</li><li>track bounces and unsubscribe the recipient from all subscriptions when hard bounce count exceeds threshold</li><li>sms user can unsubscribe by replying a shortcode keyword with Swift sms provider</li></ul><h3 id="mail-merge" tabindex="-1"><a class="header-anchor" href="#mail-merge" aria-hidden="true">#</a> mail merge</h3><p>Strings in notification or subscription message that are enclosed between curly braces <em>{</em> <em>}</em> are called tokens, also known as placeholders. Tokens are replaced based on the context of notification or subscription when dispatching the message. To avoid treating a string between curly braces as a token, escape the curly braces with backslash <em>\\</em>. For example <em>\\{i_am_not_a_token\\}</em> is not a token. It will be rendered as <em>{i_am_not_a_token}</em>.</p><p>Tokens whose names are predetermined by <em>NotifyBC</em> are called static tokens; otherwise they are called dynamic tokens.</p><h4 id="static-tokens" tabindex="-1"><a class="header-anchor" href="#static-tokens" aria-hidden="true">#</a> static tokens</h4><p><em>NotifyBC</em> recognizes following case-insensitive static tokens. Most of the names are self-explanatory.</p>', 13);
const _hoisted_14 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "{subscription_confirmation_url}",
  -1
  /* HOISTED */
);
const _hoisted_15 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "{subscription_confirmation_code}",
  -1
  /* HOISTED */
);
const _hoisted_16 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "{service_name}",
  -1
  /* HOISTED */
);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createTextVNode("{http_host} - http host in the form "),
    /* @__PURE__ */ createBaseVNode("i", null, "http(s): //<host_name>:<port>"),
    /* @__PURE__ */ createTextVNode(". The value is obtained from the http request that triggers the message")
  ],
  -1
  /* HOISTED */
);
const _hoisted_18 = {
  href: "https://loopback.io/doc/en/lb4/Customizing-server-configuration.html#configure-the-base-path",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_19 = /* @__PURE__ */ createStaticVNode("<li>{subscription_id}</li><li>anonymous unsubscription related tokens <ul><li>{unsubscription_url}</li><li>{unsubscription_all_url} - url to unsubscribe all services the user has subscribed on this <i>NotifyBC</i> instance</li><li>{unsubscription_code}</li><li>{unsubscription_reversion_url}</li><li>{unsubscription_service_names} - includes {service_name} and additional services user has unsubscribed, prefixed with conditionally pluralized word <i>service</i>.</li></ul></li>", 2);
const _hoisted_21 = /* @__PURE__ */ createStaticVNode('<h4 id="dynamic-tokens" tabindex="-1"><a class="header-anchor" href="#dynamic-tokens" aria-hidden="true">#</a> dynamic tokens</h4><p>Dynamic tokens are replaced with correspondingly named sub-field of <em>data</em> field in the notification or subscription if exist. Qualify token name with <em>notification::</em> or <em>subscription::</em> to indicate the source of substitution. If token name is not qualified, then both notification and subscription are checked, with notification taking precedence. Nested and indexed sub-fields are supported.</p><p>Examples</p><ul><li><em>{notification::description}</em> is replaced with field <em>data.description</em> of the notification request if exist</li><li><em>{subscription::gender}</em> is replaced with field <em>data.gender</em> of the subscription if exist</li><li><em>{addresses[0].city}</em> is replaced with field <em>data.addresses[0].city</em> of the notification if exist; otherwise is replaced with field <em>data.addresses[0].city</em> of the subscription if exist</li><li><em>{nonexistingDataField}</em> is unreplaced if neither notification nor subscription contains <em>data.nonexistingDataField</em></li></ul><div class="custom-container tip"><p class="custom-container-title">Notification by RSS feeds relies on dynamic token</p><p>A notification created by RSS feeds relies on dynamic token to supply the context to message template. In this case the <i>data</i> field contains the RSS item.</p></div><h2 id="architecture" tabindex="-1"><a class="header-anchor" href="#architecture" aria-hidden="true">#</a> Architecture</h2><h3 id="request-types" tabindex="-1"><a class="header-anchor" href="#request-types" aria-hidden="true">#</a> Request Types</h3><p><em>NotifyBC</em>, designed to be a microservice, doesn&#39;t use full-blown ACL to secure API calls. Instead, it classifies incoming requests into admin and user types. The key difference is while both admin and user can subscribe to notifications, only admin can post notifications.</p><p>Each type has two subtypes based on following criteria</p>', 9);
const _hoisted_30 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "super-admin, if the request meets both of the following two requirements",
  -1
  /* HOISTED */
);
const _hoisted_31 = /* @__PURE__ */ createBaseVNode(
  "p",
  null,
  "The request carries one of the following two attributes",
  -1
  /* HOISTED */
);
const _hoisted_32 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  "the source ip is in the admin ip list",
  -1
  /* HOISTED */
);
const _hoisted_33 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_34 = /* @__PURE__ */ createBaseVNode(
  "li",
  null,
  [
    /* @__PURE__ */ createBaseVNode("p", null, "The request doesn't contain any of following case insensitive HTTP headers, with the first three being SiteMinder headers"),
    /* @__PURE__ */ createBaseVNode("ul", null, [
      /* @__PURE__ */ createBaseVNode("li", null, "sm_universalid"),
      /* @__PURE__ */ createBaseVNode("li", null, "sm_user"),
      /* @__PURE__ */ createBaseVNode("li", null, "smgov_userdisplayname"),
      /* @__PURE__ */ createBaseVNode("li", null, "is_anonymous")
    ])
  ],
  -1
  /* HOISTED */
);
const _hoisted_35 = /* @__PURE__ */ createStaticVNode('<li><p>admin, if the request is not super-admin and meets one of the following criteria</p><ul><li>has a valid access token associated with an builtin admin user created and logged in using the <em>administrator</em> api, and the request doesn&#39;t contain any HTTP headers listed above</li><li>has a valid OIDC access token containing customizable admin profile attributes</li></ul><div class="custom-container tip"><p class="custom-container-title">access token disambiguation</p><p>Here the term <em>access token</em> has been used to refer two different things</p><ol><li>the token associated with a builtin admin user</li><li>the token generated by OIDC provider.</li></ol><p>To reduce confusion, throughout the documentation the former is called <em>access token</em> and the latter is called <em>OIDC access token</em>.</p></div></li><li><p>authenticated user, if the request is neither super-admin nor admin, and meets one fo the following criteria</p><ul><li>contains any of the 3 SiteMinder headers listed above, and comes from either trusted SiteMinder proxy or admin ip list</li><li>contains a valid OIDC access token</li></ul></li><li><p>anonymous user, if the request doesn&#39;t meet any of the above criteria</p></li>', 3);
const _hoisted_38 = /* @__PURE__ */ createStaticVNode("<p>The only extra privileges that a super-admin has over admin are that super-admin can perform CRUD operations on <em>configuration</em>, <em>bounce</em> and <em>administrator</em> entities through REST API. In the remaining docs, when no further distinction is necessary, an admin request refers to both super-admin and admin request; a user request refers to both authenticated and anonymous request.</p><p>An admin request carries full authorization whereas user request has limited access. For example, a user request is not allowed to</p><ul><li>send notification</li><li>bypass the delivery channel confirmation process when subscribing to a service</li><li>retrieve push notifications through API (can only receive notification from push notification channel such as email)</li><li>retrieve in-app notifications that is not targeted to the current user</li></ul><p>The result of an API call to the same end point may differ depending on the request type. For example, the call <em>GET /notifications</em> without a filter will return all notifications to all users for an admin request, but only non-deleted, non-expired in-app notifications for authenticated user request, and forbidden for anonymous user request. Sometimes it is desirable for a request from admin ip list, which would normally be admin request, to be voluntarily downgraded to user request in order to take advantage of predefined filters such as the ones described above. This can be achieved by adding one of the HTTP headers listed above to the request. This is also why admin request is not determined by ip or token alone.</p>", 4);
const _hoisted_42 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_43 = ["src"];
const _hoisted_44 = /* @__PURE__ */ createStaticVNode('<h3 id="authentication-strategies" tabindex="-1"><a class="header-anchor" href="#authentication-strategies" aria-hidden="true">#</a> Authentication Strategies</h3><p>API requests to <em>NotifyBC</em> can be either anonymous or authenticated. As alluded in <a href="#request-types">Request Types</a> above, <em>NotifyBC</em> supports following authentication strategies</p><ol><li>ip whitelisting</li><li>client certificate</li><li>access token associated with an builtin admin user</li><li>OpenID Connect (OIDC)</li><li>CA SiteMinder</li></ol><p>Authentication is performed in above order. Once a request passed an authentication strategy, the rest strategies are skipped. A request that failed all authentication strategies is anonymous.</p><p>The mapping between authentication strategy and request type is</p><table class="tg"><tbody><tr><td class="tg-0pky" rowspan="2"></td><td class="tg-c3ow" colspan="2">Admin</td><td class="tg-c3ow" colspan="2">User</td></tr><tr><td class="tg-btxf">Super-admin</td><td class="tg-btxf">admin</td><td class="tg-btxf">authenticated</td><td class="tg-btxf">anonymous</td></tr><tr><td class="tg-0pky">ip whitelisting</td><td class="tg-c3ow">✔</td><td class="tg-c3ow"></td><td class="tg-c3ow"></td><td class="tg-c3ow"></td></tr><tr><td class="tg-btxf">client certifcate</td><td class="tg-abip">✔</td><td class="tg-abip"></td><td class="tg-abip"></td><td class="tg-abip"></td></tr><tr><td class="tg-0pky">access token</td><td class="tg-c3ow"></td><td class="tg-c3ow">✔</td><td class="tg-c3ow"></td><td class="tg-c3ow"></td></tr><tr><td class="tg-btxf">OIDC</td><td class="tg-abip"></td><td class="tg-abip">✔</td><td class="tg-abip">✔</td><td class="tg-abip"></td></tr><tr><td class="tg-0pky">SiteMinder</td><td class="tg-c3ow"></td><td class="tg-c3ow"></td><td class="tg-c3ow">✔</td><td class="tg-c3ow"></td></tr></tbody></table><div class="custom-container tip"><p class="custom-container-title">Which authentication strategy to use?</p><p>Because ip whitelist doesn&#39;t expire and client certificate usually has a relatively long expiration period (say one year), they are suitable for long-running unattended server processes such as server-side code of web apps, cron jobs, IOT sensors etc. The server processes have to be trusted because once authenticated, they have full privilege to <em>NotifyBC</em>. Usually the server processes and <em>NotifyBC</em> instance are in the same administrative domain, i.e. managed by the same admin group of an organization.</p><p>By contrast, OIDC and SiteMinder use short-lived tokens or session cookies. Therefore they are only suitable for interactive user sessions.</p><p>Access token associated with an builtin admin user should be avoided whenever possible.</p><p>Here are some common scenarios and recommendations</p><ul><li><p>For server-side code of web apps</p><ul><li>use OIDC if the web app is OIDC enabled and user requests can be proxied to <em>NotifyBC</em> by web app; otherwise</li><li>use ip whitelisting if obtaining ip is feasible; otherwise</li><li>use client certificate (requires a little more config than ip whitelisting)</li></ul></li><li><p>For front-end browser-based web apps such as SPAs</p><ul><li>use OIDC</li></ul></li><li><p>For server apps that send requests spontaneously such as IOT sensors, cron jobs</p><ul><li>use ip whitelisting if obtaining ip is feasible; otherwise</li><li>client certificate</li></ul></li><li><p>If <em>NotifyBC</em> is ued by a <em>SiteMinder</em> protected web apps and <em>NotifyBC</em> is also protected by <em>SiteMinder</em></p><ul><li>use SiteMinder</li></ul></li></ul></div><h2 id="application-framework" tabindex="-1"><a class="header-anchor" href="#application-framework" aria-hidden="true">#</a> Application Framework</h2>', 8);
const _hoisted_52 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_53 = {
  href: "https://loopback.io/",
  target: "_blank",
  rel: "noopener noreferrer"
};
const _hoisted_54 = /* @__PURE__ */ createBaseVNode(
  "em",
  null,
  "NotifyBC",
  -1
  /* HOISTED */
);
const _hoisted_55 = {
  href: "https://loopback.io/doc/en/lb4",
  target: "_blank",
  rel: "noopener noreferrer"
};
function _sfc_render(_ctx, _cache) {
  const _component_ExternalLinkIcon = resolveComponent("ExternalLinkIcon");
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createElementBlock("div", null, [
    _hoisted_1,
    createBaseVNode("ul", null, [
      _hoisted_14,
      _hoisted_15,
      _hoisted_16,
      _hoisted_17,
      createBaseVNode("li", null, [
        createTextVNode("{rest_api_root} - configured Loopback "),
        createBaseVNode("a", _hoisted_18, [
          createTextVNode("REST API basePath"),
          createVNode(_component_ExternalLinkIcon)
        ])
      ]),
      _hoisted_19
    ]),
    _hoisted_21,
    createBaseVNode("ul", null, [
      createBaseVNode("li", null, [
        _hoisted_30,
        createBaseVNode("ol", null, [
          createBaseVNode("li", null, [
            _hoisted_31,
            createBaseVNode("ul", null, [
              _hoisted_32,
              createBaseVNode("li", null, [
                createTextVNode("has a client certificate that is signed using "),
                _hoisted_33,
                createTextVNode(" server certificate. See "),
                createVNode(_component_RouterLink, { to: "/docs/config/certificates.html#client-certificate-authentication" }, {
                  default: withCtx(() => [
                    createTextVNode("Client certificate authentication")
                  ]),
                  _: 1
                  /* STABLE */
                }),
                createTextVNode(" on how to sign.")
              ])
            ])
          ]),
          _hoisted_34
        ])
      ]),
      _hoisted_35
    ]),
    _hoisted_38,
    createBaseVNode("p", null, [
      createTextVNode("The way "),
      _hoisted_42,
      createTextVNode(" interacts with other components is diagrammed below. "),
      createBaseVNode("img", {
        src: _ctx.$withBase("/img/architecture.svg"),
        alt: "architecture diagram"
      }, null, 8, _hoisted_43)
    ]),
    _hoisted_44,
    createBaseVNode("p", null, [
      _hoisted_52,
      createTextVNode(" is created on Node.js "),
      createBaseVNode("a", _hoisted_53, [
        createTextVNode("LoopBack"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(". Contributors to source code of "),
      _hoisted_54,
      createTextVNode(" should be familiar with LoopBack. "),
      createBaseVNode("a", _hoisted_55, [
        createTextVNode("LoopBack Docs"),
        createVNode(_component_ExternalLinkIcon)
      ]),
      createTextVNode(" serves a good complement to this documentation.")
    ])
  ]);
}
const index_html = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "index.html.vue"]]);
export {
  index_html as default
};
//# sourceMappingURL=index.html-f72c57a3.js.map
