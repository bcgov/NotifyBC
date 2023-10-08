import { Controller } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import dns from 'dns';
import { get, merge, union } from 'lodash';
import net from 'net';
import pluralize from 'pluralize';
import { AppConfigService } from 'src/config/app-config.service';
import toSentence from 'underscore.string/toSentence';
import util from 'util';
import { ConfigurationsService } from '../configurations/configurations.service';
import { Configuration } from '../configurations/entities/configuration.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';

interface SMSBody {
  MessageBody: string;
  [key: string]: string;
}

@Controller()
export class BaseController {
  readonly appConfig;
  constructor(
    readonly appConfigService: AppConfigService,
    readonly configurationsService: ConfigurationsService,
  ) {
    this.appConfig = appConfigService.get();
  }

  static smsClient: any;
  static smsLimiter: Bottleneck;
  async sendSMS(
    to: string,
    textBody: string,
    subscription: Partial<Subscription>,
  ) {
    if (!BaseController.smsLimiter && this.appConfig?.sms?.throttle?.enabled) {
      const smsThrottleCfg = Object.assign({}, this.appConfig.sms.throttle);
      delete smsThrottleCfg.enabled;
      BaseController.smsLimiter = new Bottleneck(smsThrottleCfg);
    }
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
        if (BaseController.smsLimiter) {
          req = BaseController.smsLimiter.wrap(req);
        }
        return req(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      }
      default: {
        // Twilio Credentials
        const accountSid = smsConfig.accountSid;
        const authToken = smsConfig.authToken;
        //require the Twilio module and create a REST client
        BaseController.smsClient =
          BaseController.smsClient || require('twilio')(accountSid, authToken);
        let req = BaseController.smsClient.messages.create;
        if (BaseController.smsLimiter) {
          req = BaseController.smsLimiter.wrap(req);
        }
        return req.call(BaseController.smsClient.messages, {
          to: to,
          from: smsConfig.fromNumber,
          body: textBody,
        });
      }
    }
  }

  nodemailer = require('nodemailer');
  directTransport = require('nodemailer-direct-transport');
  transport: any;
  static emailLimiter: Bottleneck;
  async sendEmail(mailOptions: any) {
    const smtpCfg =
      this.appConfig.email.smtp || this.appConfig.email.defaultSmtp;
    if (!this.transport) {
      if (smtpCfg.direct) {
        this.transport = this.nodemailer.createTransport(
          this.directTransport(smtpCfg),
        );
      } else {
        this.transport = this.nodemailer.createTransport(smtpCfg);
      }
    }
    if (
      !BaseController.emailLimiter &&
      this.appConfig?.email?.throttle?.enabled
    ) {
      const emailThrottleCfg = Object.assign({}, this.appConfig.email.throttle);
      delete emailThrottleCfg.enabled;
      BaseController.emailLimiter = new Bottleneck(emailThrottleCfg);
    }
    let info;
    try {
      let sendMail = this.transport.sendMail;
      if (BaseController.emailLimiter) {
        sendMail = BaseController.emailLimiter.wrap(sendMail);
      }
      info = await sendMail.call(this.transport, mailOptions);
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
        const newSmtpCfg = Object.assign({}, smtpCfg, {
          host: address.address,
        });
        const transport = this.nodemailer.createTransport(newSmtpCfg);
        let sendMail = transport.sendMail;
        if (BaseController.emailLimiter) {
          sendMail = BaseController.emailLimiter.wrap(sendMail);
        }
        try {
          info = await sendMail.call(transport, mailOptions);
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
      if (req) {
        httpHost = req.protocol + '://' + req.get('host');
      }
      if (this.appConfig.httpHost) {
        httpHost = this.appConfig.httpHost;
      }
      let args: any;
      try {
        args = req.getSync('args');
      } catch (ex) {}
      if (args?.data?.httpHost) {
        httpHost = args.data.httpHost;
      } else if (req.instance?.httpHost) {
        httpHost = req.instance.httpHost;
      } else if (subscription?.httpHost) {
        httpHost = subscription.httpHost;
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
          switch (tokenParts[0]) {
            case 'subscription':
              val = get(subscription.data ?? {}, tokenParts[1]);
              break;
            case 'notification':
              val = get(notification.data ?? {}, tokenParts[1]);
              break;
            default:
              val = get(notification.data ?? subscription.data ?? {}, token);
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

  async getMergedConfig(
    configName: string,
    serviceName: string,
    next?: Function,
  ) {
    let data;
    try {
      data = await this.configurationsService.findOne({
        where: {
          name: configName,
          serviceName: serviceName,
        },
      });
    } catch (ex) {
      if (next) {
        return next(ex, null);
      } else {
        throw ex;
      }
    }
    let res;
    try {
      res = merge({}, this.appConfig[configName]);
    } catch (ex) {}
    try {
      res = merge({}, res, (data as Configuration).value);
    } catch (ex) {}
    next?.(null, res);
    return res;
  }
}
