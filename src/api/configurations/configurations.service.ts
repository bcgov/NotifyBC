import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Configuration } from './entities/configuration.entity';
@Injectable()
export class ConfigurationsService extends BaseService<Configuration> {
  constructor(
    @InjectModel(Configuration.name)
    model: Model<Configuration>,
  ) {
    super(model);
  }
}
