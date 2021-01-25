import {
  ApplicationConfig,
  CoreBindings,
  Getter,
  inject,
  intercept,
} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {RepositoryBeforeSaveInterceptor} from '../interceptors';
import {AccessToken, AccessTokenRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

@intercept(RepositoryBeforeSaveInterceptor.BINDING_KEY)
export class AccessTokenRepository extends BaseCrudRepository<
  AccessToken,
  typeof AccessToken.prototype.id,
  AccessTokenRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(AccessToken, dataSource, getHttpContext, appConfig);
  }
}
