import {
  ApplicationConfig,
  CoreBindings,
  Getter,
  inject,
  intercept,
} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {
  SubscriptionAccessInterceptor,
  SubscriptionAfterRemoteInterceptor,
  SubscriptionBeforeSaveInterceptor,
} from '../interceptors';
import {Subscription} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

@intercept(SubscriptionBeforeSaveInterceptor.BINDING_KEY)
@intercept(SubscriptionAfterRemoteInterceptor.BINDING_KEY)
@intercept(SubscriptionAccessInterceptor.BINDING_KEY)
export class SubscriptionRepository extends BaseCrudRepository<
  Subscription,
  typeof Subscription.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(Subscription, dataSource, getHttpContext, appConfig);
  }
}
