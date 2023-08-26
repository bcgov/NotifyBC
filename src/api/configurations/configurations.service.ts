import { Injectable } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Configuration } from './entities/configuration.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectModel(Configuration.name)
    private configurationModel: Model<Configuration>,
  ) {}

  create(createConfigurationDto: CreateConfigurationDto) {
    return 'This action adds a new configuration';
  }

  findAll() {
    const res = this.configurationModel.find().exec();
    return res;
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
