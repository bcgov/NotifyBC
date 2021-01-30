import {Entity, model, property} from '@loopback/repository';

@model()
export class Base extends Entity {
  @property({
    type: 'date',
    default: '$now',
  })
  created?: string;

  @property({
    type: 'date',
    default: '$now',
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
