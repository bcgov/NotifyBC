import {model, property} from '@loopback/repository';
import {Base} from './base.model';
import {BounceMessageItem} from './bounce-message-item.model';

@model({
  name: 'bounce',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      state_channel_userChannelId: {
        keys: {state: 1, channel: 1, userChannelId: 1},
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Bounce extends Base {
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
  channel: string;

  @property({
    type: 'string',
    required: true,
  })
  userChannelId: string;

  @property({
    type: 'number',
    default: 0,
  })
  hardBounceCount: number;

  @property({
    type: 'string',
    default: 'active',
  })
  state: string;

  @property.array(BounceMessageItem)
  bounceMessages?: BounceMessageItem[];

  @property({
    type: 'date',
    default: null,
  })
  latestNotificationStarted?: string;

  @property({
    type: 'date',
  })
  latestNotificationEnded?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Bounce>) {
    super(data);
  }
}

export interface BounceRelations {
  // describe navigational properties here
}

export type BounceWithRelations = Bounce & BounceRelations;
