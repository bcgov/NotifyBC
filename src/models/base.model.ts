import {Entity, model, property} from '@loopback/repository';

@model()
export class Base extends Entity {
  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectID'},
    id: true,
    generated: true,
    updateOnly: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  id?: string;

  @property({
    type: 'date',
    default: '$now',
    jsonSchema: {
      readOnly: true,
    },
  })
  created?: string;

  @property({
    type: 'date',
    default: '$now',
    jsonSchema: {
      readOnly: true,
    },
  })
  updated?: string;

  constructor(data?: Partial<Base>) {
    super(data);
  }
}

export interface BaseRelations {
  // describe navigational properties here
}

export type BaseWithRelations = Base & BaseRelations;
