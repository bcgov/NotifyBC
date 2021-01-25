import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
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
  HttpErrors,
  oas,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {Administrator, UserCredentials} from '../models';
import {
  AdministratorRepository,
  UserCredentialsRepository,
} from '../repositories';

@authenticate('ipWhitelist', 'accessToken')
@oas.tags('administrator')
export class AdministratorUserCredentialsController {
  constructor(
    @inject(SecurityBindings.USER)
    protected user: UserProfile,
    @repository(AdministratorRepository)
    protected administratorRepository: AdministratorRepository,
    @inject('repositories.UserCredentialsRepository', {
      asProxyWithInterceptors: true,
    })
    protected userCredentialsRepository: UserCredentialsRepository,
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
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
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
            optional: ['userId'],
          }),
        },
      },
    })
    userCredentials: Omit<UserCredentials, 'id'>,
  ): Promise<UserCredentials> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    userCredentials.password = await hash(
      userCredentials.password,
      await genSalt(),
    );
    await this.administratorRepository.userCredentials(id).delete();
    return this.userCredentialsRepository.create(
      Object.assign({}, userCredentials, {userId: id}),
      undefined,
    );
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
          schema: getModelSchemaRef(UserCredentials, {
            partial: true,
            exclude: ['userId'],
          }),
        },
      },
    })
    userCredentials: Partial<UserCredentials>,
    @param.query.object('where', getWhereSchemaFor(UserCredentials))
    where?: Where<UserCredentials>,
  ): Promise<Count> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    if (userCredentials.password) {
      userCredentials.password = await hash(
        userCredentials.password,
        await genSalt(),
      );
    }
    return this.userCredentialsRepository.updateAll(
      userCredentials,
      {and: [{userId: id}, where]},
      undefined,
    );
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
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    return this.administratorRepository.userCredentials(id).delete(where);
  }
}
