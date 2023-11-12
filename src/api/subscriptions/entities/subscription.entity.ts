import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { AnyObject, HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  collection: 'subscription',
  ...BaseSchemaOptions,
})
export class Subscription extends BaseEntity {
  @Prop({
    required: true,
  })
  serviceName: string;

  @Prop({
    required: true,
    default: 'email',
  })
  channel: string;

  @Prop({
    required: true,
  })
  userChannelId: string;

  @Prop({
    default: 'unconfirmed',
  })
  state?: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    description:
      'Contains email template, a boolean field to indicate whether to send confirmation message, confirmation code regex or encrypted confirmation code',
  })
  confirmationRequest?: AnyObject;

  @Prop()
  userId?: string;

  @Prop()
  broadcastPushNotificationFilter?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data?: AnyObject;

  @Prop()
  unsubscriptionCode?: string;

  // Indexer property to allow additional data
  [prop: string]: any;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
  .alias('_id', 'id')
  .index({ '$**': 'text' }, { name: '$**_text' })
  .index(
    { serviceName: 1, state: 1, channel: 1 },
    { name: 'serviceName_state_channel' },
  )
  .index({ created: 1 }, { name: 'created' });
