import {authenticate} from '@loopback/authentication';
import {ApplicationConfig, CoreBindings, inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  oas,
  param,
  patch,
  post,
  put,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {Administrator, PASSWORD_COMPLEXITY_REGEX} from '../models';
import {
  AccessTokenRepository,
  AdministratorRepository,
  ConfigurationRepository,
  UserCredentialRepository,
} from '../repositories';
import {AccessTokenService, AdminUserService} from '../services';
import {BaseController} from './base.controller';

@model()
export class NewUserRequest extends Administrator {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: PASSWORD_COMPLEXITY_REGEX,
    },
  })
  password: string;
}

export declare type Credentials = {
  email: string;
  password: string;
  tokenName?: string;
  ttl?: number;
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    tokenName: {
      type: 'string',
    },
    ttl: {
      type: 'number',
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

@oas.tags('administrator')
@authenticate('ipWhitelist', 'accessToken')
export class AdministratorController extends BaseController {
  constructor(
    @inject('repositories.AdministratorRepository', {
      asProxyWithInterceptors: true,
    })
    public administratorRepository: AdministratorRepository,
    @repository(UserCredentialRepository)
    public userCredentialRepository: UserCredentialRepository,
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
    @service(AccessTokenService)
    public accessTokenService: AccessTokenService,
    @service(AdminUserService)
    public userService: AdminUserService,
    @inject(SecurityBindings.USER)
    public user: UserProfile,
    @inject('repositories.ConfigurationRepository', {
      asProxyWithInterceptors: true,
    })
    public configurationRepository: ConfigurationRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
  ) {
    super(appConfig, configurationRepository);
  }

  @authenticate('ipWhitelist')
  @post('/administrators', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Administrator,
            },
          },
        },
      },
      '409': {
        description: 'conflict',
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<Administrator> {
    const savedUser = await this.administratorRepository.create(
      _.omit(newUserRequest, 'password'),
      undefined,
    );
    const password = await hash(newUserRequest.password, await genSalt());
    await this.userCredentialRepository.create(
      {userId: savedUser.id, password},
      undefined,
    );
    return savedUser;
  }

  @authenticate('anonymous')
  @post('/administrators/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.accessTokenService.generateToken(userProfile, {
      name: credentials.tokenName,
      ttl: credentials.ttl,
    });
    return {token};
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
    if (this.user.authnStrategy === 'accessToken') {
      where = {and: [where ?? {}, {id: this.user[securityId]}]};
    }
    return this.administratorRepository.count(where, undefined);
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
    if (this.user.authnStrategy === 'accessToken') {
      filter = filter ?? {};
      filter.where = {and: [filter.where ?? {}, {id: this.user[securityId]}]};
    }

    return this.administratorRepository.find(filter, undefined);
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
    @param.filter(Administrator, {exclude: 'where'})
    filter?: FilterExcludingWhere<Administrator>,
  ): Promise<Administrator | null> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    return this.administratorRepository.findOne(
      Object.assign({}, {where: {id: id}}, filter),
      undefined,
    );
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
    administrator: Partial<Administrator>,
  ): Promise<void> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    await this.administratorRepository.updateById(id, administrator, undefined);
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
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    await this.administratorRepository.replaceById(
      id,
      administrator,
      undefined,
    );
  }

  @del('/administrators/{id}', {
    responses: {
      '204': {
        description: 'Administrator DELETE success',
      },
      '401': {
        description: 'Unauthorized',
      },
      '403': {
        description: 'Forbidden',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    await this.accessTokenRepository.deleteAll({userId: id}, undefined);
    await this.userCredentialRepository.deleteAll({userId: id}, undefined);
    await this.administratorRepository.deleteById(id, undefined);
  }
}
