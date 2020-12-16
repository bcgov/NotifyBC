/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {
      state_channel_userChannelId: {
        keys: {state: 1, channel: 1, userChannelId: 1},
      },
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Bounce extends Entity {
  @property({
    mongodb: {dataType: 'ObjectID'},
    type: 'ObjectID',
    id: 1,
    generated: true,
    updateOnly: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  channel: string;

  @property({
    type: 'string',
    required: true,
  })
  userChannelId: string;

  @property({
    type: 'number',
    default: 0,
    required: true,
  })
  hardBounceCount: number;

  @property({
    type: 'string',
    required: true,
    default: 'active',
  })
  state: string;

  @property({
    type: 'array',
    itemType: 'AnonymousModel_7',
  })
  bounceMessages?: string[];

  @property({
    type: 'date',
  })
  latestNotificationStarted?: string;

  @property({
    type: 'date',
  })
  latestNotificationEnded?: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Bounce>) {
    super(data);
  }
}

export interface BounceRelations {
  // describe navigational properties here
}

export type BounceWithRelations = Bounce & BounceRelations;
