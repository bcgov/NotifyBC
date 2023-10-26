import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/api/common/base.service';
import { Rss } from './entities/rss.entity';

@Injectable()
export class RssService extends BaseService<Rss> {
  constructor(
    @InjectModel(Rss.name)
    model: Model<Rss>,
  ) {
    super(model);
  }
}
