import {Getter, inject} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Configuration, ConfigurationRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

export class ConfigurationRepository extends BaseCrudRepository<
  Configuration,
  typeof Configuration.prototype.id,
  ConfigurationRelations
> {
  constructor(
    @inject('datasources.') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
  ) {
    super(Configuration, dataSource, getHttpContext);
  }
}
