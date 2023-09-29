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
import {ApplicationConfig, CoreBindings, inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  model,
  property,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  SchemaObject,
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
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import _ from 'lodash';
import {AdministratorUserCredentialController} from '.';
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

const UserProfileSchema: SchemaObject = {
  type: 'object',
  required: ['authnStrategy'],
  properties: {
    authnStrategy: {
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
@authenticate('ipWhitelist', 'clientCertificate', 'accessToken')
export class AdministratorController extends BaseController {
  constructor(
    @inject('repositories.AdministratorRepository', {
      asProxyWithInterceptors: true,
    })
    public administratorRepository: AdministratorRepository,
    @inject('controllers.AdministratorUserCredentialController', {
      asProxyWithInterceptors: true,
    })
    public administratorUserCredentialController: AdministratorUserCredentialController,
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

  @authenticate('ipWhitelist', 'clientCertificate')
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
    await this.administratorUserCredentialController.create(savedUser.id, {
      password: newUserRequest.password,
    });
    return savedUser;
  }

  @authenticate('anonymous')
  // start: ported
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

  @authenticate(
    'ipWhitelist',
    'clientCertificate',
    'accessToken',
    'oidc',
    'siteMinder',
    'anonymous',
  )
  @get('/administrators/whoami', {
    responses: {
      '200': {
        description: 'User Profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  async whoAmI(): Promise<UserProfile> {
    return this.user;
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
  // end: ported

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

  // start: ported
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
    if (administrator.password) {
      await this.administratorUserCredentialController.create(id, {
        password: administrator.password,
      });
      delete administrator.password;
    }
    await this.administratorRepository.replaceById(
      id,
      administrator,
      undefined,
    );
  }
  // end: ported

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
