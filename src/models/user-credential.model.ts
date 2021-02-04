import {model, property} from '@loopback/repository';
import {Base} from './base.model';

export const PASSWORD_COMPLEXITY_REGEX =
  '^(?=.*[A-Z])(?=.*[!_@#$&*])(?=.*[0-9])(?=.*[a-z]).{10,}$';

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
    jsonSchema: {
      pattern: PASSWORD_COMPLEXITY_REGEX,
    },
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
