import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Subscription extends Entity {
  @property({
    type: 'string',
    id: true,
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
    required: true,
    default: 'unconfirmed',
  })
  state: string;

  @property({
    type: 'object',
    description:
      'Contains email template, a boolean field to indicate whether to send confirmation message, confirmation code regex or encrypted confirmation code',
  })
  confirmationRequest?: object;

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

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}
