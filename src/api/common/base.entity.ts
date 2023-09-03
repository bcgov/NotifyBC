import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class BaseEntity {
  @Prop(Types.ObjectId)
  id?: string;

  @Prop({ default: Date.now })
  created?: Date;

  @Prop({ default: Date.now })
  updated?: Date;
}

export const BaseSchemaOptions = {
  strict: false,
  toJSON: {
    transform: (doc: unknown, ret: any) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
  },
};
