import {model, property} from '@loopback/repository';
import {User} from '.';

@model({
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {'$**_text': {keys: {'$**': 'text'}}},
  },
})
export class Administrator extends User {
  @property({
    mongodb: {dataType: 'ObjectID'},
    type: 'string',
    id: 1,
    generated: true,
    updateOnly: true,
  })
  id?: string;

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
