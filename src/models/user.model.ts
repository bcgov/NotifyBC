import {model, property} from '@loopback/repository';
import {Base} from './base.model';

@model({
  name: 'user',
  settings: {
    strict: false,
    caseSensitiveEmail: true,
  },
})
export class User extends Base {
  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
