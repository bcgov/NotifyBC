import {authenticate} from '@loopback/authentication';
import {ApplicationConfig, CoreBindings, inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
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
import {Bounce} from '../models';
import {BounceRepository, ConfigurationRepository} from '../repositories';
import {BaseController} from './base.controller';

@authenticate('ipWhitelist', 'accessToken')
@oas.tags('bounce')
export class BounceController extends BaseController {
  constructor(
    @inject('repositories.BounceRepository', {
      asProxyWithInterceptors: true,
    })
    public bounceRepository: BounceRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
  ) {
    super(appConfig, configurationRepository);
  }

  @post('/bounces', {
    responses: {
      '200': {
        description: 'Bounce model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bounce)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bounce, {
            title: 'NewBounce',
            exclude: ['id'],
          }),
        },
      },
    })
    bounce: Omit<Bounce, 'id'>,
  ): Promise<Bounce> {
    return this.bounceRepository.create(bounce, undefined);
  }

  @get('/bounces/count', {
    responses: {
      '200': {
        description: 'Bounce model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Bounce) where?: Where<Bounce>): Promise<Count> {
    return this.bounceRepository.count(where, undefined);
  }

  @get('/bounces', {
    responses: {
      '200': {
        description: 'Array of Bounce model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Bounce, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Bounce) filter?: Filter<Bounce>): Promise<Bounce[]> {
    return this.bounceRepository.find(filter, undefined);
  }

  @patch('/bounces', {
    responses: {
      '200': {
        description: 'Bounce PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bounce, {partial: true}),
        },
      },
    })
    bounce: Bounce,
    @param.where(Bounce) where?: Where<Bounce>,
  ): Promise<Count> {
    return this.bounceRepository.updateAll(bounce, where, undefined);
  }

  @get('/bounces/{id}', {
    responses: {
      '200': {
        description: 'Bounce model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bounce, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bounce, {exclude: 'where'})
    filter?: FilterExcludingWhere<Bounce>,
  ): Promise<Bounce | null> {
    return this.bounceRepository.findOne(
      Object.assign({}, {where: {id: id}}, filter),
      undefined,
    );
  }

  @patch('/bounces/{id}', {
    responses: {
      '204': {
        description: 'Bounce PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bounce, {partial: true}),
        },
      },
    })
    bounce: Bounce,
  ): Promise<void> {
    await this.bounceRepository.updateById(id, bounce, undefined);
  }

  @put('/bounces/{id}', {
    responses: {
      '204': {
        description: 'Bounce PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bounce: Bounce,
  ): Promise<void> {
    await this.bounceRepository.replaceById(id, bounce, undefined);
  }

  @del('/bounces/{id}', {
    responses: {
      '204': {
        description: 'Bounce DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.bounceRepository.deleteById(id, undefined);
  }
}
