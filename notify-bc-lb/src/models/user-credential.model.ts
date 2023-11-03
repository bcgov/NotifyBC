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

export const PASSWORD_COMPLEXITY_REGEX =
  '^(?=.*[A-Z])(?=.*[!_@#$&*])(?=.*[0-9])(?=.*[a-z]).{10,}$';

@model({
  settings: {
    strict: false,
    indexes: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_userId: {keys: {userId: 1}, options: {unique: true}},
    },
  },
})
export class UserCredential extends Base {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: PASSWORD_COMPLEXITY_REGEX,
    },
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  [prop: string]: any;

  constructor(data?: Partial<UserCredential>) {
    super(data);
  }
}

export interface UserCredentialRelations {
  // describe navigational properties here
}

export type UserCredentialWithRelations = UserCredential &
  UserCredentialRelations;
