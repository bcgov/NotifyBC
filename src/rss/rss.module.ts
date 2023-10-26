import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rss, RssSchema } from './entities/rss.entity';
import { RssService } from './rss.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Rss.name, schema: RssSchema }])],
  providers: [RssService],
  exports: [RssService],
})
export class RssModule {}
