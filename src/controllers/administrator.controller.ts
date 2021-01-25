import {authenticate, TokenService} from '@loopback/authentication';
import {ApplicationConfig, CoreBindings, inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
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
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {Administrator} from '../models';
import {
  AdministratorRepository,
  ConfigurationRepository,
} from '../repositories';
import {AccessTokenService, AdminUserService} from '../services';
import {BaseController} from './base.controller';

@model()
export class NewUserRequest extends Administrator {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export declare type Credentials = {
  email: string;
  password: string;
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
@authenticate('ipWhitelist')
export class AdministratorController extends BaseController {
  constructor(
    @inject('repositories.AdministratorRepository', {
      asProxyWithInterceptors: true,
    })
    public administratorRepository: AdministratorRepository,
    @service(AccessTokenService)
    public accessTokenService: TokenService,
    @service(AdminUserService)
    public userService: AdminUserService,
    @inject(SecurityBindings.USER, {optional: true})
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
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<Administrator> {
    const password = await hash(newUserRequest.password, await genSalt());
    newUserRequest.password = password;
    const savedUser = await this.administratorRepository.create(
      newUserRequest,
      undefined,
    );
    return savedUser;
  }

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
    const token = await this.accessTokenService.generateToken(userProfile);
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
    return this.administratorRepository.find(filter, undefined);
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
    return this.administratorRepository.updateAll(
      administrator,
      where,
      undefined,
    );
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
    administrator: Administrator,
  ): Promise<void> {
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
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.administratorRepository.deleteById(id, undefined);
  }
}
