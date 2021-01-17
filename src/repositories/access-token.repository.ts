import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AccessToken, AccessTokenRelations} from '../models';

export class AccessTokenRepository extends DefaultCrudRepository<
  AccessToken,
  typeof AccessToken.prototype.id,
  AccessTokenRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(AccessToken, dataSource);
  }
}
