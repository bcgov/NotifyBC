import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  collection: 'notification',
  ...BaseSchemaOptions,
})
export class Notification extends BaseEntity {}

export const NotificationSchema = SchemaFactory.createForClass(
  Notification,
).index({ '$**': 'text' }, { name: '$**_text' });
