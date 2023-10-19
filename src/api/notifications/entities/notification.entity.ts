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

export const NotificationSchema = SchemaFactory.createForClass(
  Notification,
).index({ '$**': 'text' }, { name: '$**_text' });
