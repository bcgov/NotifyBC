import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rss, RssSchema } from './entities/rss.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rss.name, schema: RssSchema }])],
})
export class RssModule {}
