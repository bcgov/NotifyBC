import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { FilterQuery, ObjectId } from 'mongoose';
import { LoopbackFilterDto } from '../common/dto/loopback-filter.dto';
import { JsonQuery } from '../common/json-query.decorator';
import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Configuration } from './entities/configuration.entity';

@Controller('configurations')
@ApiTags('configuration')
@ApiExtraModels(Configuration)
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post()
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationsService.create(createConfigurationDto);
  }

  @Get('count')
  count(@JsonQuery('where') where?: FilterQuery<Configuration>) {
    return this.configurationsService.count(where);
  }

  @Get()
  findAll(
    @JsonQuery('filter')
    filter: LoopbackFilterDto<Configuration>,
  ) {
    return this.configurationsService.findAll(filter);
  }

  @Patch()
  updateAll(
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @JsonQuery('where') where?: FilterQuery<Configuration>,
  ) {
    return this.configurationsService.updateAll(updateConfigurationDto, where);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.configurationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationsService.update(id, updateConfigurationDto);
  }

  @Put(':id')
  replaceById(
    @Param('id') id: ObjectId,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationsService.replaceById(id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.configurationsService.remove(id);
  }
}
