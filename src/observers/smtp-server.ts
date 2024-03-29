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

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import mailParser from 'mailparser';
import { AnyObject } from 'mongoose';
import path from 'path';
import { SMTPServer } from 'smtp-server';
import { FilterDto } from 'src/api/common/dto/filter.dto';
import { Subscription } from 'src/api/subscriptions/entities/subscription.entity';
import { AppModule } from 'src/app.module';
import { AppConfigService } from 'src/config/app-config.service';
export { mailParser };
const logger = new Logger(path.parse(__filename).name);

let server: any;

export function smtpServer(app) {
  return new Promise((resolve) => {
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

    const validEmailRegEx = /(un|bn)-(.+?)-(.*)@(.+)/;
    const MaxMsgSize = 1000000;
    const smtpOpts = {
      ...smtpSvr.options,
      authOptional: true,
      disabledCommands: ['AUTH'],
      size: MaxMsgSize,
      onRcptTo(
        address: { address: string },
        session: any,
        callback: (arg0?: Error) => any,
      ) {
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
      onData(stream: any, session: any, callback: (arg0?: Response) => any) {
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
                const res = await fetch(
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
                if (res.status >= 400) return callback(res);
                break;
              case 'bn': {
                if (!handleBounce) {
                  break;
                }
                let parsed: AnyObject = {};
                try {
                  parsed = await exports.mailParser.simpleParser(msg);
                } catch (err) {
                  logger.error(err);
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
                  logger.verbose(`subject doesn't match filter`);
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
                  logger.verbose(`smtp status code doesn't match filter`);
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
                  logger.error(err);
                  const error: any = new Error('processing error');
                  error.responseCode = 451;
                  return callback(error);
                }
                if (!Array.isArray(body) || body.length !== 1) {
                  return callback(null);
                }
                const userChannelId = body[0]?.userChannelId;
                if (
                  incrementBounceCnt &&
                  bouncedUserChannelId &&
                  userChannelId !== bouncedUserChannelId
                ) {
                  logger.verbose(
                    `userChannelId ${userChannelId} mismatches bouncedUserChannelId ${bouncedUserChannelId}`,
                  );
                  incrementBounceCnt = false;
                }
                filter = {
                  where: {
                    channel: 'email',
                    state: 'active',
                    userChannelId,
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
                  logger.error(err);
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
                  const res = await fetch(urlPrefix + '/bounces/' + bncId, {
                    method: 'PATCH',
                    body: JSON.stringify({
                      hardBounceCount: bncCnt,
                      bounceMessages: bounceMessages,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  if (res.status >= 400) return callback(res);
                } else {
                  const res = await fetch(urlPrefix + '/bounces', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      channel: 'email',
                      userChannelId: userChannelId,
                      hardBounceCount: bncCnt,
                      bounceMessages: bounceMessages,
                    }),
                  });
                  if (res.status >= 400) return callback(res);
                  bncId = (await res.json()).id;
                }
                // unsub user
                if (bncCnt > bounceUnsubThreshold) {
                  let res = await fetch(
                    urlPrefix +
                      '/subscriptions/' +
                      id +
                      '/unsubscribe?unsubscriptionCode=' +
                      encodeURIComponent(unsubscriptionCode) +
                      '&userChannelId=' +
                      encodeURIComponent(userChannelId) +
                      '&additionalServices=_all',
                    {
                      redirect: 'error',
                    },
                  );
                  if (res.status >= 400) return callback(res);
                  res = await fetch(urlPrefix + '/bounces/' + bncId, {
                    method: 'PATCH',
                    body: JSON.stringify({
                      state: 'deleted',
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  if (res.status >= 400) return callback(res);
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    server.on('error', () => {});
    server.listen(port, function (this: any) {
      logger.log(
        `smtp server started listening on port ${
          this.address().port
        }  with:\napi-url-prefix=${urlPrefix}`,
      );
      allowedSmtpDomains &&
        logger.log(`allowed-smtp-domains=${allowedSmtpDomains}`);
      resolve(server);
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get(AppConfigService).get();
  return smtpServer(appConfig);
}

if (require.main === module) {
  bootstrap();
}
