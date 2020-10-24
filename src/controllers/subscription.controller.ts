import {
  ApplicationConfig,
  CoreBindings,
  inject,
  intercept,
} from '@loopback/core';
import {Filter, Where} from '@loopback/filter';
import {Count, CountSchema, repository} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  MiddlewareContext,
  oas,
  param,
  patch,
  post,
  put,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {
  AccessCheckForGetRequestInterceptor,
  SubscriptionAfterRemoteInteceptorInterceptor,
} from '../interceptors';
import {Subscription} from '../models';
import {ConfigurationRepository, SubscriptionRepository} from '../repositories';
import {BaseController} from './base.controller';
var RandExp = require('randexp');
const path = require('path');

@intercept(SubscriptionAfterRemoteInteceptorInterceptor.BINDING_KEY)
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

  @intercept(AccessCheckForGetRequestInterceptor.BINDING_KEY)
  @get('/subscriptions/count', {
    responses: {
      '200': {
        description: 'Subscription model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Subscription)) where?: Where,
  ): Promise<Count> {
    return this.subscriptionRepository.count(where);
  }

  @intercept(AccessCheckForGetRequestInterceptor.BINDING_KEY)
  @get('/subscriptions', {
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

  @patch('/subscriptions', {
    responses: {
      '200': {
        description: 'Subscription PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() subscription: Subscription,
    @param.query.object('where', getWhereSchemaFor(Subscription)) where?: Where,
  ): Promise<Count> {
    return this.subscriptionRepository.updateAll(subscription, where);
  }

  @get('/subscriptions/{id}', {
    responses: {
      '200': {
        description: 'Subscription model instance',
        content: {'application/json': {schema: {'x-ts-type': Subscription}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Subscription> {
    return this.subscriptionRepository.findById(id);
  }

  @patch('/subscriptions/{id}', {
    responses: {
      '204': {
        description: 'Subscription PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.updateById(id, subscription);
  }

  @put('/subscriptions/{id}', {
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

  @del('/subscriptions/{id}', {
    responses: {
      '204': {
        description: 'Subscription DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionRepository.deleteById(id);
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
