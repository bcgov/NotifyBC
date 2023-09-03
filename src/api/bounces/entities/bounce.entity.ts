import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type BounceDocument = HydratedDocument<Bounce>;

@Schema({
  collection: 'bounce',
  ...BaseSchemaOptions,
})
export class Bounce extends BaseEntity {}

export const BounceSchema = SchemaFactory.createForClass(Bounce)
  .index(
    { state: 1, channel: 1, userChannelId: 1 },
    { name: 'state_channel_userChannelId' },
  )
  .index({ '$**': 'text' }, { name: '$**_text' });
