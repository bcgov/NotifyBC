import {Getter, inject} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Subscription} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

export class SubscriptionRepository extends BaseCrudRepository<
  Subscription,
  typeof Subscription.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
  ) {
    super(Subscription, dataSource, getHttpContext);
  }
}
