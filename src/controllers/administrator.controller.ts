import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Administrator} from '../models';
import {AdministratorRepository} from '../repositories';

export class AdministratorController {
  constructor(
    @repository(AdministratorRepository)
    public administratorRepository : AdministratorRepository,
  ) {}

  @post('/administrators', {
    responses: {
      '200': {
        description: 'Administrator model instance',
        content: {'application/json': {schema: getModelSchemaRef(Administrator)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrator, {
            title: 'NewAdministrator',
            exclude: ['id'],
          }),
        },
      },
    })
    administrator: Omit<Administrator, 'id'>,
  ): Promise<Administrator> {
    return this.administratorRepository.create(administrator);
  }

  @get('/administrators/count', {
    responses: {
      '200': {
        description: 'Administrator model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Administrator) where?: Where<Administrator>,
  ): Promise<Count> {
    return this.administratorRepository.count(where);
  }

  @get('/administrators', {
    responses: {
      '200': {
        description: 'Array of Administrator model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Administrator, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Administrator) filter?: Filter<Administrator>,
  ): Promise<Administrator[]> {
    return this.administratorRepository.find(filter);
  }

  @patch('/administrators', {
    responses: {
      '200': {
        description: 'Administrator PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrator, {partial: true}),
        },
      },
    })
    administrator: Administrator,
    @param.where(Administrator) where?: Where<Administrator>,
  ): Promise<Count> {
    return this.administratorRepository.updateAll(administrator, where);
  }

  @get('/administrators/{id}', {
    responses: {
      '200': {
        description: 'Administrator model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Administrator, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Administrator, {exclude: 'where'}) filter?: FilterExcludingWhere<Administrator>
  ): Promise<Administrator> {
    return this.administratorRepository.findById(id, filter);
  }

  @patch('/administrators/{id}', {
    responses: {
      '204': {
        description: 'Administrator PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrator, {partial: true}),
        },
      },
    })
    administrator: Administrator,
  ): Promise<void> {
    await this.administratorRepository.updateById(id, administrator);
  }

  @put('/administrators/{id}', {
    responses: {
      '204': {
        description: 'Administrator PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() administrator: Administrator,
  ): Promise<void> {
    await this.administratorRepository.replaceById(id, administrator);
  }

  @del('/administrators/{id}', {
    responses: {
      '204': {
        description: 'Administrator DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.administratorRepository.deleteById(id);
  }
}
