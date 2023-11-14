import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaOptions } from 'src/api/common/base.entity';

@Schema({
  ...BaseSchemaOptions,
})
export class RssItem {
  @Prop({
    required: true,
  })
  _notifyBCLastPoll: Date;

  @Prop()
  pubDate?: Date;

  [prop: string]: any;
}

export const RssItemSchema = SchemaFactory.createForClass(RssItem);
