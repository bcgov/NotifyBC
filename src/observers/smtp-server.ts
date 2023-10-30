import { HttpException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AnyObject } from 'mongoose';
import { FilterDto } from 'src/api/common/dto/filter.dto';
import { Subscription } from 'src/api/subscriptions/entities/subscription.entity';
import { AppModule } from 'src/app.module';
import { AppConfigService } from 'src/config/app-config.service';

let server: any;
module.exports.mailParser = require('mailparser');
module.exports.app = function (app) {
  return new Promise((resolve, reject) => {
    if (server) {
      resolve(server);
    }

    let urlPrefix = 'http://localhost:3000/api';
    const smtpSvr = app.email.inboundSmtpServer;
    const internalHttpHost = app.internalHttpHost;
    if (internalHttpHost) {
      urlPrefix = internalHttpHost + app.restApiRoot;
    }

    const port = smtpSvr.listeningSmtpPort ?? 0;

    const allowedSmtpDomains = (smtpSvr.domain ?? '')
      .split(',')
      .map((e: string) => e.trim().toLowerCase());

    const bounceUnsubThreshold = app.email.bounce.unsubThreshold;

    let smtpOpts = smtpSvr.options ?? {};

    const handleBounce: boolean = app.email?.bounce?.enabled;

    let bounceSubjectRegex;
    if (
      app.email.bounce.subjectRegex &&
      app.email.bounce.subjectRegex.length > 0
    ) {
      bounceSubjectRegex = new RegExp(app.email.bounce.subjectRegex);
    }

    const bounceSmtpStatusCodeRegex = new RegExp(
      app.email.bounce.smtpStatusCodeRegex,
    );

    let bounceFailedRecipientRegex;
    if (
      app.email.bounce.failedRecipientRegex &&
      app.email.bounce.failedRecipientRegex.length > 0
    ) {
      bounceFailedRecipientRegex = new RegExp(
        app.email.bounce.failedRecipientRegex,
      );
    }

    const SMTPServer = require('smtp-server').SMTPServer;
    const validEmailRegEx = /(un|bn)-(.+?)-(.*)@(.+)/;
    const MaxMsgSize = 1000000;
    smtpOpts = {
      ...smtpOpts,
      authOptional: true,
      disabledCommands: ['AUTH'],
      size: MaxMsgSize,
      onRcptTo(address: { address: string }, session: any, callback: Function) {
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
                    (ele: { contentType: string }) => {
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
                let filter: FilterDto<Subscription> = {
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
                    throw new HttpException(res.statusText, res.status);
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
    };
    server = new SMTPServer(smtpOpts);
    server.on('error', () => {});
    server.listen(port, function (this: any) {
      console.info(
        `smtp server started listening on port ${
          this.address().port
        }  with:\napi-url-prefix=${urlPrefix}`,
      );
      allowedSmtpDomains &&
        console.info(`allowed-smtp-domains=${allowedSmtpDomains}`);
      resolve(server);
    });
  });
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appConfig = app.get(AppConfigService).get();
  module.exports.app(appConfig);
}

if (require.main === module) {
  bootstrap();
}
