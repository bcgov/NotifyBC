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

@authenticate('ipWhitelist', 'accessToken')
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
            exclude: ['id'],
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
