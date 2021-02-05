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
import {Administrator, UserCredential} from '../models';
import {
  AdministratorRepository,
  UserCredentialRepository,
} from '../repositories';

@authenticate('ipWhitelist', 'accessToken')
@oas.tags('administrator')
export class AdministratorUserCredentialController {
  constructor(
    @inject(SecurityBindings.USER)
    protected user: UserProfile,
    @repository(AdministratorRepository)
    protected administratorRepository: AdministratorRepository,
    @inject('repositories.UserCredentialRepository', {
      asProxyWithInterceptors: true,
    })
    protected userCredentialRepository: UserCredentialRepository,
  ) {}

  @get('/administrators/{id}/user-credential', {
    responses: {
      '200': {
        description: 'Administrator has one UserCredential',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCredential),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCredential>,
  ): Promise<UserCredential> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    return this.administratorRepository.userCredential(id).get(filter);
  }

  @post('/administrators/{id}/user-credential', {
    responses: {
      '200': {
        description: 'UserCredential model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(UserCredential)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Administrator.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredential, {
            title: 'NewUserCredentialInAdministrator',
            optional: ['userId'],
          }),
        },
      },
    })
    userCredential: Omit<UserCredential, 'id'>,
  ): Promise<UserCredential> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    userCredential.password = await hash(
      userCredential.password,
      await genSalt(),
    );
    await this.administratorRepository.userCredential(id).delete();
    return this.userCredentialRepository.create(
      Object.assign({}, userCredential, {userId: id}),
      undefined,
    );
  }

  @patch('/administrators/{id}/user-credential', {
    responses: {
      '200': {
        description: 'Administrator.UserCredential PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredential, {
            partial: true,
            exclude: ['userId'],
          }),
        },
      },
    })
    userCredential: Partial<UserCredential>,
    @param.query.object('where', getWhereSchemaFor(UserCredential))
    where?: Where<UserCredential>,
  ): Promise<Count> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    if (userCredential.password) {
      userCredential.password = await hash(
        userCredential.password,
        await genSalt(),
      );
    }
    return this.userCredentialRepository.updateAll(
      userCredential,
      {and: [{userId: id}, where]},
      undefined,
    );
  }

  @del('/administrators/{id}/user-credential', {
    responses: {
      '200': {
        description: 'Administrator.UserCredential DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCredential))
    where?: Where<UserCredential>,
  ): Promise<Count> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    return this.administratorRepository.userCredential(id).delete(where);
  }
}
