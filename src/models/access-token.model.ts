import {model, property} from '@loopback/repository';
import {Base} from './base.model';

@model({settings: {strict: false, forceId: false}})
export class AccessToken extends Base {
  @property({
    type: 'string',
    mongodb: {dataType: 'string'},
    id: true,
    generated: false,
  })
  id: string;

  @property({
    type: 'number',
    ttl: true,
    default: 1209600,
    description: 'time to live in seconds (2 weeks by default)',
  })
  ttl?: number;

  @property({
    type: 'string',
    description:
      'name of the token, for example app name where the token is used',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<AccessToken>) {
    super(data);
  }
}

export interface AccessTokenRelations {
  // describe navigational properties here
}

export type AccessTokenWithRelations = AccessToken & AccessTokenRelations;
