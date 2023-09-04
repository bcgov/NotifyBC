import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateBounceDto } from './dto/create-bounce.dto';
import { UpdateBounceDto } from './dto/update-bounce.dto';
import { Bounce } from './entities/bounce.entity';

@Injectable()
export class BouncesService {
  constructor(
    @InjectModel(Bounce.name)
    private bounceModel: Model<Bounce>,
  ) {}

  count(filter?: FilterQuery<Bounce>) {
    return this.bounceModel.count(filter).exec();
  }

  replaceById(_id: string, updateBounceDto: UpdateBounceDto) {
    return this.bounceModel.findOneAndReplace({ _id }, updateBounceDto).exec();
  }

  create(createBounceDto: CreateBounceDto) {
    const createdConfiguration = new this.bounceModel(createBounceDto);
    return createdConfiguration.save();
  }

  findAll(filter: any = {}) {
    const { where, fields, include, order, ...rest } = filter;
    return this.bounceModel.find(where, fields, rest).sort(order).exec();
  }

  findOne(id: string) {
    return this.bounceModel.findById(id).exec();
  }

  update(id: string, updateBounceDto: UpdateBounceDto) {
    return this.bounceModel.findByIdAndUpdate(id, updateBounceDto).exec();
  }

  remove(id: string) {
    this.bounceModel.findByIdAndRemove(id).exec();
  }

  updateAll(updateDto: UpdateBounceDto, filter?: FilterQuery<Bounce>) {
    return this.bounceModel.updateMany(filter, updateDto).exec();
  }
}
