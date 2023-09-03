import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type AdministratorDocument = HydratedDocument<Administrator>;

@Schema({
  collection: 'administrator',
  ...BaseSchemaOptions,
})
export class Administrator extends BaseEntity {}

export const AdministratorSchema = SchemaFactory.createForClass(Administrator)
  .index({ '$**': 'text' }, { name: '$**_text' })
  .index({ email: 1 }, { unique: true, name: 'unique_email' });
