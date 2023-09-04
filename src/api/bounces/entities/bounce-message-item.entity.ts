import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BounceMessageItemDocument = HydratedDocument<BounceMessageItem>;

@Schema({
  collection: 'BounceMessageItem',
  _id: false,
})
export class BounceMessageItem {
  @Prop({
    required: true,
    default: Date.now,
  })
  date: Date;

  @Prop({
    required: true,
  })
  message: string;
}

export const BounceMessageItemSchema =
  SchemaFactory.createForClass(BounceMessageItem);
