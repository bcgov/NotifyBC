import {AnyObject, Entity, model, property} from '@loopback/repository';

@model({
  name: 'subscription',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      serviceName_state_channel: {keys: {serviceName: 1, state: 1, channel: 1}},
      created: {keys: {created: 1}},
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Subscription extends Entity {
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

  @property({
    type: 'string',
    required: true,
    default: 'email',
  })
  channel: string;

  @property({
    type: 'string',
    required: true,
  })
  userChannelId: string;

  @property({
    type: 'string',
    default: 'unconfirmed',
  })
  state?: string;

  @property({
    type: 'object',
    description:
      'Contains email template, a boolean field to indicate whether to send confirmation message, confirmation code regex or encrypted confirmation code',
  })
  confirmationRequest?: AnyObject;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  broadcastPushNotificationFilter?: string;

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
  [prop: string]: any;

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}
