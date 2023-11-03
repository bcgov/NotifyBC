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

// file ported
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
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Bounce extends Base {
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
