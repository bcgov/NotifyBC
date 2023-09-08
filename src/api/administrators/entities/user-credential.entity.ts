import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';
import { Administrator } from './administrator.entity';

export const PASSWORD_COMPLEXITY_REGEX =
  '^(?=.*[A-Z])(?=.*[!_@#&$*])(?=.*[0-9])(?=.*[a-z]).{10,}$';

export type UserCredentialDocument = HydratedDocument<UserCredential>;

@Schema({
  collection: 'UserCredential',
  ...BaseSchemaOptions,
  strict: true,
})
export class UserCredential extends BaseEntity {
  @Prop({
    required: true,
    match: new RegExp(PASSWORD_COMPLEXITY_REGEX),
  })
  @ApiProperty({ pattern: PASSWORD_COMPLEXITY_REGEX })
  password: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator',
  })
  userId: Administrator;
}

export const UserCredentialSchema = SchemaFactory.createForClass(
  UserCredential,
).index({ userId: 1 }, { unique: true, name: 'unique_userId' });
