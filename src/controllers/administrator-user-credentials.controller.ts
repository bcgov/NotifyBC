import {authenticate} from '@loopback/authentication';
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
import {Administrator, UserCredentials} from '../models';
import {AdministratorRepository} from '../repositories';

@authenticate('ipWhitelist', 'accessToken')
@oas.tags('administrator')
export class AdministratorUserCredentialsController {
  constructor(
    @repository(AdministratorRepository)
    protected administratorRepository: AdministratorRepository,
  ) {}

  @get('/administrators/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Administrator has one UserCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCredentials),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCredentials>,
  ): Promise<UserCredentials> {
    return this.administratorRepository.userCredentials(id).get(filter);
  }

  @post('/administrators/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Administrator model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(UserCredentials)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Administrator.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {
            title: 'NewUserCredentialsInAdministrator',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userCredentials: Omit<UserCredentials, 'id'>,
  ): Promise<UserCredentials> {
    return this.administratorRepository
      .userCredentials(id)
      .create(userCredentials);
  }

  @patch('/administrators/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Administrator.UserCredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {partial: true}),
        },
      },
    })
    userCredentials: Partial<UserCredentials>,
    @param.query.object('where', getWhereSchemaFor(UserCredentials))
    where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.administratorRepository
      .userCredentials(id)
      .patch(userCredentials, where);
  }

  @del('/administrators/{id}/user-credentials', {
    responses: {
      '200': {
        description: 'Administrator.UserCredentials DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCredentials))
    where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.administratorRepository.userCredentials(id).delete(where);
  }
}
