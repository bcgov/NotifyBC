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

// file ported
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  oas,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {
  Administrator,
  PASSWORD_COMPLEXITY_REGEX,
  UserCredential,
} from '../models';
import {
  AdministratorRepository,
  UserCredentialRepository,
} from '../repositories';

@authenticate('ipWhitelist', 'clientCertificate', 'accessToken')
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
            exclude: ['userId'],
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
    const pwdRegEx = new RegExp(PASSWORD_COMPLEXITY_REGEX);
    if (!pwdRegEx.test(userCredential.password)) {
      throw new HttpErrors.BadRequest();
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
}
