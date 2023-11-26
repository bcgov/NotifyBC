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
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type ConfigurationDocument = HydratedDocument<Configuration>;

@Schema({
  collection: 'configuration',
  ...BaseSchemaOptions,
})
export class Configuration extends BaseEntity {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  value: any;

  @Prop()
  serviceName?: string;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration)
  .alias('_id', 'id')
  .index(
    { name: 1, serviceName: 1 },
    { unique: true, name: 'unique_name_serviceName' },
  )
  .index({ '$**': 'text' }, { name: '$**_text' });
