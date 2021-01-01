import {
  ApplicationConfig,
  CoreBindings,
  Getter,
  inject,
  intercept,
} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {NotificationAccessInterceptor} from '../interceptors';
import {Notification, NotificationRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

@intercept(NotificationAccessInterceptor.BINDING_KEY)
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
}
