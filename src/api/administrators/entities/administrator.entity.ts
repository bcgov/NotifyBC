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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AnyObject, HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';
import { AccessToken } from './access-token.entity';

export type AdministratorDocument = HydratedDocument<Administrator>;

@Schema({
  collection: 'administrator',
  ...BaseSchemaOptions,
  strict: true,
})
export class Administrator extends BaseEntity {
  @Prop()
  username?: string;

  @Prop({
    required: true,
  })
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiHideProperty()
  userCredential: AnyObject;

  @ApiHideProperty()
  accessTokens?: AccessToken[];
}

export const AdministratorSchema = SchemaFactory.createForClass(Administrator)
  .alias('_id', 'id')
  .index({ '$**': 'text' }, { name: '$**_text' })
  .index(
    { email: 1 },
    {
      unique: true,
      name: 'unique_email_ci',
      collation: { locale: 'en_US', strength: 1 },
    },
  );

AdministratorSchema.virtual('userCredential', {
  ref: 'UserCredential',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

AdministratorSchema.virtual('accessTokens', {
  ref: 'AccessToken',
  localField: '_id',
  foreignField: 'userId',
});
