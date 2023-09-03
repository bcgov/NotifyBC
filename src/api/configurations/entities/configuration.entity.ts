import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';

export type ConfigurationDocument = HydratedDocument<Configuration>;

@Schema({
  collection: 'configuration',
  ...BaseSchemaOptions,
})
export class Configuration extends BaseEntity {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  value: any;

  @Prop()
  serviceName?: string;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration)
  .index(
    { name: 1, serviceName: 1 },
    { unique: true, name: 'unique_name_serviceName' },
  )
  .index({ '$**': 'text' }, { name: '$**_text' });
