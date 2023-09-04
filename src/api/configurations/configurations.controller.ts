import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { LoopbackFilterDto } from '../common/dto/loopback-filter.dto';
import { UpdateManyResultDto } from '../common/dto/update-many-result.dto';
import {
  ApiFilterJsonQuery,
  ApiWhereJsonQuery,
  JsonQuery,
} from '../common/json-query.decorator';
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
  @ApiCreatedResponse({
    type: Configuration,
  })
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationsService.create(createConfigurationDto);
  }

  @Get('count')
  @ApiWhereJsonQuery()
  count(@JsonQuery('where') where?: FilterQuery<Configuration>) {
    return this.configurationsService.count(where);
  }

  @Get()
  @ApiFilterJsonQuery()
  @ApiOkResponse({
    type: [Configuration],
  })
  findAll(
    @JsonQuery('filter')
    filter: LoopbackFilterDto<Configuration>,
  ) {
    return this.configurationsService.findAll(filter);
  }

  @Patch()
  @ApiWhereJsonQuery()
  @ApiOkResponse({
    description: 'Configuration PATCH success count',
    type: UpdateManyResultDto,
  })
  updateAll(
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @JsonQuery('where') where?: FilterQuery<Configuration>,
  ) {
    return this.configurationsService.updateAll(updateConfigurationDto, where);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configurationsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration PATCH success' })
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    this.configurationsService.update(id, updateConfigurationDto);
  }

  @Put(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration PUT success' })
  replaceById(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    this.configurationsService.replaceById(id, updateConfigurationDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration DELETE success' })
  remove(@Param('id') id: string) {
    this.configurationsService.remove(id);
  }
}
