import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LoopbackFilterDto } from '../common/dto/loopback-filter.dto';
import { JsonQuery } from '../common/json-query.decorator';
import { ConfigurationsService } from './configurations.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post()
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationsService.create(createConfigurationDto);
  }

  @Get()
  findAll(
    @JsonQuery('filter')
    filter: LoopbackFilterDto,
  ) {
    return this.configurationsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configurationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationsService.update(+id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configurationsService.remove(+id);
  }
}
