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

import { getQueueToken } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import dns from 'dns';
import { Request } from 'express';
import { get, merge, union } from 'lodash';
import net from 'net';
import { createTransport } from 'nodemailer';
import pluralize from 'pluralize';
import { BouncesService } from 'src/api/bounces/bounces.service';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { AppConfigService } from 'src/config/app-config.service';
import twilio from 'twilio';
import toSentence from 'underscore.string/toSentence';
import util, { promisify } from 'util';
import { ConfigurationsService } from '../api/configurations/configurations.service';
import { Configuration } from '../api/configurations/entities/configuration.entity';
import { Notification } from '../api/notifications/entities/notification.entity';
import { Subscription } from '../api/subscriptions/entities/subscription.entity';
const wait = promisify(setTimeout);

interface SMSBody {
  MessageBody: string;
  [key: string]: string;
}

export enum NotificationDispatchStatusField {
  failed,
  successful,
  skipped,
}

@Injectable()
export class CommonService {
  readonly appConfig;
  private readonly handleBounce;

  @Inject(getQueueToken('s'))
  private readonly smsQueue: Queue;

  @Inject(getQueueToken('e'))
  private readonly emailQueue: Queue;

  constructor(
    readonly appConfigService: AppConfigService,
    readonly configurationsService: ConfigurationsService,
    private readonly bouncesService: BouncesService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.appConfig = appConfigService.get();
    this.handleBounce = this.appConfig.email?.bounce?.enabled;
  }

  rateLimit(
    queue: Queue,
    fn: (...args: any[]) => Promise<any>,
    opts?: { priority?: number },
  ) {
    return function (...args: any[]): Promise<any> {
      return new Promise(async (resolve, reject) => {
        const queueEvents = new QueueEvents(queue.name, {
          connection: queue.opts.connection,
          prefix: queue.opts.prefix,
        });
        const queuedID = [];
        const queueEventHandler = async ({ jobId }) => {
          if (!j?.id) {
            queuedID.push(jobId);
            return;
          }
          if (jobId !== j?.id) {
            return;
          }
          Logger.debug(
            `job ${jobId} completed on queueEventsListener for ${j?.id}`,
            CommonService.name,
          );
          try {
            resolve(await fn.apply(this, args));
          } catch (ex) {
            reject(ex);
          }
          queueEvents.close();
        };
        // IMPORTANT: place queueEvents.on before myQueue.add
        queueEvents.on('completed', queueEventHandler);
        queueEvents.on('failed', queueEventHandler);

        await queueEvents.waitUntilReady();
        const j = await queue.add('', undefined, { priority: opts.priority });
        // extra guard in case queueEvents.on is called before j is assigned.
        if (queuedID.indexOf(j.id) >= 0) {
          try {
            resolve(await fn.apply(this, args));
          } catch (ex) {
            reject(ex);
          }
        }
      });
    };
  }

  static smsClient: any;

  async sendSMS(
    to: string,
    textBody: string,
    subscription: Partial<Subscription>,
    priority = 5,
  ) {
    const smsProvider = this.appConfig.sms.provider;
    const smsConfig = this.appConfig.sms.providerSettings[smsProvider];
    switch (smsProvider) {
      case 'swift': {
        const url = `${smsConfig['apiUrlPrefix']}${
          smsConfig['accountKey']
        }/${encodeURIComponent(to)}`;
        const body: SMSBody = {
          MessageBody: textBody,
        };
        if (subscription?.id) {
          body.Reference = subscription.id;
        }
        let req: any = fetch;
        if (this.appConfig?.sms?.throttle?.enabled) {
          req = this.rateLimit(this.smsQueue, req, { priority });
        }
        const res = await req(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
        if (res.status >= 400 || res.status < 200) {
          throw new Error(res);
        }
        return res;
      }
      default: {
        // Twilio Credentials
        const accountSid = smsConfig.accountSid;
        const authToken = smsConfig.authToken;
        //require the Twilio module and create a REST client
        CommonService.smsClient =
          CommonService.smsClient || twilio(accountSid, authToken);
        let req = CommonService.smsClient.messages.create.bind(
          CommonService.smsClient.messages,
        );
        if (this.appConfig?.sms?.throttle?.enabled) {
          req = this.rateLimit(this.smsQueue, req, { priority });
        }
        return req({
          to: to,
          from: smsConfig.fromNumber,
          body: textBody,
        });
      }
    }
  }

  transport: any;
  async sendEmail(mailOptions: any, priority = 5) {
    const smtpCfg = this.appConfig.email.smtp;
    if (!this.transport) {
      if (!smtpCfg?.host) {
        // create ethereal.email and transport
        const data = await this.configurationsService.findOne({
          where: {
            name: 'etherealAccount',
          },
        });
        this.transport = createTransport({
          host: data.value.smtp.host,
          port: data.value.smtp.port,
          secure: data.value.smtp.secure,
          auth: {
            user: data.value.user, // generated ethereal user
            pass: data.value.pass, // generated ethereal password
          },
        });
      } else {
        this.transport = createTransport(smtpCfg);
      }
    }
    let info;
    try {
      let sendMail = this.transport.sendMail.bind(this.transport);
      if (this.appConfig?.email?.throttle?.enabled) {
        sendMail = this.rateLimit(this.emailQueue, sendMail, { priority });
      }
      info = await sendMail(mailOptions);
      if (info?.accepted?.length < 1) {
        throw new Error('delivery failed');
      }
    } catch (ex: any) {
      if (
        smtpCfg.direct ||
        net.isIP(smtpCfg.host) ||
        ex.command !== 'CONN' ||
        ['ECONNECTION', 'ETIMEDOUT'].indexOf(ex.code) === -1
      ) {
        throw ex;
      }
      const dnsLookupAsync = util.promisify(dns.lookup);
      const addresses = await dnsLookupAsync(smtpCfg.host, { all: true });
      if (!(addresses instanceof Array)) {
        throw ex;
      }
      // do client retry if there are multiple addresses
      for (const [index, address] of addresses.entries()) {
        const newSmtpCfg = { ...smtpCfg, host: address.address };
        const transport = createTransport(newSmtpCfg);
        let sendMail = transport.sendMail.bind(transport);
        if (this.appConfig?.email?.throttle?.enabled) {
          sendMail = this.rateLimit(this.emailQueue, sendMail, { priority });
        }
        try {
          info = await sendMail(mailOptions);
          if (info?.accepted?.length < 1) {
            throw new Error('delivery failed');
          }
        } catch (newEx: any) {
          if (
            index < addresses.length - 1 &&
            newEx.command === 'CONN' &&
            ['ECONNECTION', 'ETIMEDOUT'].indexOf(newEx.code) >= 0
          ) {
            continue;
          }
          throw newEx;
        }
        break;
      }
    }
    return info;
  }

  mailMerge(
    srcTxt: any,
    subscription: Partial<Subscription>,
    notification: Partial<Notification>,
    req: any,
    ignoreSubscriptionData = false,
  ): any {
    let output = srcTxt;
    try {
      output = output.replace(
        /(?<!\\){subscription_confirmation_code(?<!\\)}/gi,
        subscription.confirmationRequest?.confirmationCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){service_name(?<!\\)}/gi,
        subscription.serviceName,
      );
    } catch (ex) {}
    try {
      if (output.match(/(?<!\\){unsubscription_service_names(?<!\\)}/i)) {
        const serviceNames = union(
          [subscription.serviceName],
          subscription.unsubscribedAdditionalServices
            ? subscription.unsubscribedAdditionalServices.names
            : [],
        );
        output = output.replace(
          /(?<!\\){unsubscription_service_names(?<!\\)}/gi,
          pluralize('service', serviceNames.length) +
            ' ' +
            toSentence(serviceNames),
        );
      }
    } catch (ex) {}
    let httpHost;
    try {
      if (subscription?.httpHost) {
        httpHost = subscription.httpHost;
      }
      if (req?.protocol) {
        if (typeof req.get == 'function') {
          httpHost = req.protocol + '://' + req.get('hostname');
        }
        if (req.hostname) {
          httpHost = `${req.protocol}://${req.hostname}`;
        }
      }
      if (req.instance?.httpHost) {
        httpHost = req.instance.httpHost;
      }
      if (this.appConfig.httpHost) {
        httpHost = this.appConfig.httpHost;
      }
      if (notification.httpHost) {
        httpHost = notification.httpHost;
      }
      output = output.replace(/(?<!\\){http_host(?<!\\)}/gi, httpHost);
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){rest_api_root(?<!\\)}/gi,
        this.appConfig.restApiRoot,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){subscription_id(?<!\\)}/gi,
        subscription.id,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){unsubscription_code(?<!\\)}/gi,
        subscription.unsubscriptionCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){unsubscription_url(?<!\\)}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          subscription.id +
          '/unsubscribe?unsubscriptionCode=' +
          subscription.unsubscriptionCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){unsubscription_all_url(?<!\\)}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          subscription.id +
          '/unsubscribe?unsubscriptionCode=' +
          subscription.unsubscriptionCode +
          '&additionalServices=_all',
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){subscription_confirmation_url(?<!\\)}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          subscription.id +
          '/verify?confirmationCode=' +
          subscription.confirmationRequest?.confirmationCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){unsubscription_reversion_url(?<!\\)}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          subscription.id +
          '/unsubscribe/undo?unsubscriptionCode=' +
          subscription.unsubscriptionCode,
      );
    } catch (ex) {}

    // for backward compatibilities
    try {
      output = output.replace(
        /(?<!\\){confirmation_code(?<!\\)}/gi,
        subscription.confirmationRequest?.confirmationCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){serviceName(?<!\\)}/gi,
        subscription.serviceName,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){restApiRoot(?<!\\)}/gi,
        this.appConfig.restApiRoot,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){subscriptionId(?<!\\)}/gi,
        subscription.id,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /(?<!\\){unsubscriptionCode(?<!\\)}/gi,
        subscription.unsubscriptionCode,
      );
    } catch (ex) {}
    // substitute all other tokens with matching data.data properties
    const matches = output.match(/(?<!\\){.+?(?<!\\)}/g);
    if (matches) {
      matches.forEach(function (e: string) {
        try {
          const token = (e.match(/(?<!\\){(.+)(?<!\\)}/) ?? [])[1];
          const tokenParts = token.split('::');
          let val: string;
          let subData = subscription.data;
          if (ignoreSubscriptionData || !subData) subData = {};
          switch (tokenParts[0]) {
            case 'subscription':
              val = get(subData, tokenParts[1]);
              break;
            case 'notification':
              val = get(notification.data ?? {}, tokenParts[1]);
              break;
            default:
              val = get(notification.data ?? subData, token);
          }
          if (val) {
            output = output.replace(e, val);
          }
        } catch (ex) {}
      });
    }
    // unescape delimiter
    output = output.replace(/\\{(.+?)\\}/g, '{$1}');
    return output;
  }

  async getMergedConfig(configName: string, serviceName: string) {
    const data = await this.configurationsService.findOne({
      where: {
        name: configName,
        serviceName: serviceName,
      },
    });
    let res;
    try {
      res = merge({}, this.appConfig[configName]);
    } catch (ex) {}
    try {
      res = merge({}, res, (data as Configuration).value);
    } catch (ex) {}
    return res;
  }

  async updateBounces(
    userChannelIds: string[] | string,
    dataNotification: Notification,
    req: Request,
  ) {
    if (!this.handleBounce) {
      return;
    }
    let userChannelIdQry: any = userChannelIds;
    if (userChannelIds instanceof Array) {
      userChannelIdQry = {
        $in: userChannelIds,
      };
    }
    await this.bouncesService.updateAll(
      {
        latestNotificationStarted: dataNotification.updated,
        latestNotificationEnded: new Date(),
      },
      {
        state: 'active',
        channel: dataNotification.channel,
        userChannelId: userChannelIdQry,
        $or: [
          {
            latestNotificationStarted: null,
          },
          {
            latestNotificationStarted: {
              $lt: dataNotification.updated,
            },
          },
        ],
      },
      req,
    );
  }

  async updateBroadcastPushNotificationStatus(
    data,
    field: NotificationDispatchStatusField,
    payload: any,
    req?: (Request & { user?: any }) | null,
  ) {
    let success = false;
    while (!success) {
      try {
        const val = payload instanceof Array ? { $each: payload } : payload;
        await this.notificationsService.updateById(
          data.id,
          {
            $addToSet: {
              ['dispatch.' + NotificationDispatchStatusField[field]]: val,
            },
          },
          req,
        );
        success = true;
        return;
      } catch (ex) {}
      await wait(1000);
    }
  }
}
