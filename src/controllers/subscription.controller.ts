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
  oas,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {
  AccessCheckForGetRequestInterceptor,
  SubscriptionAfterRemoteInteceptorInterceptor,
} from '../interceptors';
import {Subscription} from '../models';
import {ConfigurationRepository, SubscriptionRepository} from '../repositories';
import {BaseController} from './base.controller';

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
    return this.subscriptionRepository.create(subscription);
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
  private async handleConfirmationRequest(ctx: any, data: any, cb: Function) {
    if (data.state !== 'unconfirmed' || !data.confirmationRequest.sendRequest) {
      return cb(null, null);
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
      if (cb) {
        return cb(err);
      } else {
        throw err;
      }
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
        this.sendSMS(data.userChannelId, textBody, data, cb);
        break;
      default: {
        let mailOptions = {
          from: mailFrom,
          to: data.userChannelId,
          subject: mailSubject,
          text: textBody,
          html: mailHtmlBody,
        };
        this.sendEmail(mailOptions, cb);
      }
    }
  }
}
