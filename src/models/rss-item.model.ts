import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RssItem extends Model {
  @property({
    type: 'date',
    required: true,
  })
  _notifyBCLastPoll: string;

  @property({
    type: 'date',
  })
  pubDate?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<RssItem>) {
    super(data);
  }
}

export interface RssItemRelations {
  // describe navigational properties here
}

export type RssItemWithRelations = RssItem & RssItemRelations;
