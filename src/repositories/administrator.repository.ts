import {
  ApplicationConfig,
  CoreBindings,
  Getter,
  inject,
  intercept,
} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {
  AdministratorBeforeSaveInterceptor,
  RepositoryBeforeSaveInterceptor,
} from '../interceptors';
import {
  AccessToken,
  Administrator,
  AdministratorRelations,
  UserCredential,
} from '../models';
import {AccessTokenRepository} from './access-token.repository';
import {BaseCrudRepository} from './baseCrudRepository';
import {UserCredentialRepository} from './user-credential.repository';

@intercept(RepositoryBeforeSaveInterceptor.BINDING_KEY)
@intercept(AdministratorBeforeSaveInterceptor.BINDING_KEY)
export class AdministratorRepository extends BaseCrudRepository<
  Administrator,
  typeof Administrator.prototype.id,
  AdministratorRelations
> {
  public readonly accessTokens: HasManyRepositoryFactory<
    AccessToken,
    typeof Administrator.prototype.id
  >;

  public readonly userCredential: HasOneRepositoryFactory<
    UserCredential,
    typeof Administrator.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
    @repository.getter('AccessTokenRepository')
    protected accessTokenRepositoryGetter: Getter<AccessTokenRepository>,
    @repository.getter('UserCredentialRepository')
    protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
  ) {
    super(Administrator, dataSource, getHttpContext, appConfig);
    this.userCredential = this.createHasOneRepositoryFactoryFor(
      'userCredential',
      userCredentialRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredential',
      this.userCredential.inclusionResolver,
    );
    this.accessTokens = this.createHasManyRepositoryFactoryFor(
      'accessTokens',
      accessTokenRepositoryGetter,
    );
    this.registerInclusionResolver(
      'accessTokens',
      this.accessTokens.inclusionResolver,
    );
  }
}
