import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {HttpErrors, MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Subscription} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';
const jmespath = require('jmespath');

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

  definePersistedModel(
    entityClass: typeof Subscription,
  ): typeof juggler.PersistedModel {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      let data = ctx.instance || ctx.data;
      if (!data) {
        return;
      }
      let filter = data.broadcastPushNotificationFilter;
      if (!filter) {
        return;
      }
      if (typeof filter !== 'string') {
        throw new HttpErrors[400]('invalid broadcastPushNotificationFilter');
      }
      filter = '[?' + filter + ']';
      try {
        jmespath.compile(filter);
      } catch (ex) {
        throw new HttpErrors[400]('invalid broadcastPushNotificationFilter');
      }
      return;
    });
    return modelClass;
  }
}
