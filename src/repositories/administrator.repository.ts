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
import {Administrator, AdministratorRelations, AccessToken, UserCredentials} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';
import {repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {AccessTokenRepository} from './access-token.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

@intercept(RepositoryBeforeSaveInterceptor.BINDING_KEY)
export class AdministratorRepository extends BaseCrudRepository<
  Administrator,
  typeof Administrator.prototype.id,
  AdministratorRelations
> {

  public readonly accessTokens: HasManyRepositoryFactory<AccessToken, typeof Administrator.prototype.id>;

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof Administrator.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig, @repository.getter('AccessTokenRepository') protected accessTokenRepositoryGetter: Getter<AccessTokenRepository>, @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(Administrator, dataSource, getHttpContext, appConfig);
    this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
    this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
    this.accessTokens = this.createHasManyRepositoryFactoryFor('accessTokens', accessTokenRepositoryGetter,);
    this.registerInclusionResolver('accessTokens', this.accessTokens.inclusionResolver);
  }
}
