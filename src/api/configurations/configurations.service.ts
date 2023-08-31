import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  findAll(filter: any = {}) {
    const { where, fields, include, order, ...rest } = filter;
    return this.configurationModel.find(where, fields, rest).sort(order).exec();
  }

  count(filter?: FilterQuery<Configuration>) {
    return this.configurationModel.count(filter).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} configuration`;
  }

  update(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    return `This action updates a #${id} configuration`;
  }

  remove(id: number) {
    return `This action removes a #${id} configuration`;
  }
}
