import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { Bounce } from './entities/bounce.entity';

@Injectable()
export class BouncesService extends BaseService<Bounce> {
  constructor(
    @InjectModel(Bounce.name)
    model: Model<Bounce>,
  ) {
    super(model);
  }
}
