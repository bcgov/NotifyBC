import {model, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {AccessToken} from './access-token.model';

@model({
  name: 'administrator',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    indexes: {'$**_text': {keys: {'$**': 'text'}}},
  },
})
export class Administrator extends User {

  @hasMany(() => AccessToken, {keyTo: 'userId'})
  accessTokens: AccessToken[];
  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Administrator>) {
    super(data);
  }
}

export interface AdministratorRelations {
  // describe navigational properties here
}

export type AdministratorWithRelations = Administrator & AdministratorRelations;
