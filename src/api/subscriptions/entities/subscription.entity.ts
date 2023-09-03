import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  collection: 'subscription',
  ...BaseSchemaOptions,
})
export class Subscription extends BaseEntity {}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)
  .index({ '$**': 'text' }, { name: '$**_text' })
  .index(
    { serviceName: 1, state: 1, channel: 1 },
    { name: 'serviceName_state_channel' },
  )
  .index({ created: 1 }, { name: 'created' });
