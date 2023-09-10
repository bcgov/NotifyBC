import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compact } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Configuration } from './entities/configuration.entity';
@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectModel(Configuration.name)
    private configurationModel: Model<Configuration>,
  ) {}

  create(createConfigurationDto: CreateConfigurationDto) {
    const createdConfiguration = new this.configurationModel(
      createConfigurationDto,
    );
    return createdConfiguration.save();
  }

  count(filter?: FilterQuery<Configuration>) {
    return this.configurationModel.count(filter).exec();
  }

  findAll(filter: any = {}) {
    const { where, fields, include, order, skip, limit, ...rest } = filter;
    return this.configurationModel
      .aggregate(
        compact([
          {
            $addFields: {
              id: { $toString: '$_id' },
            },
          },
          where && {
            $match: where,
          },
          order && {
            $sort: order,
          },
          skip && {
            $skip: skip,
          },
          limit && { $limit: limit },
          {
            $project: { ...fields, _id: false },
          },
        ]),
      )
      .exec();
  }

  updateAll(
    updateConfigurationDto: UpdateConfigurationDto,
    filter?: FilterQuery<Configuration>,
  ) {
    return this.configurationModel
      .updateMany(filter, updateConfigurationDto)
      .exec();
  }

  findOne(id: string) {
    return this.configurationModel.findById(id).exec();
  }

  update(id: string, updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationModel
      .findByIdAndUpdate(id, updateConfigurationDto)
      .exec();
  }

  replaceById(_id: string, updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationModel
      .findOneAndReplace({ _id }, updateConfigurationDto)
      .exec();
  }

  remove(id: string) {
    this.configurationModel.findByIdAndRemove(id).exec();
  }
}
