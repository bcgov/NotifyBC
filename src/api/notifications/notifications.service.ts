import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService extends BaseService<Notification> {
  constructor(
    @InjectModel(Notification.name)
    model: Model<Notification>,
  ) {
    super(model);
  }
}
