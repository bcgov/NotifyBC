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
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export const PASSWORD_COMPLEXITY_REGEX =
  '^(?=.*[A-Z])(?=.*[!_@#&$*])(?=.*[0-9])(?=.*[a-z]).{10,}$';

export type UserCredentialDocument = HydratedDocument<UserCredential>;

@Schema({
  collection: 'UserCredential',
  ...BaseSchemaOptions,
  strict: true,
})
export class UserCredential extends BaseEntity {
  @Prop({
    required: true,
    match: new RegExp(PASSWORD_COMPLEXITY_REGEX),
  })
  @ApiProperty({ pattern: PASSWORD_COMPLEXITY_REGEX })
  password: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator',
  })
  userId: string;
}

export const UserCredentialSchema = SchemaFactory.createForClass(UserCredential)
  .alias('_id', 'id')
  .index({ userId: 1 }, { unique: true, name: 'unique_userId' });
