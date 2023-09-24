import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type AccessTokenDocument = HydratedDocument<AccessToken>;

@Schema({
  collection: 'AccessToken',
  ...BaseSchemaOptions,
  strict: true,
})
export class AccessToken extends BaseEntity {
  @Prop()
  @ApiHideProperty()
  _id: string;

  @Prop({
    description: 'time to live in seconds',
  })
  ttl?: number;

  @Prop({
    description:
      'name of the token, for example app name where the token is used',
  })
  name?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator',
  })
  userId: string;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
