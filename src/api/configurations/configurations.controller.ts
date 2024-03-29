// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
import { RssHttpHostPipe } from './rss-http-host.pipe';

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
  create(
    @Body(RssHttpHostPipe) createConfigurationDto: CreateConfigurationDto,
    @Req() req,
  ) {
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
    @Body(RssHttpHostPipe) updateConfigurationDto: CreateConfigurationDto,
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
