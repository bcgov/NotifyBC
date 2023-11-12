import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AnyObject, HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';
import { AccessToken } from './access-token.entity';

export type AdministratorDocument = HydratedDocument<Administrator>;

@Schema({
  collection: 'administrator',
  ...BaseSchemaOptions,
  strict: true,
})
export class Administrator extends BaseEntity {
  @Prop()
  username?: string;

  @Prop({
    required: true,
  })
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiHideProperty()
  userCredential: AnyObject;

  @ApiHideProperty()
  accessTokens?: AccessToken[];
}

export const AdministratorSchema = SchemaFactory.createForClass(Administrator)
  .alias('_id', 'id')
  .index({ '$**': 'text' }, { name: '$**_text' })
  .index(
    { email: 1 },
    {
      unique: true,
      name: 'unique_email_ci',
      collation: { locale: 'en_US', strength: 1 },
    },
  );

AdministratorSchema.virtual('userCredential', {
  ref: 'UserCredential',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

AdministratorSchema.virtual('accessTokens', {
  ref: 'AccessToken',
  localField: '_id',
  foreignField: 'userId',
});
