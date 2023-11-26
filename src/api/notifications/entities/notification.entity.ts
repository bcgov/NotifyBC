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
import mongoose, { AnyObject, HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  collection: 'notification',
  ...BaseSchemaOptions,
})
export class Notification extends BaseEntity {
  @Prop({ required: true })
  serviceName: string;

  @Prop({
    default: 'new',
  })
  state: string;

  @Prop()
  userChannelId?: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {},
  })
  message: AnyObject;

  @Prop({
    required: true,
    default: 'inApp',
  })
  channel: string;

  @Prop({
    default: false,
  })
  isBroadcast?: boolean;

  @Prop({
    default: false,
  })
  skipSubscriptionConfirmationCheck?: boolean;

  @Prop()
  validTill?: Date;

  @Prop()
  invalidBefore?: Date;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  data?: AnyObject;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
  })
  asyncBroadcastPushNotification?: any;

  @Prop()
  broadcastPushNotificationSubscriptionFilter?: string;

  // Indexer property to allow additional data
  [prop: string]: any;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
  .alias('_id', 'id')
  .index({ '$**': 'text' }, { name: '$**_text' });
