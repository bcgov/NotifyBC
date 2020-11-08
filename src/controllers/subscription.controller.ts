import {
  ApplicationConfig,
  CoreBindings,
  inject,
  intercept,
} from '@loopback/core';
import {Filter, Where} from '@loopback/filter';
import {Count, CountSchema, DataObject, repository} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  HttpErrors,
  MiddlewareContext,
  oas,
  param,
  ParameterObject,
  patch,
  post,
  put,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import _ from 'lodash';
import {
  AdminInterceptor,
  AuthenticatedOrAdminInterceptor,
  SubscriptionAfterRemoteInteceptor,
} from '../interceptors';
import {Subscription} from '../models';
import {ConfigurationRepository, SubscriptionRepository} from '../repositories';
import {BaseController} from './base.controller';
var RandExp = require('randexp');
const path = require('path');

@intercept(SubscriptionAfterRemoteInteceptor.BINDING_KEY)
@oas.tags('subscription')
export class SubscriptionController extends BaseController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
    private httpContext: MiddlewareContext,
  ) {
    super(appConfig, configurationRepository);
  }

  @post('/subscriptions', {
    summary: 'create a subscription',
    responses: {
      '200': {
        description: 'Subscription model instance',
        content: {'application/json': {schema: {'x-ts-type': Subscription}}},
      },
    },
  })
  async create(
    @requestBody() subscription: Subscription,
  ): Promise<Subscription> {
    if (!this.configurationRepository.isAdminReq(this.httpContext)) {
      delete subscription.state;
      const userId = this.configurationRepository.getCurrentUser(
        this.httpContext,
      );
      if (!userId) {
        // anonymous user is not allowed to supply data,
        // which could be used in mail merge
        delete subscription.data;
      }
    }
    delete subscription.id;
    await this.beforeUpsert(this.httpContext, subscription);
    let result = await this.subscriptionRepository.create(subscription);
    if (!result.confirmationRequest) {
      return result;
    }
    await this.handleConfirmationRequest(this.httpContext, result);
    return result;
  }

  @intercept(AuthenticatedOrAdminInterceptor.BINDING_KEY)
  @get('/subscriptions/count', {
    summary: 'count subscriptions',
    responses: {
      '200': {
        description: 'Subscription model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.count(where);
  }

  @intercept(AuthenticatedOrAdminInterceptor.BINDING_KEY)
  @get('/subscriptions', {
    summary: 'get subscriptions',
    responses: {
      '200': {
        description: 'Array of Subscription model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Subscription}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Subscription))
    filter?: Filter,
  ): Promise<Subscription[]> {
    return this.subscriptionRepository.find(filter);
  }

  @intercept(AuthenticatedOrAdminInterceptor.BINDING_KEY)
  @patch('/subscriptions/{id}', {
    summary: 'update a subscription',
    responses: {
      '204': {
        description: 'Subscription PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() subscription: DataObject<Subscription>,
  ): Promise<void> {
    const instance = await this.subscriptionRepository.findById(id);
    var filteredData = _.merge({}, instance);
    if (
      subscription.userChannelId &&
      filteredData.userChannelId !== subscription.userChannelId
    ) {
      filteredData.state = 'unconfirmed';
      filteredData.userChannelId = subscription.userChannelId;
    }
    await this.beforeUpsert(this.httpContext, filteredData);
    await this.subscriptionRepository.updateById(id, filteredData);
    if (!filteredData.confirmationRequest) {
      return;
    }
    await this.handleConfirmationRequest(this.httpContext, filteredData);
  }

  @intercept(AdminInterceptor.BINDING_KEY)
  @put('/subscriptions/{id}', {
    summary: 'replace a subscription',
    responses: {
      '204': {
        description: 'Subscription PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.replaceById(id, subscription);
  }

  static readonly additionalServicesParamSpec: ParameterObject = {
    name: 'additionalServices',
    in: 'query',
    schema: {
      type: 'array',
      items: {type: 'string'},
    },
    description:
      'additonal services to unsubscribe. If there is only one item and the value is _all, then unsubscribe all subscribed services.',
  };
  static readonly idParamSpec: Partial<ParameterObject> = {
    description: 'subscription id',
  };
  static readonly unsubscriptionCodeParamSpec: Partial<ParameterObject> = {
    description:
      'unsubscription code, may be required for unauthenticated user request',
  };
  static readonly userChannelIdParamSpec: Partial<ParameterObject> = {
    description:
      'optional. Used in validation along with unsubscriptionCode if populated.',
  };
  @del('/subscriptions/{id}', {
    summary: 'unsubscribe by id',
    responses: {
      '200': {
        description: 'Request was successful',
      },
    },
  })
  async deleteById(
    @param.path.string('id', SubscriptionController.idParamSpec) id: string,
    @param.query.string(
      'unsubscriptionCode',
      SubscriptionController.unsubscriptionCodeParamSpec,
    )
    unsubscriptionCode: string,
    @param.query.string(
      'userChannelId',
      SubscriptionController.userChannelIdParamSpec,
    )
    userChannelId?: string,
    @param(SubscriptionController.additionalServicesParamSpec)
    additionalServices?: string[],
  ): Promise<void> {
    const instance = await this.subscriptionRepository.findById(id);
    let mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );
    let anonymousUnsubscription =
      mergedSubscriptionConfig.anonymousUnsubscription;
    try {
      let forbidden = false;
      if (!this.configurationRepository.isAdminReq(this.httpContext)) {
        var userId = this.configurationRepository.getCurrentUser(
          this.httpContext,
        );
        if (userId) {
          if (userId !== instance.userId) {
            forbidden = true;
          }
        } else {
          if (
            instance.unsubscriptionCode &&
            unsubscriptionCode !== instance.unsubscriptionCode
          ) {
            forbidden = true;
          }
          try {
            if (
              userChannelId &&
              instance.userChannelId.toLowerCase() !==
                userChannelId.toLowerCase()
            ) {
              forbidden = true;
            }
          } catch (ex) {}
        }
      }
      if (instance.state !== 'confirmed') {
        forbidden = true;
      }
      if (forbidden) {
        throw new HttpErrors[403]('Forbidden');
      }
      let unsubscribeItems = async (
        query: Where<Subscription>,
        additionalServices?: string | AdditionalServices,
      ) => {
        await this.subscriptionRepository.updateAll(
          {
            state: 'deleted',
          },
          query,
        );
        let handleUnsubscriptionResponse = async () => {
          // send acknowledgement notification
          try {
            let msg =
              anonymousUnsubscription.acknowledgements.notification[
                instance.channel
              ];
            let textBody;
            switch (instance.channel) {
              case 'sms':
                textBody = this.mailMerge(
                  msg.textBody,
                  instance,
                  this.httpContext,
                );
                await this.sendSMS(instance.userChannelId, textBody, instance);
                break;
              case 'email': {
                var subject = this.mailMerge(
                  msg.subject,
                  instance,
                  this.httpContext,
                );
                textBody = this.mailMerge(
                  msg.textBody,
                  instance,
                  this.httpContext,
                );
                var htmlBody = this.mailMerge(
                  msg.htmlBody,
                  instance,
                  this.httpContext,
                );
                let mailOptions = {
                  from: msg.from,
                  to: instance.userChannelId,
                  subject: subject,
                  text: textBody,
                  html: htmlBody,
                };
                await this.sendEmail(mailOptions);
                break;
              }
            }
          } catch (ex) {}
          this.httpContext.response.setHeader('Content-Type', 'text/plain');
          if (anonymousUnsubscription.acknowledgements.onScreen.redirectUrl) {
            var redirectUrl =
              anonymousUnsubscription.acknowledgements.onScreen.redirectUrl;
            redirectUrl += `?channel=${instance.channel}`;
            return this.httpContext.response.redirect(redirectUrl);
          } else {
            return this.httpContext.response.end(
              anonymousUnsubscription.acknowledgements.onScreen.successMessage,
            );
          }
        };
        if (!additionalServices) {
          return await handleUnsubscriptionResponse();
        }
        await this.subscriptionRepository.updateById(id, {
          unsubscribedAdditionalServices: additionalServices,
        });
        await handleUnsubscriptionResponse();
      };
      if (!additionalServices) {
        return await unsubscribeItems({
          id: id,
        });
      }
      interface AdditionalServices {
        names: string[];
        ids: string[];
      }
      let getAdditionalServiceIds = async (): Promise<AdditionalServices> => {
        if (additionalServices.length > 1) {
          let res = await this.subscriptionRepository.find({
            fields: {id: true, serviceName: true},
            where: {
              serviceName: {
                inq: additionalServices,
              },
              channel: instance.channel,
              userChannelId: instance.userChannelId,
            },
          });
          return {
            names: res.map(e => e.serviceName),
            ids: res.map(e => e.id) as string[],
          };
        }
        if (additionalServices.length === 1) {
          if (additionalServices[0] !== '_all') {
            let res = await this.subscriptionRepository.find({
              fields: {id: true, serviceName: true},
              where: {
                serviceName: additionalServices[0],
                channel: instance.channel,
                userChannelId: instance.userChannelId,
              },
            });
            return {
              names: res.map(e => e.serviceName),
              ids: res.map(e => e.id) as string[],
            };
          }
          // get all subscribed services
          let res = await this.subscriptionRepository.find({
            fields: {id: true, serviceName: true},
            where: {
              userChannelId: instance.userChannelId,
              channel: instance.channel,
              state: 'confirmed',
            },
          });
          return {
            names: res.map(e => e.serviceName),
            ids: res.map(e => e.id) as string[],
          };
        }
        throw new HttpErrors[500]();
      };
      let data = await getAdditionalServiceIds();
      await unsubscribeItems(
        {
          id: {
            inq: ([] as string[]).concat(id, data.ids),
          },
        },
        data,
      );
    } catch (error) {
      this.httpContext.response.setHeader('Content-Type', 'text/plain');
      if (anonymousUnsubscription.acknowledgements.onScreen.redirectUrl) {
        var redirectUrl =
          anonymousUnsubscription.acknowledgements.onScreen.redirectUrl;
        redirectUrl += `?channel=${instance.channel}`;
        redirectUrl += '&err=' + encodeURIComponent(error);
        return this.httpContext.response.redirect(redirectUrl);
      } else {
        if (anonymousUnsubscription.acknowledgements.onScreen.failureMessage) {
          this.httpContext.response.status(error.status || 500);
          return this.httpContext.response.end(
            anonymousUnsubscription.acknowledgements.onScreen.failureMessage,
          );
        } else {
          throw error;
        }
      }
    }
  }
  @get('/subscriptions/{id}/unsubscribe', {
    summary: 'unsubscribe by id',
    responses: {
      '200': {
        description: 'Request was successful',
      },
    },
  })
  async deleteByIdAlias(
    @param.path.string('id', SubscriptionController.idParamSpec) id: string,
    @param.query.string(
      'unsubscriptionCode',
      SubscriptionController.unsubscriptionCodeParamSpec,
    )
    unsubscriptionCode: string,
    @param.query.string(
      'userChannelId',
      SubscriptionController.userChannelIdParamSpec,
    )
    userChannelId?: string,
    @param(SubscriptionController.additionalServicesParamSpec)
    additionalServices?: string[],
  ): Promise<void> {
    await this.deleteById(
      id,
      unsubscriptionCode,
      userChannelId,
      additionalServices,
    );
  }

  @get('/subscriptions/{id}/verify', {
    summary: 'verify confirmation code',
    responses: {
      '200': {
        description: 'Request was successful',
      },
      '403': {
        description: 'Forbidden',
      },
    },
  })
  async verify(
    @param.path.string('id', SubscriptionController.idParamSpec) id: string,
    @param.query.string('confirmationCode', {
      description: 'confirmation code',
      required: true,
    })
    confirmationCode: string,
    @param.query.boolean('replace', {
      description: 'whether or not replacing existing subscriptions',
    })
    replace?: boolean,
  ): Promise<void> {
    const instance = await this.subscriptionRepository.findById(id);
    let mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );

    let handleConfirmationAcknowledgement = async (
      err: any,
      message?: string,
    ) => {
      if (!mergedSubscriptionConfig.confirmationAcknowledgements) {
        if (err) {
          throw err;
        }
        return await this.httpContext.response.end(message);
      }
      var redirectUrl =
        mergedSubscriptionConfig.confirmationAcknowledgements.redirectUrl;
      this.httpContext.response.setHeader('Content-Type', 'text/plain');
      if (redirectUrl) {
        redirectUrl += `?channel=${instance.channel}`;
        if (err) {
          redirectUrl += '&err=' + encodeURIComponent(err.toString());
        }
        return await this.httpContext.response.redirect(redirectUrl);
      } else {
        if (err) {
          if (err.status) {
            this.httpContext.response.status(err.status);
          }
          return await this.httpContext.response.end(
            mergedSubscriptionConfig.confirmationAcknowledgements
              .failureMessage,
          );
        }
        return await this.httpContext.response.end(
          mergedSubscriptionConfig.confirmationAcknowledgements.successMessage,
        );
      }
    };

    if (
      (instance.state !== 'unconfirmed' && instance.state !== 'confirmed') ||
      (instance.confirmationRequest &&
        confirmationCode !== instance.confirmationRequest.confirmationCode)
    ) {
      return await handleConfirmationAcknowledgement(
        new HttpErrors[403]('Forbidden'),
      );
    }
    try {
      if (replace && instance.userChannelId) {
        let whereClause: Where<Subscription> = {
          serviceName: instance.serviceName,
          state: 'confirmed',
          channel: instance.channel,
        };
        // email address check should be case insensitive
        let escapedUserChannelId = instance.userChannelId.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&',
        );
        let escapedUserChannelIdRegExp = new RegExp(escapedUserChannelId, 'i');
        whereClause.userChannelId = {
          regexp: escapedUserChannelIdRegExp,
        };
        await this.subscriptionRepository.updateAll(
          {
            state: 'deleted',
          },
          whereClause,
        );
      }
      await this.subscriptionRepository.updateById(instance.id, {
        state: 'confirmed',
      });
    } catch (err) {
      return await handleConfirmationAcknowledgement(err);
    }
    return await handleConfirmationAcknowledgement(null, 'OK');
  }

  @get('/subscriptions/{id}/unsubscribe/undo', {
    summary: 'revert anonymous unsubscription by id',
    responses: {
      '200': {
        description: 'Request was successful',
      },
      '403': {
        description: 'Forbidden',
      },
    },
  })
  async unDeleteItemById(
    @param.path.string('id', SubscriptionController.idParamSpec) id: string,
    @param.query.string('unsubscriptionCode', {
      description:
        'unsubscription code, may be required for unauthenticated user request',
      required: false,
    })
    unsubscriptionCode?: string,
  ): Promise<void> {
    let instance = await this.subscriptionRepository.findById(id);
    let mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );
    let anonymousUndoUnsubscription =
      mergedSubscriptionConfig.anonymousUndoUnsubscription;
    try {
      if (!this.subscriptionRepository.isAdminReq(this.httpContext)) {
        if (
          instance.unsubscriptionCode &&
          unsubscriptionCode !== instance.unsubscriptionCode
        ) {
          throw new HttpErrors[403]('Forbidden');
        }
        if (
          this.subscriptionRepository.getCurrentUser(this.httpContext) ||
          instance.state !== 'deleted'
        ) {
          throw new HttpErrors[403]('Forbidden');
        }
      }
      let revertItems = async (query: Where<Subscription>) => {
        let res = await this.subscriptionRepository.updateAll(
          {
            state: 'confirmed',
          },
          query,
        );
        this.httpContext.response.setHeader('Content-Type', 'text/plain');
        if (anonymousUndoUnsubscription.redirectUrl) {
          var redirectUrl = anonymousUndoUnsubscription.redirectUrl;
          redirectUrl += `?channel=${instance.channel}`;
          return this.httpContext.response.redirect(redirectUrl);
        } else {
          return this.httpContext.response.end(
            anonymousUndoUnsubscription.successMessage,
          );
        }
      };
      if (!instance.unsubscribedAdditionalServices) {
        return await revertItems({
          id: instance.id,
        });
      }
      let unsubscribedAdditionalServicesIds = instance.unsubscribedAdditionalServices.ids.slice();
      delete instance.unsubscribedAdditionalServices;
      await this.subscriptionRepository.replaceById(instance.id, instance);
      await revertItems({
        or: [
          {
            id: {
              inq: unsubscribedAdditionalServicesIds,
            },
          },
          {
            id: instance.id,
          },
        ],
      });
    } catch (err) {
      this.httpContext.response.setHeader('Content-Type', 'text/plain');
      if (anonymousUndoUnsubscription.redirectUrl) {
        var redirectUrl = anonymousUndoUnsubscription.redirectUrl;
        redirectUrl += `?channel=${instance.channel}`;
        redirectUrl += '&err=' + encodeURIComponent(err.message || err);
        return this.httpContext.response.redirect(redirectUrl);
      } else {
        this.httpContext.response.status(err.status || 500);
        return this.httpContext.response.end(
          anonymousUndoUnsubscription.failureMessage,
        );
      }
    }
  }

  // use private modifier to avoid class level interceptor
  private async handleConfirmationRequest(ctx: any, data: any) {
    if (data.state !== 'unconfirmed' || !data.confirmationRequest.sendRequest) {
      return;
    }
    let textBody =
      data.confirmationRequest.textBody &&
      this.mailMerge(data.confirmationRequest.textBody, data, ctx);
    let mailSubject =
      data.confirmationRequest.subject &&
      this.mailMerge(data.confirmationRequest.subject, data, ctx);
    let mailHtmlBody =
      data.confirmationRequest.htmlBody &&
      this.mailMerge(data.confirmationRequest.htmlBody, data, ctx);
    let mailFrom = data.confirmationRequest.from;

    // handle duplicated request
    let mergedSubscriptionConfig;
    try {
      mergedSubscriptionConfig = await this.getMergedConfig(
        'subscription',
        data.serviceName,
      );
    } catch (err) {
      throw err;
    }
    if (mergedSubscriptionConfig.detectDuplicatedSubscription) {
      let whereClause: any = {
        serviceName: data.serviceName,
        state: 'confirmed',
        channel: data.channel,
      };
      if (data.userChannelId) {
        // email address check should be case insensitive
        var escapedUserChannelId = data.userChannelId.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&',
        );
        var escapedUserChannelIdRegExp = new RegExp(escapedUserChannelId, 'i');
        whereClause.userChannelId = {
          regexp: escapedUserChannelIdRegExp,
        };
      }
      let subCnt = await this.count(whereClause);
      if (subCnt.count > 0) {
        mailFrom =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification[
            data.channel
          ].from;
        textBody =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification[
            data.channel
          ].textBody &&
          this.mailMerge(
            mergedSubscriptionConfig.duplicatedSubscriptionNotification[
              data.channel
            ].textBody,
            data,
            ctx,
          );
        mailSubject =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
            .subject &&
          this.mailMerge(
            mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
              .subject,
            data,
            ctx,
          );
        mailHtmlBody =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
            .htmlBody &&
          this.mailMerge(
            mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
              .htmlBody,
            data,
            ctx,
          );
      }
    }
    switch (data.channel) {
      case 'sms':
        await this.sendSMS(data.userChannelId, textBody, data);
        break;
      default: {
        let mailOptions = {
          from: mailFrom,
          to: data.userChannelId,
          subject: mailSubject,
          text: textBody,
          html: mailHtmlBody,
        };
        await this.sendEmail(mailOptions);
      }
    }
  }

  // use private modifier to avoid class level interceptor
  private async beforeUpsert(ctx: any, data: Subscription) {
    let mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      data.serviceName,
    );
    var userId = this.configurationRepository.getCurrentUser(ctx);
    if (userId) {
      data.userId = userId;
    } else if (
      !this.configurationRepository.isAdminReq(ctx) ||
      !data.unsubscriptionCode
    ) {
      // generate unsubscription code
      var anonymousUnsubscription =
        mergedSubscriptionConfig.anonymousUnsubscription;
      if (
        anonymousUnsubscription.code &&
        anonymousUnsubscription.code.required
      ) {
        var unsubscriptionCodeRegex = new RegExp(
          anonymousUnsubscription.code.regex,
        );
        data.unsubscriptionCode = new RandExp(unsubscriptionCodeRegex).gen();
      }
    }
    if (
      data.confirmationRequest &&
      data.confirmationRequest.confirmationCodeEncrypted
    ) {
      var rsaPath = path.resolve(__dirname, '../observers/rsa.observer');
      var rsa = require(rsaPath);
      var key = rsa.key;
      var decrypted;
      decrypted = key.decrypt(
        data.confirmationRequest.confirmationCodeEncrypted,
        'utf8',
      );
      var decryptedData = decrypted.split(' ');
      data.userChannelId = decryptedData[0];
      data.confirmationRequest.confirmationCode = decryptedData[1];
      return;
    }
    // use request without encrypted payload
    if (
      !this.configurationRepository.isAdminReq(ctx) ||
      !data.confirmationRequest
    ) {
      try {
        data.confirmationRequest =
          mergedSubscriptionConfig.confirmationRequest[data.channel];
      } catch (ex) {}
      data.confirmationRequest &&
        (data.confirmationRequest.confirmationCode = undefined);
    }
    if (!data.confirmationRequest) {
      return;
    }
    if (
      !data.confirmationRequest.confirmationCode &&
      data.confirmationRequest.confirmationCodeRegex
    ) {
      var confirmationCodeRegex = new RegExp(
        data.confirmationRequest.confirmationCodeRegex,
      );
      data.confirmationRequest.confirmationCode = new RandExp(
        confirmationCodeRegex,
      ).gen();
    }
    return;
  }
}
