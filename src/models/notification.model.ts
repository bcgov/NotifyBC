import {AnyObject, model, property} from '@loopback/repository';
import {Base} from '.';

@model({
  name: 'notification',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    indexes: {'$**_text': {keys: {'$**': 'text'}}},
    hidden: [],
  },
})
export class Notification extends Base {
  @property({
    type: 'string',
    required: true,
  })
  serviceName: string;

  @property({
    type: 'string',
    default: 'new',
  })
  state: string;

  @property({
    type: 'string',
  })
  userChannelId?: string;

  @property({
    type: 'object',
    required: true,
    default: {},
  })
  message: AnyObject;

  @property({
    type: 'string',
    required: true,
    default: 'inApp',
  })
  channel: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isBroadcast?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  skipSubscriptionConfirmationCheck?: boolean;

  @property({
    type: 'date',
  })
  validTill?: string;

  @property({
    type: 'date',
  })
  invalidBefore?: string;

  @property({
    type: 'object',
  })
  data?: object;

  @property({
    type: 'any',
  })
  asyncBroadcastPushNotification?: any;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  // describe navigational properties here
}

export type NotificationWithRelations = Notification & NotificationRelations;
