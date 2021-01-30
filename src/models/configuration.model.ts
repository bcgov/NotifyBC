import {model, property} from '@loopback/repository';
import {Base} from './base.model';

@model({
  name: 'configuration',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_name_serviceName: {
        keys: {name: 1, serviceName: 1},
        options: {unique: true},
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Configuration extends Base {
  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectID'},
    id: true,
    generated: true,
    updateOnly: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'any',
  })
  value?: any;

  @property({
    type: 'string',
  })
  serviceName?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Configuration>) {
    super(data);
  }
}

export interface ConfigurationRelations {
  // describe navigational properties here
}

export type ConfigurationWithRelations = Configuration & ConfigurationRelations;
