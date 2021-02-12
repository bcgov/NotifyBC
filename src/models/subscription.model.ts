// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {AnyObject, model, property} from '@loopback/repository';
import {Base} from '.';

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
export class Subscription extends Base {
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

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}
