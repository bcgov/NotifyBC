// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {AnyObject, Filter} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Command} from 'commander';

let server: any;
module.exports.mailParser = require('mailparser');
module.exports.app = function (...argsArr: any[]) {
  return new Promise((resolve, reject) => {
    let app, cb: Function | undefined;
    if (argsArr.length > 0) {
      if (argsArr[0] instanceof Object) {
        app = argsArr[0];
      }
      if (argsArr[argsArr.length - 1] instanceof Function) {
        cb = argsArr[argsArr.length - 1];
      }
    }

    if (server) {
      resolve(server);
      return cb && process.nextTick(cb.bind(null, null, server));
    }

    let urlPrefix = process.env.API_URL_PREFIX ?? 'http://localhost:3000/api';
    let port = process.env.LISTENING_SMTP_PORT ?? '0';
    let allowedSmtpDomains = process.env.ALLOWED_SMTP_DOMAINS?.split(',').map(
      e => e.trim().toLowerCase(),
    );
    let bounceUnsubThreshold = parseInt(
      process.env.BOUNCE_UNSUBSCRIBE_THRESHOLD ?? '5',
    );
    const smtpOptsString = process.env.SMTP_SERVER_OPTIONS;
    let smtpOpts = (smtpOptsString && JSON.parse(smtpOptsString)) || {};
    let handleBounce: any = process.env.SMTP_HANDLE_BOUNCE;
    let bounceSubjectRegex =
      process.env.BOUNCE_SUBJECT_REGEX &&
      new RegExp(process.env.BOUNCE_SUBJECT_REGEX);
    let bounceSmtpStatusCodeRegex =
      process.env.BOUNCE_SMTP_STATUS_CODE_REGEX &&
      new RegExp(process.env.BOUNCE_SMTP_ERROR_CODE_REGEX as string);
    let bounceFailedRecipientRegex =
      process.env.BOUNCE_FAILED_RECIPIENT_REGEX &&
      new RegExp(process.env.BOUNCE_FAILED_RECIPIENT_REGEX);

    if (app) {
      const smtpSvr = app.email.inboundSmtpServer;
      const internalHttpHost = app.internalHttpHost;
      if (internalHttpHost) {
        urlPrefix = internalHttpHost + app.restApiRoot;
      }
      smtpSvr.listeningSmtpPort && (port = smtpSvr.listeningSmtpPort);
      smtpSvr.domain &&
        (allowedSmtpDomains = smtpSvr.domain
          .split(',')
          .map((e: string) => e.trim().toLowerCase()));
      smtpSvr.options && (smtpOpts = smtpSvr.options);
      if (app.email?.bounce?.enabled !== undefined) {
        handleBounce = app.email.bounce.enabled;
      }
      bounceUnsubThreshold = app.email.bounce.unsubThreshold;
      if (
        app.email.bounce.subjectRegex &&
        app.email.bounce.subjectRegex.length > 0
      ) {
        bounceSubjectRegex = new RegExp(app.email.bounce.subjectRegex);
      }
      bounceSmtpStatusCodeRegex = new RegExp(
        app.email.bounce.smtpStatusCodeRegex,
      );
      if (
        app.email.bounce.failedRecipientRegex &&
        app.email.bounce.failedRecipientRegex.length > 0
      ) {
        bounceFailedRecipientRegex = new RegExp(
          app.email.bounce.failedRecipientRegex,
        );
      }
    }
    if (require.main === module) {
      const program = new Command();
      program
        .name(`node ${process.argv[1]}`)
        .showHelpAfterError()
        .option(
          '-a, --api-url-prefix <string>',
          'NotifyBC api url prefix',
          'http://localhost:3000/api',
        )
        .option(
          '-d, --allowed-smtp-domains <strings...>',
          'allowed recipient email domains; if missing all are allowed; repeat the option to create multiple entries.',
        )
        .option(
          '-p, --listening-smtp-port <integer>',
          'if missing a random free port is chosen. Proxy is required if port is not 25.',
        )
        .option('-b, --handle-bounce', 'enable bounce handling.')
        .option(
          '-B, --bounce-unsubscribe-threshold <integer>',
          'bounce count threshold above which unsubscribe all.',
        )
        .option(
          '-s, --bounce-subject-regex <string>',
          'bounce email subject regex',
        )
        .option(
          '-r, --bounce-smtp-status-code-regex <string>',
          'bounce smtp status code regex',
        )
        .option(
          '-R, --bounce-failed-recipient-regex <string>',
          'bounce failed recipient regex',
        )
        .option(
          '-o, --smtp-server-options <string>',
          'stringified json smtp server options',
        );

      program.parse();
      const opts = program.opts();
      opts['apiUrlPrefix'] && (urlPrefix = opts['apiUrlPrefix']);
      opts['listeningSmtpPort'] && (port = opts['listeningSmtpPort']);
      opts['allowedSmtpDomains'] &&
        (allowedSmtpDomains = opts['allowedSmtpDomains'].map((e: string) =>
          e.toLowerCase(),
        ));
      opts['bounceUnsubscribeThreshold'] &&
        (bounceUnsubThreshold = parseInt(opts['bounceUnsubscribeThreshold']));
      opts['smtpServerOptions'] &&
        (smtpOpts = JSON.parse(opts['smtpServerOptions']));
      opts['handleBounce'] !== undefined &&
        (handleBounce = opts['handleBounce']);
      opts['bounceSubjectRegex'] &&
        (bounceSubjectRegex = new RegExp(opts['bounceSubjectRegex']));
      opts['bounceSmtpStatusCodeRegex'] &&
        (bounceSmtpStatusCodeRegex = new RegExp(
          opts['bounceSmtpStatusCodeRegex'],
        ));
      opts['bounceFailedRecipientRegex'] &&
        (bounceFailedRecipientRegex = new RegExp(
          opts['bounceFailedRecipientRegex'],
        ));
    }
    const SMTPServer = require('smtp-server').SMTPServer;
    const validEmailRegEx = /(un|bn)-(.+?)-(.*)@(.+)/;
    const _ = require('lodash');
    const MaxMsgSize = 1000000;
    smtpOpts = _.assign({}, smtpOpts, {
      authOptional: true,
      disabledCommands: ['AUTH'],
      size: MaxMsgSize,
      onRcptTo(address: {address: string}, session: any, callback: Function) {
        try {
          const match = address.address.match(validEmailRegEx);
          if (match) {
            const domain = match[4];
            if (
              !allowedSmtpDomains ||
              allowedSmtpDomains.indexOf(domain.toLowerCase()) >= 0
            )
              return callback();
          }
        } catch (ex) {}
        return callback(new Error('invalid recipient'));
      },
      onData(stream: any, session: any, callback: Function) {
        stream.setEncoding('utf8');
        let msg = '';
        stream.on('data', (chunk: any) => {
          if (msg.length < MaxMsgSize) {
            msg += chunk;
          }
        });
        stream.on('end', async () => {
          for (const e of session.envelope.rcptTo) {
            const match = e.address.match(validEmailRegEx);
            const type = match[1];
            const id = match[2];
            const unsubscriptionCode = match[3];
            switch (type) {
              case 'un':
                await fetch(
                  urlPrefix +
                    '/subscriptions/' +
                    id +
                    '/unsubscribe?unsubscriptionCode=' +
                    encodeURIComponent(unsubscriptionCode) +
                    '&userChannelId=' +
                    encodeURIComponent(session.envelope.mailFrom.address),
                  {
                    headers: {
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      is_anonymous: 'true',
                    },
                  },
                );
                break;
              case 'bn': {
                if (!handleBounce) {
                  break;
                }
                let parsed: AnyObject = {};
                try {
                  parsed = await exports.mailParser.simpleParser(msg);
                } catch (err) {
                  console.error(err);
                  const error: any = new Error('parsing error');
                  error.responseCode = 451;
                  return callback(error);
                }
                let incrementBounceCnt = true;
                if (
                  incrementBounceCnt &&
                  bounceSubjectRegex &&
                  !parsed.subject?.match(bounceSubjectRegex)
                ) {
                  console.info(`subject doesn't match filter`);
                  incrementBounceCnt = false;
                }
                let smtpBody = parsed.html || parsed.text;
                if (parsed.attachments && parsed.attachments.length > 0) {
                  const deliveryStatusAttachment = parsed.attachments.find(
                    (ele: {contentType: string}) => {
                      return (
                        ele.contentType &&
                        ele.contentType.toLowerCase() ===
                          'message/delivery-status'
                      );
                    },
                  );
                  if (deliveryStatusAttachment?.content) {
                    smtpBody =
                      deliveryStatusAttachment.content.toString('utf8');
                  }
                }
                if (
                  incrementBounceCnt &&
                  !smtpBody?.match(bounceSmtpStatusCodeRegex)
                ) {
                  console.info(`smtp status code doesn't match filter`);
                  incrementBounceCnt = false;
                }
                let bouncedUserChannelId;
                if (bounceFailedRecipientRegex) {
                  const bouncedUserChannelIdMatch = smtpBody.match(
                    bounceFailedRecipientRegex,
                  );
                  if (bouncedUserChannelIdMatch) {
                    bouncedUserChannelId = bouncedUserChannelIdMatch[0];
                  }
                }
                const xfr = parsed.headers?.get('x-failed-recipients');
                if (xfr) {
                  bouncedUserChannelId = xfr;
                }
                let filter: Filter = {
                  where: {
                    id: id,
                    channel: 'email',
                    state: 'confirmed',
                    unsubscriptionCode: unsubscriptionCode,
                  },
                };
                let body;
                try {
                  const res = await fetch(
                    urlPrefix +
                      '/subscriptions?filter=' +
                      encodeURIComponent(JSON.stringify(filter)),
                  );
                  body = await res.json();
                } catch (err) {
                  console.error(err);
                  const error: any = new Error('processing error');
                  error.responseCode = 451;
                  return callback(error);
                }
                if (!(body instanceof Array) || body.length !== 1) {
                  return callback(null);
                }
                const userChannelId = body[0]?.userChannelId;
                if (
                  incrementBounceCnt &&
                  bouncedUserChannelId &&
                  userChannelId !== bouncedUserChannelId
                ) {
                  console.info(
                    `userChannelId ${userChannelId} mismatches bouncedUserChannelId ${bouncedUserChannelId}`,
                  );
                  incrementBounceCnt = false;
                }
                filter = {
                  where: {
                    channel: 'email',
                    state: 'active',
                    userChannelId: userChannelId,
                  },
                };
                try {
                  const res = await fetch(
                    urlPrefix +
                      '/bounces?filter=' +
                      encodeURIComponent(JSON.stringify(filter)),
                  );
                  body = await res.json();
                } catch (err) {
                  console.error(err);
                  const error: any = new Error('processing error');
                  error.responseCode = 451;
                  return callback(error);
                }
                let bncCnt = body?.[0]?.hardBounceCount || 0,
                  bncId = body?.[0]?.id;
                const bounceMessages = body?.[0]?.bounceMessages || [];
                if (incrementBounceCnt) {
                  bncCnt += 1;
                }
                bounceMessages.unshift({
                  date: new Date().toISOString(),
                  message: msg,
                });
                // upsert bounce
                if (bncId) {
                  await fetch(urlPrefix + '/bounces/' + bncId, {
                    method: 'PATCH',
                    body: JSON.stringify({
                      hardBounceCount: bncCnt,
                      bounceMessages: bounceMessages,
                    }),
                  });
                } else {
                  const res = await fetch(urlPrefix + '/bounces', {
                    method: 'POST',
                    body: JSON.stringify({
                      channel: 'email',
                      userChannelId: userChannelId,
                      hardBounceCount: bncCnt,
                      bounceMessages: bounceMessages,
                    }),
                  });
                  bncId = (await res.json()).id;
                }
                // unsub user
                if (bncCnt > bounceUnsubThreshold) {
                  const res = await fetch(
                    urlPrefix +
                      '/subscriptions/' +
                      id +
                      '/unsubscribe?unsubscriptionCode=' +
                      encodeURIComponent(unsubscriptionCode) +
                      '&userChannelId=' +
                      encodeURIComponent(userChannelId) +
                      '&additionalServices=_all',
                    {
                      headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        is_anonymous: 'true',
                      },
                      redirect: 'error',
                    },
                  );
                  if (res.status >= 400 || res.status < 200) {
                    throw HttpErrors(res.status);
                  }
                  await fetch(urlPrefix + '/bounces/' + bncId, {
                    method: 'PATCH',
                    body: JSON.stringify({
                      state: 'deleted',
                    }),
                  });
                }
                break;
              }
            }
          }
          return callback(null);
        });
      },
    });
    server = new SMTPServer(smtpOpts);
    server.on('error', () => {});
    server.listen(parseInt(port), function (this: any) {
      console.info(
        `smtp server started listening on port ${
          this.address().port
        }  with:\napi-url-prefix=${urlPrefix}`,
      );
      allowedSmtpDomains &&
        console.info(`allowed-smtp-domains=${allowedSmtpDomains}`);
      cb?.(null, server);
      resolve(server);
    });
  });
};
if (require.main === module) {
  module.exports.app();
}
