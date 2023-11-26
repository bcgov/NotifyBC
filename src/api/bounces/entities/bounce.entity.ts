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
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';
import {
  BounceMessageItem,
  BounceMessageItemSchema,
} from './bounce-message-item.entity';

export type BounceDocument = HydratedDocument<Bounce>;

@Schema({
  collection: 'bounce',
  ...BaseSchemaOptions,
})
export class Bounce extends BaseEntity {
  @Prop({
    required: true,
  })
  channel: string;

  @Prop({
    required: true,
  })
  userChannelId: string;

  @Prop({
    default: 0,
  })
  hardBounceCount: number;

  @Prop({
    default: 'active',
  })
  state: string;

  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BounceMessageItem' }],
  // })
  @Prop({ type: [BounceMessageItemSchema] })
  bounceMessages?: BounceMessageItem[];

  @Prop({
    default: null,
  })
  latestNotificationStarted?: Date;

  @Prop()
  latestNotificationEnded?: Date;
}

export const BounceSchema = SchemaFactory.createForClass(Bounce)
  .alias('_id', 'id')
  .index(
    { state: 1, channel: 1, userChannelId: 1 },
    { name: 'state_channel_userChannelId' },
  )
  .index({ '$**': 'text' }, { name: '$**_text' });
