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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type AccessTokenDocument = HydratedDocument<AccessToken>;

@Schema({
  collection: 'AccessToken',
  ...BaseSchemaOptions,
  strict: true,
})
export class AccessToken extends BaseEntity {
  @Prop()
  @ApiHideProperty()
  _id: string;

  @Prop({
    description: 'time to live in seconds',
  })
  ttl?: number;

  @Prop({
    description:
      'name of the token, for example app name where the token is used',
  })
  name?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator',
  })
  userId: string;
}

export const AccessTokenSchema = SchemaFactory.createForClass(
  AccessToken,
).alias('_id', 'id');
