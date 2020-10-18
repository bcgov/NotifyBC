import {ApplicationConfig, CoreBindings, Getter, inject} from '@loopback/core';
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
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(Subscription, dataSource, getHttpContext, appConfig);
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
    modelClass.observe('access', async ctx => {
      const httpCtx = await this.getHttpContext();
      var u = this.getCurrentUser(httpCtx);
      if (u) {
        ctx.query.where = ctx.query.where || {};
        ctx.query.where = {
          and: [
            ctx.query.where,
            {userId: u},
            {
              state: {
                neq: 'deleted',
              },
            },
          ],
        };
      }
      return;
    });
    return modelClass;
  }
}
