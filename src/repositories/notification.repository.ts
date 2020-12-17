import {ApplicationConfig, CoreBindings, Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {HttpErrors, MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Notification, NotificationRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

export class NotificationRepository extends BaseCrudRepository<
  Notification,
  typeof Notification.prototype.id,
  NotificationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(Notification, dataSource, getHttpContext, appConfig);
  }

  definePersistedModel(
    entityClass: typeof Notification,
  ): typeof juggler.PersistedModel {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('access', async ctx => {
      const httpCtx = await this.getHttpContext();
      ctx.query.where = ctx.query.where || {};
      const currUser = this.getCurrentUser(httpCtx);
      if (currUser) {
        ctx.query.where.channel = 'inApp';
        ctx.query.where.or = [];
        ctx.query.where.or.push({
          isBroadcast: true,
        });
        ctx.query.where.or.push({
          userChannelId: currUser,
        });
      } else if (!this.isAdminReq(httpCtx)) {
        throw new HttpErrors[403]('Forbidden');
      }
    });
    return modelClass;
  }
}
