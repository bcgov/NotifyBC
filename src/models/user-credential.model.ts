import {model, property} from '@loopback/repository';
import {Base} from './base.model';

@model({
  settings: {
    strict: false,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_userId: {keys: {userId: 1}, options: {unique: true}},
    },
  },
})
export class UserCredential extends Base {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<UserCredential>) {
    super(data);
  }
}

export interface UserCredentialRelations {
  // describe navigational properties here
}

export type UserCredentialWithRelations = UserCredential &
  UserCredentialRelations;
