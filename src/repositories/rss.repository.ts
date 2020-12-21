import {ApplicationConfig, CoreBindings, Getter, inject} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Rss, RssRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

export class RssRepository extends BaseCrudRepository<
  Rss,
  typeof Rss.prototype.id,
  RssRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(Rss, dataSource, getHttpContext, appConfig);
  }
}
