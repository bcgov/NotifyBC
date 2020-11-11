import {model} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {'$**_text': {keys: {'$**': 'text'}}},
  },
})
export class Administrator extends User {
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Administrator>) {
    super(data);
  }
}

export interface AdministratorRelations {
  // describe navigational properties here
}

export type AdministratorWithRelations = Administrator & AdministratorRelations;
