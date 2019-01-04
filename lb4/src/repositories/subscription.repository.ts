import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Subscription} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SubscriptionRepository extends DefaultCrudRepository<
  Subscription,
  typeof Subscription.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Subscription, dataSource);
  }
}
