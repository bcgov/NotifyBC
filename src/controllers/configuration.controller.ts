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

import {authenticate} from '@loopback/authentication';
import {ApplicationConfig, CoreBindings, inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  oas,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {Configuration} from '../models';
import {ConfigurationRepository} from '../repositories';
import {BaseController} from './base.controller';

@authenticate('ipWhitelist', 'clientCertificate')
@oas.tags('configuration')
export class ConfigurationController extends BaseController {
  constructor(
    @inject('repositories.ConfigurationRepository', {
      asProxyWithInterceptors: true,
    })
    public configurationRepository: ConfigurationRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
  ) {
    super(appConfig, configurationRepository);
  }

  @post('/configurations', {
    responses: {
      '200': {
        description: 'Configuration model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Configuration)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {
            title: 'NewConfiguration',
          }),
        },
      },
    })
    configuration: Omit<Configuration, 'id'>,
  ): Promise<Configuration> {
    return this.configurationRepository.create(configuration, undefined);
  }

  @get('/configurations/count', {
    responses: {
      '200': {
        description: 'Configuration model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Configuration) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.configurationRepository.count(where, undefined);
  }

  @get('/configurations', {
    responses: {
      '200': {
        description: 'Array of Configuration model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Configuration, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Configuration) filter?: Filter<Configuration>,
  ): Promise<Configuration[]> {
    return this.configurationRepository.find(filter, undefined);
  }

  @patch('/configurations', {
    responses: {
      '200': {
        description: 'Configuration PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {partial: true}),
        },
      },
    })
    configuration: Configuration,
    @param.where(Configuration) where?: Where<Configuration>,
  ): Promise<Count> {
    return this.configurationRepository.updateAll(
      configuration,
      where,
      undefined,
    );
  }

  @get('/configurations/{id}', {
    responses: {
      '200': {
        description: 'Configuration model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Configuration, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Configuration, {exclude: 'where'})
    filter?: FilterExcludingWhere<Configuration>,
  ): Promise<Configuration | null> {
    return this.configurationRepository.findOne(
      Object.assign({}, {where: {id}}, filter),
      undefined,
    );
  }

  @patch('/configurations/{id}', {
    responses: {
      '204': {
        description: 'Configuration PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Configuration, {partial: true}),
        },
      },
    })
    configuration: Configuration,
  ): Promise<void> {
    await this.configurationRepository.updateById(id, configuration, undefined);
  }

  @put('/configurations/{id}', {
    responses: {
      '204': {
        description: 'Configuration PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() configuration: Configuration,
  ): Promise<void> {
    await this.configurationRepository.replaceById(
      id,
      configuration,
      undefined,
    );
  }

  @del('/configurations/{id}', {
    responses: {
      '204': {
        description: 'Configuration DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.configurationRepository.deleteById(id, undefined);
  }
}
