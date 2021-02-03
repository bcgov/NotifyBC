import {hasMany, hasOne, model} from '@loopback/repository';
import {AccessToken} from './access-token.model';
import {UserCredential} from './user-credential.model';
import {User} from './user.model';

@model({
  name: 'administrator',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_email: {keys: {email: 1}, options: {unique: true}},
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Administrator extends User {
  @hasMany(() => AccessToken, {keyTo: 'userId'})
  accessTokens: AccessToken[];

  @hasOne(() => UserCredential, {keyTo: 'userId'})
  userCredential: UserCredential;
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
