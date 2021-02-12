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
import {Base} from '.';
import {RssItem} from './rss-item.model';

@model({
  name: 'rss',
  settings: {strict: false, validateUpsert: true, idInjection: true},
})
export class Rss extends Base {
  @property({
    type: 'string',
    required: true,
  })
  serviceName: string;

  @property.array(RssItem)
  items?: RssItem[];

  @property({
    type: 'date',
  })
  lastPoll?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<Rss>) {
    super(data);
  }
}

export interface RssRelations {
  // describe navigational properties here
}

export type RssWithRelations = Rss & RssRelations;
