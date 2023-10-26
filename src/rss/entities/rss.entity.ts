import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity, BaseSchemaOptions } from 'src/api/common/base.entity';
import { RssItem, RssItemSchema } from './rss-item.entity';

export type BounceDocument = HydratedDocument<Rss>;

@Schema({
  collection: 'rss',
  ...BaseSchemaOptions,
})
export class Rss extends BaseEntity {
  @Prop({
    required: true,
  })
  serviceName: string;

  @Prop({ type: [RssItemSchema] })
  items?: RssItem[];

  @Prop()
  lastPoll?: Date;
}

export const RssSchema = SchemaFactory.createForClass(Rss);
