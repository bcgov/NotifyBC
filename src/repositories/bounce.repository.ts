import {ApplicationConfig, CoreBindings, Getter, inject} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Bounce, BounceRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

export class BounceRepository extends BaseCrudRepository<
  Bounce,
  typeof Bounce.prototype.id,
  BounceRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(Bounce, dataSource, getHttpContext, appConfig);
  }
}
