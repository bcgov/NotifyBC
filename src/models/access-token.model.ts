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
    description: 'time to live in seconds',
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
