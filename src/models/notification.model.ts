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

  @property({
    type: 'string',
  })
  broadcastPushNotificationSubscriptionFilter?: string;

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
