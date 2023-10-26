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
import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RssItem extends Model {
  @property({
    type: 'date',
    required: true,
  })
  _notifyBCLastPoll: string;

  @property({
    type: 'date',
  })
  pubDate?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<RssItem>) {
    super(data);
  }
}

export interface RssItemRelations {
  // describe navigational properties here
}

export type RssItemWithRelations = RssItem & RssItemRelations;
