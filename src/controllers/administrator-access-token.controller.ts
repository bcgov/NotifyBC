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
import {AccessToken, Administrator} from '../models';
import {AccessTokenRepository, AdministratorRepository} from '../repositories';

@authenticate('ipWhitelist', 'accessToken')
@oas.tags('administrator')
export class AdministratorAccessTokenController {
  constructor(
    @inject(SecurityBindings.USER)
    protected user: UserProfile,
    @repository(AdministratorRepository)
    protected administratorRepository: AdministratorRepository,
    @inject('repositories.AccessTokenRepository', {
      asProxyWithInterceptors: true,
    })
    protected accessTokenRepository: AccessTokenRepository,
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
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
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
            exclude: ['userId'],
          }),
        },
      },
    })
    accessToken: Omit<AccessToken, 'id'>,
  ): Promise<AccessToken> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    return this.accessTokenRepository.create(
      Object.assign({userId: id}, accessToken),
      undefined,
    );
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
          schema: getModelSchemaRef(AccessToken, {
            partial: true,
            exclude: ['userId'],
          }),
        },
      },
    })
    accessToken: Partial<AccessToken>,
    @param.query.object('where', getWhereSchemaFor(AccessToken))
    where?: Where<AccessToken>,
  ): Promise<Count> {
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    // updating userId is not allowed.
    if (accessToken.userId) {
      throw new HttpErrors.Forbidden('Updating userId is not allowed.');
    }
    return this.accessTokenRepository.updateAll(
      accessToken,
      {and: [where, {userId: id}]},
      undefined,
    );
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
    if (
      this.user.authnStrategy === 'accessToken' &&
      this.user[securityId] !== id
    ) {
      throw new HttpErrors.Forbidden();
    }
    return this.administratorRepository.accessTokens(id).delete(where);
  }
}
