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

@model({
  name: 'configuration',
  settings: {
    strict: false,
    validateUpsert: true,
    idInjection: true,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_name_serviceName: {
        keys: {name: 1, serviceName: 1},
        options: {unique: true},
      },
      '$**_text': {keys: {'$**': 'text'}},
    },
  },
})
export class Configuration extends Base {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'any',
  })
  value?: any;

  @property({
    type: 'string',
  })
  serviceName?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Configuration>) {
    super(data);
  }
}

export interface ConfigurationRelations {
  // describe navigational properties here
}

export type ConfigurationWithRelations = Configuration & ConfigurationRelations;
