import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  oas,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {AccessToken, Administrator} from '../models';
import {AdministratorRepository} from '../repositories';

@oas.tags('administrator')
export class AdministratorAccessTokenController {
  constructor(
    @repository(AdministratorRepository)
    protected administratorRepository: AdministratorRepository,
  ) {}

  @get('/administrators/{id}/access-tokens', {
    responses: {
      '200': {
        description: 'Array of Administrator has many AccessToken',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AccessToken)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<AccessToken>,
  ): Promise<AccessToken[]> {
    return this.administratorRepository.accessTokens(id).find(filter);
  }

  @post('/administrators/{id}/access-tokens', {
    responses: {
      '200': {
        description: 'Administrator model instance',
        content: {'application/json': {schema: getModelSchemaRef(AccessToken)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Administrator.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessToken, {
            title: 'NewAccessTokenInAdministrator',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    accessToken: Omit<AccessToken, 'id'>,
  ): Promise<AccessToken> {
    return this.administratorRepository.accessTokens(id).create(accessToken);
  }

  @patch('/administrators/{id}/access-tokens', {
    responses: {
      '200': {
        description: 'Administrator.AccessToken PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessToken, {partial: true}),
        },
      },
    })
    accessToken: Partial<AccessToken>,
    @param.query.object('where', getWhereSchemaFor(AccessToken))
    where?: Where<AccessToken>,
  ): Promise<Count> {
    return this.administratorRepository
      .accessTokens(id)
      .patch(accessToken, where);
  }

  @del('/administrators/{id}/access-tokens', {
    responses: {
      '200': {
        description: 'Administrator.AccessToken DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(AccessToken))
    where?: Where<AccessToken>,
  ): Promise<Count> {
    return this.administratorRepository.accessTokens(id).delete(where);
  }
}
