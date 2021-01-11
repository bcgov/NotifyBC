import {Entity, model, property} from '@loopback/repository';
import {RssItem} from './rss-item.model';

@model({settings: {strict: false, validateUpsert: true, idInjection: true}})
export class Rss extends Entity {
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
  serviceName: string;

  @property.array(RssItem)
  items?: RssItem[];

  @property({
    type: 'date',
  })
  lastPoll?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Rss>) {
    super(data);
  }
}

export interface RssRelations {
  // describe navigational properties here
}

export type RssWithRelations = Rss & RssRelations;
