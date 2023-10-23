import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserProfile } from 'src/auth/dto/user-profile.dto';

@Schema()
export class BaseEntity {
  id?: string;

  @Prop({ default: Date.now })
  created?: Date;

  @Prop()
  updated?: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy?: UserProfile;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  updatedBy?: UserProfile;
}

export const BaseSchemaOptions = {
  strict: false,
  versionKey: false,
  toJSON: {
    transform: (doc: unknown, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
};
