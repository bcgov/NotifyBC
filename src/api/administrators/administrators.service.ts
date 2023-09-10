import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Administrator } from './entities/administrator.entity';

@Injectable()
export class AdministratorsService extends BaseService<Administrator> {
  constructor(
    @InjectModel(Administrator.name)
    model: Model<Administrator>,
  ) {
    super(model);
  }
}
