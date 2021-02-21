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

import {authenticate} from '@loopback/authentication';
import {
  ApplicationConfig,
  CoreBindings,
  inject,
  intercept,
} from '@loopback/core';
import {Filter, Where} from '@loopback/filter';
import {
  AnyObject,
  Count,
  CountSchema,
  DataObject,
  repository,
} from '@loopback/repository';
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
import {SubscriptionAfterRemoteInterceptor} from '../interceptors';
import {Subscription} from '../models';
import {ConfigurationRepository, SubscriptionRepository} from '../repositories';
import {BaseController} from './base.controller';
const RandExp = require('randexp');
const path = require('path');

@intercept(SubscriptionAfterRemoteInterceptor.BINDING_KEY)
@oas.tags('subscription')
export class SubscriptionController extends BaseController {
  constructor(
    @inject('repositories.SubscriptionRepository', {
      asProxyWithInterceptors: true,
    })
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
    if (!(await this.configurationRepository.isAdminReq(this.httpContext))) {
      delete subscription.state;
      const userId = await this.configurationRepository.getCurrentUser(
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
    const result = await this.subscriptionRepository.create(
      subscription,
      undefined,
    );
    if (!subscription.confirmationRequest) {
      return result;
    }
    await this.handleConfirmationRequest(this.httpContext, result);
    return result;
  }

  @authenticate(
    'ipWhitelist',
    'clientCertificate',
    'accessToken',
    'oidc',
    'siteMinder',
  )
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
    return this.subscriptionRepository.count(where, undefined);
  }

  @authenticate(
    'ipWhitelist',
    'clientCertificate',
    'accessToken',
    'oidc',
    'siteMinder',
  )
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
    return this.subscriptionRepository.find(filter, undefined);
  }

  @authenticate(
    'ipWhitelist',
    'clientCertificate',
    'accessToken',
    'oidc',
    'siteMinder',
  )
  @patch('/subscriptions/{id}', {
    summary: 'update a subscription',
    responses: {
      '200': {
        description: 'Subscription model instance',
        content: {'application/json': {schema: {'x-ts-type': Subscription}}},
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() subscription: DataObject<Subscription>,
  ): Promise<Subscription> {
    const instance = await this.subscriptionRepository.findOne(
      {where: {id: id}},
      undefined,
    );
    if (!instance) {
      throw new HttpErrors[404]();
    }
    const filteredData = _.merge({}, instance);
    if (
      subscription.userChannelId &&
      filteredData.userChannelId !== subscription.userChannelId
    ) {
      filteredData.state = 'unconfirmed';
      filteredData.userChannelId = subscription.userChannelId;
    }
    await this.beforeUpsert(this.httpContext, filteredData);
    await this.subscriptionRepository.updateById(id, filteredData, undefined);
    if (!filteredData.confirmationRequest) {
      return filteredData;
    }
    await this.handleConfirmationRequest(this.httpContext, filteredData);
    return filteredData;
  }

  @authenticate('ipWhitelist', 'clientCertificate', 'accessToken', 'oidc')
  @put('/subscriptions/{id}', {
    summary: 'replace a subscription',
    responses: {
      '200': {
        description: 'Subscription model instance',
        content: {'application/json': {schema: {'x-ts-type': Subscription}}},
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscription: Subscription,
  ): Promise<Subscription | null> {
    await this.subscriptionRepository.replaceById(id, subscription, undefined);
    return this.subscriptionRepository.findOne({where: {id}}, undefined);
  }

  static readonly additionalServicesParamSpec: ParameterObject = {
    name: 'additionalServices',
    in: 'query',
    schema: {
      type: 'array',
      items: {type: 'string'},
    },
    description:
      'additional services to unsubscribe. If there is only one item and the value is _all, then unsubscribe all subscribed services.',
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
      '302': {
        description: 'Request was successful. Redirect.',
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
    let instance = (await this.subscriptionRepository.findOne(
      {where: {id}},
      undefined,
    )) as Subscription;
    if (!instance) throw new HttpErrors[404]();
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );
    const anonymousUnsubscription =
      mergedSubscriptionConfig.anonymousUnsubscription;
    try {
      let forbidden = false;
      if (!(await this.configurationRepository.isAdminReq(this.httpContext))) {
        const userId = await this.configurationRepository.getCurrentUser(
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
        throw new HttpErrors[403]();
      }
      const unsubscribeItems = async (
        query: Where<Subscription>,
        addtServices?: string | AdditionalServices,
      ) => {
        await this.subscriptionRepository.updateAll(
          {
            state: 'deleted',
          },
          query,
          undefined,
        );
        const handleUnsubscriptionResponse = async () => {
          // send acknowledgement notification
          try {
            const msg =
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
                const subject = this.mailMerge(
                  msg.subject,
                  instance,
                  this.httpContext,
                );
                textBody = this.mailMerge(
                  msg.textBody,
                  instance,
                  this.httpContext,
                );
                const htmlBody = this.mailMerge(
                  msg.htmlBody,
                  instance,
                  this.httpContext,
                );
                const mailOptions = {
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
            let redirectUrl =
              anonymousUnsubscription.acknowledgements.onScreen.redirectUrl;
            redirectUrl += `?channel=${instance.channel}`;
            return this.httpContext.response.redirect(redirectUrl);
          } else {
            return this.httpContext.response.end(
              anonymousUnsubscription.acknowledgements.onScreen.successMessage,
            );
          }
        };
        if (!addtServices) {
          return handleUnsubscriptionResponse();
        }
        await this.subscriptionRepository.updateById(
          id,
          {
            unsubscribedAdditionalServices: addtServices,
          },
          undefined,
        );
        instance = (await this.subscriptionRepository.findOne(
          {where: {id}},
          undefined,
        )) as Subscription;
        if (!instance) throw new HttpErrors[404]();
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
      const getAdditionalServiceIds = async (): Promise<AdditionalServices> => {
        if (additionalServices.length > 1) {
          const res = await this.subscriptionRepository.find(
            {
              fields: {id: true, serviceName: true},
              where: {
                serviceName: {
                  inq: additionalServices,
                },
                channel: instance.channel,
                userChannelId: instance.userChannelId,
              },
            },
            undefined,
          );
          return {
            names: res.map(e => e.serviceName),
            ids: res.map(e => e.id) as string[],
          };
        }
        if (additionalServices.length === 1) {
          if (additionalServices[0] !== '_all') {
            const res = await this.subscriptionRepository.find(
              {
                fields: {id: true, serviceName: true},
                where: {
                  serviceName: additionalServices[0],
                  channel: instance.channel,
                  userChannelId: instance.userChannelId,
                },
              },
              undefined,
            );
            return {
              names: res.map(e => e.serviceName),
              ids: res.map(e => e.id) as string[],
            };
          }
          // get all subscribed services
          const res = await this.subscriptionRepository.find(
            {
              fields: {id: true, serviceName: true},
              where: {
                userChannelId: instance.userChannelId,
                channel: instance.channel,
                state: 'confirmed',
              },
            },
            undefined,
          );
          return {
            names: res.map(e => e.serviceName),
            ids: res.map(e => e.id) as string[],
          };
        }
        throw new HttpErrors[500]();
      };
      const data = await getAdditionalServiceIds();
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
        let redirectUrl =
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
    let instance = (await this.subscriptionRepository.findOne(
      {where: {id}},
      undefined,
    )) as Subscription;
    if (!instance) throw new HttpErrors[404]();
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );

    const handleConfirmationAcknowledgement = async (
      err: any,
      message?: string,
    ) => {
      if (!mergedSubscriptionConfig.confirmationAcknowledgements) {
        if (err) {
          throw err;
        }
        return this.httpContext.response.end(message);
      }
      let redirectUrl =
        mergedSubscriptionConfig.confirmationAcknowledgements.redirectUrl;
      this.httpContext.response.setHeader('Content-Type', 'text/plain');
      if (redirectUrl) {
        redirectUrl += `?channel=${instance.channel}`;
        if (err) {
          redirectUrl += '&err=' + encodeURIComponent(err.toString());
        }
        return this.httpContext.response.redirect(redirectUrl);
      } else {
        if (err) {
          if (err.status) {
            this.httpContext.response.status(err.status);
          }
          return this.httpContext.response.end(
            mergedSubscriptionConfig.confirmationAcknowledgements
              .failureMessage,
          );
        }
        return this.httpContext.response.end(
          mergedSubscriptionConfig.confirmationAcknowledgements.successMessage,
        );
      }
    };

    if (
      (instance.state !== 'unconfirmed' && instance.state !== 'confirmed') ||
      (instance.confirmationRequest &&
        confirmationCode !== instance.confirmationRequest.confirmationCode)
    ) {
      return handleConfirmationAcknowledgement(new HttpErrors[403]());
    }
    try {
      if (replace && instance.userChannelId) {
        const whereClause: Where<Subscription> = {
          serviceName: instance.serviceName,
          state: 'confirmed',
          channel: instance.channel,
        };
        // email address check should be case insensitive
        const escapedUserChannelId = instance.userChannelId.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&',
        );
        const escapedUserChannelIdRegExp = new RegExp(
          escapedUserChannelId,
          'i',
        );
        whereClause.userChannelId = {
          regexp: escapedUserChannelIdRegExp,
        };
        await this.subscriptionRepository.updateAll(
          {
            state: 'deleted',
          },
          whereClause,
          undefined,
        );
      }
      await this.subscriptionRepository.updateById(
        instance.id,
        {
          state: 'confirmed',
        },
        undefined,
      );
      instance = (await this.subscriptionRepository.findOne(
        {where: {id}},
        undefined,
      )) as Subscription;
    } catch (err) {
      return await handleConfirmationAcknowledgement(err);
    }
    return handleConfirmationAcknowledgement(null, 'OK');
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
    const instance = await this.subscriptionRepository.findOne(
      {where: {id}},
      undefined,
    );
    if (!instance) throw new HttpErrors[404]();
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );
    const anonymousUndoUnsubscription =
      mergedSubscriptionConfig.anonymousUndoUnsubscription;
    try {
      if (
        !(await this.subscriptionRepository.isAdminReq(
          this.httpContext,
          undefined,
          undefined,
        ))
      ) {
        if (
          instance.unsubscriptionCode &&
          unsubscriptionCode !== instance.unsubscriptionCode
        ) {
          throw new HttpErrors[403]();
        }
        if (
          (await this.subscriptionRepository.getCurrentUser(
            this.httpContext,
          )) ||
          instance.state !== 'deleted'
        ) {
          throw new HttpErrors[403]();
        }
      }
      const revertItems = async (query: Where<Subscription>) => {
        await this.subscriptionRepository.updateAll(
          {
            state: 'confirmed',
          },
          query,
          undefined,
        );
        this.httpContext.response.setHeader('Content-Type', 'text/plain');
        if (anonymousUndoUnsubscription.redirectUrl) {
          let redirectUrl = anonymousUndoUnsubscription.redirectUrl;
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
      const unsubscribedAdditionalServicesIds = instance.unsubscribedAdditionalServices.ids.slice();
      delete instance.unsubscribedAdditionalServices;
      await this.subscriptionRepository.replaceById(
        instance.id,
        instance,
        undefined,
      );
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
        let redirectUrl = anonymousUndoUnsubscription.redirectUrl;
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

  @authenticate('ipWhitelist', 'clientCertificate', 'accessToken', 'oidc')
  @get('/subscriptions/services', {
    summary: 'unique list of subscribed service names',
    responses: {
      '200': {
        description: 'Request was successful',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {type: 'string'},
            },
          },
        },
      },
      '403': {
        description: 'Forbidden',
      },
    },
  })
  async getSubscribedServiceNames(): Promise<string[]> {
    const subscriptionCollection = this.subscriptionRepository.dataSource.connector?.collection(
      Subscription.modelName,
    );
    // distinct is db-dependent feature. MongoDB supports it
    if (typeof subscriptionCollection.distinct === 'function') {
      return new Promise((res, rej) => {
        subscriptionCollection.distinct(
          'serviceName',
          {
            state: 'confirmed',
          },
          (err: any, data: string[]) => {
            if (err) return rej(err);
            res(data);
          },
        );
      });
    }
    const data = await this.subscriptionRepository.find(
      {
        fields: {
          serviceName: true,
        },
        where: {
          state: 'confirmed',
        },
        order: ['serviceName ASC'],
      },
      undefined,
    );
    if (!data || data.length === 0) {
      return [];
    }
    return data.reduce((a: string[], e: Subscription) => {
      if (a.length === 0 || a[a.length - 1] !== e.serviceName) {
        a.push(e.serviceName);
      }
      return a;
    }, []);
  }

  @post('/subscriptions/swift', {
    summary: 'handle unsubscription from Swift keyword redirect',
    responses: {
      '200': {
        description: 'Request was successful',
      },
      '403': {
        description: 'Forbidden',
      },
    },
  })
  async handleSwiftUnsubscription(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: {
            type: 'object',
          },
        },
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    })
    body: AnyObject,
  ): Promise<void> {
    /*
    sample swift post
    { PhoneNumber: '1250nnnnnnn',
      ReceivedDate: '2020-05-11 19:56:52',
      MessageBody: '<case insensitive keyword>',
      Destination: '79438',
      AccountKey: 'xxx',
      Reference: '5eb9e53ac8de837a99fd214a',
      OutgoingMessageID: '789091964',
      MessageNumber: '59255257',
      notifyBCSwiftKey: '1111'
    }
    */
    if (this.appConfig['smsServiceProvider'] !== 'swift') {
      throw new HttpErrors[403]();
    }
    const smsConfig = this.appConfig.sms;
    if (!smsConfig || !smsConfig.swift || !smsConfig.swift.notifyBCSwiftKey) {
      throw new HttpErrors[403]();
    }
    if (smsConfig.swift.notifyBCSwiftKey !== body.notifyBCSwiftKey) {
      throw new HttpErrors[403]();
    }
    const whereClause: Where<Subscription> = {
      state: 'confirmed',
      channel: 'sms',
    };
    if (body.Reference) {
      whereClause.id = body.Reference;
    } else {
      if (!body.PhoneNumber) {
        throw new HttpErrors[403]();
      }
      const phoneNumberArr = body.PhoneNumber.split('');
      // country code is optional
      if (phoneNumberArr[0] === '1') {
        phoneNumberArr[0] = '1?';
      }
      const phoneNumberRegex = new RegExp(phoneNumberArr.join('-?'));
      whereClause.userChannelId = {
        regexp: phoneNumberRegex,
      };
    }
    const subscription = await this.subscriptionRepository.findOne(
      {
        where: whereClause,
      },
      undefined,
    );
    if (!subscription) {
      this.httpContext.response.send('ok');
      return;
    }
    await this.deleteById(
      subscription.id as string,
      subscription.unsubscriptionCode,
    );
  }

  // use private modifier to avoid class level interceptor
  private async handleConfirmationRequest(ctx: any, data: any) {
    if (
      data.state !== 'unconfirmed' ||
      !data.confirmationRequest?.sendRequest
    ) {
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
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      data.serviceName,
    );
    if (mergedSubscriptionConfig.detectDuplicatedSubscription) {
      const whereClause: any = {
        serviceName: data.serviceName,
        state: 'confirmed',
        channel: data.channel,
      };
      if (data.userChannelId) {
        // email address check should be case insensitive
        const escapedUserChannelId = data.userChannelId.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&',
        );
        const escapedUserChannelIdRegExp = new RegExp(
          escapedUserChannelId,
          'i',
        );
        whereClause.userChannelId = {
          regexp: escapedUserChannelIdRegExp,
        };
      }
      const subCnt = await this.count(whereClause);
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
        const mailOptions = {
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
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      data.serviceName,
    );
    const userId = await this.configurationRepository.getCurrentUser(ctx);
    if (userId) {
      data.userId = userId;
    } else if (
      !(await this.configurationRepository.isAdminReq(ctx)) ||
      !data.unsubscriptionCode
    ) {
      // generate unsubscription code
      const anonymousUnsubscription =
        mergedSubscriptionConfig.anonymousUnsubscription;
      if (anonymousUnsubscription.code?.required) {
        const unsubscriptionCodeRegex = new RegExp(
          anonymousUnsubscription.code.regex,
        );
        data.unsubscriptionCode = new RandExp(unsubscriptionCodeRegex).gen();
      }
    }
    if (data.confirmationRequest?.confirmationCodeEncrypted) {
      const rsaPath = path.resolve(__dirname, '../observers/rsa.observer');
      const rsa = require(rsaPath);
      const key = rsa.key;
      const decrypted = key.decrypt(
        data.confirmationRequest.confirmationCodeEncrypted,
        'utf8',
      );
      const decryptedData = decrypted.split(' ');
      data.userChannelId = decryptedData[0];
      data.confirmationRequest.confirmationCode = decryptedData[1];
      return;
    }
    // use request without encrypted payload
    if (
      !(await this.configurationRepository.isAdminReq(ctx)) ||
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
      const confirmationCodeRegex = new RegExp(
        data.confirmationRequest.confirmationCodeRegex,
      );
      data.confirmationRequest.confirmationCode = new RandExp(
        confirmationCodeRegex,
      ).gen();
    }
    return;
  }
}
