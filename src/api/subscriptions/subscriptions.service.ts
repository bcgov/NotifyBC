import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService extends BaseService<Subscription> {
  constructor(
    @InjectModel(Subscription.name)
    model: Model<Subscription>,
  ) {
    super(model);
  }

  distinct(field: string, filter?: FilterQuery<Subscription>) {
    return this.model.distinct(field, filter).exec();
  }
}
