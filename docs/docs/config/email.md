---
permalink: /docs/config-email/
---

# Email

## SMTP

By default when no SMTP is specified, _NotifyBC_ uses fake SMTP service [Ethereal](https://ethereal.email/). Ethereal is only good for evaluation purpose as emails sent from _NotifyBC_ are delivered to Ethereal rather than actual recipients. You can access the emails from Ethereal. _NotifyBC_ automatically generates the Ethereal account first time and stores the account information in [configuration](../api/config.md) under name _etherealAccount_ accessible from _NotifyBC_ web console.

For production however, setting up SMTP is **mandatory**. To do so, add following _smtp_ config to _/src/config.local.js_

```js
module.exports = {
  //...
  email: {
    smtp: {
      host: '<your smtp host FQDN>',
      port: 25,
      pool: true,
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
};
```

Check out [Nodemailer](https://nodemailer.com/smtp/) for other config options that you can define. Fine-tuning some options are critical for performance. See [benchmark advices](../benchmarks/#advices).

## Throttle

_NotifyBC_ can throttle email requests if SMTP server imposes rate limit. To enable throttle and set rate limit, create following config in file _/src/config.local.js_

```js
module.exports = {
  email: {
    throttle: {
      enabled: true,
      max: 4,
      duration: 1000,
    },
  },
};
```

where

- _enabled_ - whether to enable throttle or not. Default to _false_.
- _max_ - max numbers of requests per duration. Default to 4.
- _duration_ - time span in ms. Default to 1000.

Above config throttles email to 4/sec.

## Inbound SMTP Server

_NotifyBC_ implemented an inbound SMTP server to handle

- [bounce](#bounce)
- [list-unsubscribe by email](#list-unsubscribe-by-email)

In order for the emails from internet to reach the SMTP server, a host
where one of the following servers should be listening on port 25
open to internet

1. _NotifyBC_, if it can be installed on such internet-facing host directly; otherwise,
2. a tcp proxy server, such as nginx with stream proxy module that can proxy tcp port 25 traffic to backend _NotifyBC_ instances.

Regardless which above option is chosen, you need to config _NotifyBC_ inbound SMTP server by adding following static config _email.inboundSmtpServer_ to file _/src/config.local.js_

```js
module.exports = {
  email: {
    inboundSmtpServer: {
      enabled: true,
      domain: 'host.foo.com',
      listeningSmtpPort: 25,
      options: {
        // ...
      },
    },
  },
};
```

where

- _enabled_ enables/disables the inbound SMTP server with default to _true_.
- _domain_ is the internet-facing host domain. It has no default so **must be set**.
- _listeningSmtpPort_ should be set to 25 if option 1 above is chosen. For options 2, _listeningSmtpPort_ can be set to any opening port. On Unix, _NotifyBC_ has to be run under _root_ account to bind to port 25. If missing, _NotifyBC_ will randomly select an available port upon launch which is usually undesirable so it **should be set**.
- optional _options_ object defines the behavior of [Nodemailer SMTP Server](https://nodemailer.com/extras/smtp-server/#step-3-create-smtpserver-instance).

::: warning Inbound SMTP Server on OpenShift
OpenShift deployment template deploys an inbound SMTP server. Due to the limitation that OpenShift can only expose port 80 and 443 to external, to use the SMTP server, you have to setup a TCP proxy server (i.e. option 2). The inbound SMTP server is exposed as ${INBOUND_SMTP_DOMAIN}:443 , where ${INBOUND_SMTP_DOMAIN} is a template parameter which in absence, a default domain will be created. Configure your TCP proxy server to route traffic to \${INBOUND_SMTP_DOMAIN}:443 over TLS.
:::

### TCP Proxy Server

If _NotifyBC_ is not able to bind to port 25 that opens to internet, perhaps
due to firewall restriction, you can setup a TCP Proxy Server such as Nginx with [ngx_stream_proxy_module](http://nginx.org/en/docs/stream/ngx_stream_proxy_module.html). For example, the following nginx config will proxy SMTP traffic from port 25 to a _NotifyBC_ inbound SMTP server running on OpenShift

```
stream {
    server {
        listen 25;
        proxy_pass ${INBOUND_SMTP_DOMAIN}:443;
        proxy_ssl on;
        proxy_ssl_verify off;
        proxy_ssl_server_name on;
        proxy_connect_timeout 10s;
    }
}
```

Replace _\${INBOUND_SMTP_DOMAIN}_ with the inbound SMTP server route domain.

## Bounce

Bounces, or Non-Delivery Reports (NDRs), are system-generated emails informing sender of failed delivery. _NotifyBC_ can be configured to receive bounces, record bounces, and automatically unsubscribe all subscriptions of a recipient if the number of recorded hard bounces against the recipient exceeds threshold. A deemed successful notification delivery deletes the bounce record.

Although _NotifyBC_ records all bounce emails, not all of them should count towards unsubscription threshold, but rather only the hard bounces - those which indicate permanent unrecoverable errors such as destination address no longer exists. In principle this can be distinguished using smtp response code. In practice, however, there are some challenges to make the distinction

- the smtp response code is not fully standardized and may vary by recipient's smtp server so it's unreliable
- there is no standard smtp header in bounce email to contain smtp response code. Often the response code is embedded in bounce email body.
- the bounce email template varies by sender's smtp server

To mitigate, _NotifyBC_ defines several customizable string pattern filters in terms of regular expression. Only bounce emails matched the filters count towards unsubscription threshold. It's a matter of trial-and-error to get the correct filter suitable to your smtp server.

::: tip to improve hard bounce recognition
Send non-existing emails to several external email systems. Inspect the bounce messages for common string patterns. After gone live, review bounce records in web console from time to time to identify new bounce types and decide whether the bounce types qualify as hard bounce. To avoid false positives resulting in premature unsubscription, it is advisable to start with a high unsubscription threshold.
:::

Bounce handling involves four actions

- during notification dispatching, envelop address is set to a [VERP](https://en.wikipedia.org/wiki/Variable_envelope_return_path) in the form _bn-{subscriptionId}-{unsubscriptionCode}@{inboundSmtpServerDomain}_ routed to _NotifyBC_ inbound smtp server.
- when a notification finished dispatching, the dispatching start and end time is recorded to all bounce records matching affects recipient addresses
- when inbound smtp server receives a bounce message, it updates the bounce record by saving the message and incrementing the hard bounce count when the message matches the filter criteria. The filter criteria are regular expressions matched against bounce email subject and body, as well as regular expression to extract recipient's email address from bounce email body. It also unsubscribes the user from all subscriptions when the hard bounce count exceeds a predefined threshold.
- A cron job runs periodically to delete bounce records if the latest notification is deemed delivered successfully.

To setup bounce handling

- set up [inbound smtp server](#inbound-smtp-server)
- verify config _email.bounce.enabled_ is set to true or absent in _/src/config.local.js_
- verify and adjust unsubscription threshold and bounce filter criteria if needed.
  Following is the default config in file _/src/config.ts_ compatible with [rfc 3464](https://tools.ietf.org/html/rfc3464)

  ```ts
  module.exports = {
    email: {
      bounce: {
        enabled: true,
        unsubThreshold: 5,
        subjectRegex: '',
        smtpStatusCodeRegex: '5\\.\\d{1,3}\\.\\d{1,3}',
        failedRecipientRegex:
          '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])',
      },
    },
  };
  ```

  where

  - _unsubThreshold_ is the threshold of hard bounce count above which the user is unsubscribed from all subscriptions
  - _subjectRegex_ is the regular expression that bounce message subject must match in order to count towards the threshold. If _subjectRegex_ is set to empty string or _undefined_, then this filter is disabled.
  - _smtpStatusCodeRegex_ is the regular expression that smtp status code embedded in the message body must match in order to count towards the threshold. The default value matches all [rfc3463](https://tools.ietf.org/html/rfc3463) class 5 status codes. For a multi-part bounce message, the body limits to the one of the following parts by content type in descending order

    - _message/delivery-status_
    - html
    - plain text

  - _failedRecipientRegex_ is the regular expression used to extract recipient's email address from bounce message body. This extracted recipient's email address is compared against the subscription record as a means of validation. If _failedRecipientRegex_ is set to empty string or _undefined_, then this validation method is skipped. The default RegEx is taken from a [stackoverflow answer](https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression). For a multi-part bounce message, the body limits to the one of the following parts by content type in descending order

    - _message/delivery-status_
    - html
    - plain text

- Change config of cron job [Delete Notification Bounces](../config-cronJobs/#delete-notification-bounces) if needed

## List-unsubscribe by Email

Some email clients provide a consistent UI to unsubscribe if an unsubscription email address is supplied. For example, newer iOS built-in email app will display following banner

<img :src="$withBase('/img/list-unsubscription.png')" alt="list unsubscription">

To support this unsubscription method, _NotifyBC_ implements a custom inbound SMTP server to transform received emails sent to address _un-{subscriptionId}-{unsubscriptionCode}@{inboundSmtpServerDomain}_ to _NotifyBC_ unsubscribing API calls. This unsubscription email address is generated by _NotifyBC_ and set in header _List-Unsubscribe_ of all notification emails.

To enable list-unsubscribe by email

- set up [inbound smtp server](#inbound-smtp-server)
- verify config _email.listUnsubscribeByEmail.enabled_ is set to true or absent in _/src/config.local.js_

To disable list-unsubscribe by email, set _email.listUnsubscribeByEmail.enabled_ to _false_ in _/src/config.local.js_

```js
module.exports = {
  email: {
    listUnsubscribeByEmail: { enabled: false },
  },
};
```
