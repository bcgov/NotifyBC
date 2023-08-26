import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/api/base.entity';

export type ConfigurationDocument = HydratedDocument<Configuration>;

@Schema({ collection: 'configuration' })
export class Configuration extends BaseEntity {}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
