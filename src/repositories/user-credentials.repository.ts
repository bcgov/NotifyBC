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
import {UserCredentials, UserCredentialsRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

@intercept(RepositoryBeforeSaveInterceptor.BINDING_KEY)
export class UserCredentialsRepository extends BaseCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {
    super(UserCredentials, dataSource, getHttpContext, appConfig);
  }
}
