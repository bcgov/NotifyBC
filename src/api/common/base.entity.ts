import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class BaseEntity {
  @Prop(mongoose.Schema.Types.ObjectId)
  id?: string;

  @Prop({ default: Date.now })
  created?: Date;

  @Prop({ default: Date.now })
  updated?: Date;
}

export const BaseSchemaOptions = {
  strict: false,
  versionKey: false,
  toJSON: {
    transform: (doc: unknown, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};
