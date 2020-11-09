import {inject} from '@loopback/context';
import {ApplicationConfig, CoreBindings} from '@loopback/core';
import {repository} from '@loopback/repository';
import axios from 'axios';
import _ from 'lodash';
import {Configuration} from '../models';
import {ConfigurationRepository} from '../repositories';

const toSentence = require('underscore.string/toSentence');
const pluralize = require('pluralize');

interface SMSBody {
  MessageBody: string;
  [key: string]: string;
}

export class BaseController {
  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
  ) {}

  smsClient: any;
  async sendSMS(to: string, textBody: string, data: any, cb?: Function) {
    let smsServiceProvider = this.appConfig.smsServiceProvider;
    let smsConfig = this.appConfig.sms[smsServiceProvider];
    switch (smsServiceProvider) {
      case 'swift':
        try {
          let url = `${smsConfig['apiUrlPrefix']}${
            smsConfig['accountKey']
          }/${encodeURIComponent(to)}`;
          let body: SMSBody = {
            MessageBody: textBody,
          };
          if (data && data.id) {
            body.Reference = data.id;
          }
          await axios.post(url, body, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          });
        } catch (ex) {
          return cb && cb(ex);
        }
        cb && cb();
        break;
      default:
        // Twilio Credentials
        var accountSid = smsConfig.accountSid;
        var authToken = smsConfig.authToken;
        //require the Twilio module and create a REST client
        this.smsClient =
          this.smsClient || require('twilio')(accountSid, authToken);

        this.smsClient.messages.create(
          {
            to: to,
            from: smsConfig.fromNumber,
            body: textBody,
          },
          function (err: any, message: any) {
            cb && cb(err, message);
          },
        );
    }
  }

  nodemailer = require('nodemailer');
  directTransport = require('nodemailer-direct-transport');
  transporter: any;
  sendEmail(mailOptions: any, cb?: Function) {
    return new Promise((resolve, reject) => {
      if (!this.transporter) {
        let smtpCfg = this.appConfig.smtp || this.appConfig.defaultSmtp;
        if (smtpCfg.direct) {
          this.transporter = this.nodemailer.createTransport(
            this.directTransport(smtpCfg),
          );
        } else {
          this.transporter = this.nodemailer.createTransport(smtpCfg);
        }
      }
      this.transporter.sendMail(mailOptions, function (error: any, info: any) {
        try {
          if (!error && info.accepted.length < 1) {
            error = new Error('delivery failed');
          }
        } catch (ex) {}
        if (cb) {
          return cb(error, info);
        } else {
          if (error) {
            return reject(error);
          } else {
            return resolve(info);
          }
        }
      });
    });
  }

  mailMerge(srcTxt: any, data: any, httpCtx: any) {
    let output = srcTxt;
    try {
      output = output.replace(
        /\{subscription_confirmation_code\}/gi,
        data.confirmationRequest.confirmationCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(/\{service_name\}/gi, data.serviceName);
    } catch (ex) {}
    try {
      if (output.match(/\{unsubscription_service_names\}/i)) {
        let serviceNames = _.union(
          [data.serviceName],
          data.unsubscribedAdditionalServices
            ? data.unsubscribedAdditionalServices.names
            : [],
        );
        output = output.replace(
          /\{unsubscription_service_names\}/gi,
          pluralize('service', serviceNames.length) +
            ' ' +
            toSentence(serviceNames),
        );
      }
    } catch (ex) {}
    let httpHost;
    try {
      let req = httpCtx.req || httpCtx.request;
      if (req) {
        httpHost = req.protocol + '://' + req.get('host');
      }
      if (this.appConfig.httpHost) {
        httpHost = this.appConfig.httpHost;
      }
      if (httpCtx.args && httpCtx.args.data && httpCtx.args.data.httpHost) {
        httpHost = httpCtx.args.data.httpHost;
      } else if (httpCtx.instance && httpCtx.instance.httpHost) {
        httpHost = httpCtx.instance.httpHost;
      } else if (data && data.httpHost) {
        httpHost = data.httpHost;
      }
      output = output.replace(/\{http_host\}/gi, httpHost);
    } catch (ex) {}
    try {
      output = output.replace(
        /\{rest_api_root\}/gi,
        this.appConfig.restApiRoot,
      );
    } catch (ex) {}
    try {
      output = output.replace(/\{subscription_id\}/gi, data.id);
    } catch (ex) {}
    try {
      output = output.replace(
        /\{unsubscription_code\}/gi,
        data.unsubscriptionCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /\{unsubscription_url\}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          data.id +
          '/unsubscribe?unsubscriptionCode=' +
          data.unsubscriptionCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /\{unsubscription_all_url\}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          data.id +
          '/unsubscribe?unsubscriptionCode=' +
          data.unsubscriptionCode +
          '&additionalServices=_all',
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /\{subscription_confirmation_url\}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          data.id +
          '/verify?confirmationCode=' +
          data.confirmationRequest.confirmationCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(
        /\{unsubscription_reversion_url\}/gi,
        httpHost +
          this.appConfig.restApiRoot +
          '/subscriptions/' +
          data.id +
          '/unsubscribe/undo?unsubscriptionCode=' +
          data.unsubscriptionCode,
      );
    } catch (ex) {}

    // for backward compatibilities
    try {
      output = output.replace(
        /\{confirmation_code\}/gi,
        data.confirmationRequest.confirmationCode,
      );
    } catch (ex) {}
    try {
      output = output.replace(/\{serviceName\}/gi, data.serviceName);
    } catch (ex) {}
    try {
      output = output.replace(/\{restApiRoot\}/gi, this.appConfig.restApiRoot);
    } catch (ex) {}
    try {
      output = output.replace(/\{subscriptionId\}/gi, data.id);
    } catch (ex) {}
    try {
      output = output.replace(
        /\{unsubscriptionCode\}/gi,
        data.unsubscriptionCode,
      );
    } catch (ex) {}
    try {
      if (data.data) {
        // substitute all other tokens with matching data.data properties
        let matches = output.match(/{.+?}/g);
        if (matches) {
          matches.forEach(function (e: string) {
            try {
              let token = (e.match(/{(.+)}/) || [])[1];
              let val = _.get(data.data, token);
              if (val) {
                output = output.replace(e, val);
              }
            } catch (ex) {}
          });
        }
      }
    } catch (ex) {}
    return output;
  }

  async getMergedConfig(
    configName: string,
    serviceName: string,
    next?: Function,
  ) {
    let data;
    try {
      data = await this.configurationRepository.findOne({
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
      res = _.merge({}, this.appConfig[configName]);
    } catch (ex) {}
    try {
      res = _.merge({}, res, (data as Configuration).value);
    } catch (ex) {}
    next && next(null, res);
    return res;
  }
}
