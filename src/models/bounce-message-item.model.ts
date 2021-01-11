import {Model, model, property} from '@loopback/repository';

@model()
export class BounceMessageItem extends Model {
  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  constructor(data?: Partial<BounceMessageItem>) {
    super(data);
  }
}

export interface BounceMessageItemRelations {
  // describe navigational properties here
}

export type BounceMessageItemWithRelations = BounceMessageItem &
  BounceMessageItemRelations;
