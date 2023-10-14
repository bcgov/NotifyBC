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
  Req,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { Roles } from 'src/auth/roles.decorator';
import { FilterDto } from '../common/dto/filter.dto';
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
@Roles(Role.SuperAdmin)
@ApiForbiddenResponse({ description: 'Forbidden' })
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post()
  @ApiOkResponse({
    description: 'Configuration model instance',
    type: Configuration,
  })
  @HttpCode(200)
  create(@Body() createConfigurationDto: CreateConfigurationDto, @Req() req) {
    return this.configurationsService.create(createConfigurationDto, req);
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
    filter: FilterDto<Configuration>,
  ) {
    return this.configurationsService.findAll(filter);
  }

  @Patch()
  @ApiWhereJsonQuery()
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration PATCH success' })
  updateAll(
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @Req() req,
    @JsonQuery('where') where?: FilterQuery<Configuration>,
  ) {
    return this.configurationsService.updateAll(
      updateConfigurationDto,
      where,
      req,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: [Configuration],
  })
  findOne(@Param('id') id: string) {
    return this.configurationsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration PATCH success' })
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
    @Req() req,
  ) {
    return this.configurationsService.updateById(
      id,
      updateConfigurationDto,
      req,
    );
  }

  @Put(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration PUT success' })
  replaceById(
    @Param('id') id: string,
    @Body() updateConfigurationDto: CreateConfigurationDto,
    @Req() req,
  ) {
    return this.configurationsService.replaceById(
      id,
      updateConfigurationDto,
      req,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Configuration DELETE success' })
  remove(@Param('id') id: string) {
    return this.configurationsService.remove(id);
  }
}
