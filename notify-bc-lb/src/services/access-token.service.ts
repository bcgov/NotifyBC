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

import {TokenService} from '@loopback/authentication';
import {inject, injectable, service} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {AccessToken} from '../models';
import {AccessTokenRepository, AdministratorRepository} from '../repositories';
import {AdminUserService} from './admin-user.service';

@injectable()
export class AccessTokenService implements TokenService {
  constructor(
    @inject('repositories.AccessTokenRepository', {
      asProxyWithInterceptors: true,
    })
    public accessTokenRepository: AccessTokenRepository,
    @repository(AdministratorRepository)
    public userRepository: AdministratorRepository,
    @service(AdminUserService)
    public adminUserService: AdminUserService,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      const accessToken = await this.accessTokenRepository.findById(
        token,
        undefined,
        undefined,
      );
      if (
        accessToken.ttl !== undefined &&
        Date.parse(accessToken.created as string) + 1000 * accessToken.ttl <
          Date.now()
      ) {
        throw new Error();
      }
      const user = await this.userRepository.findById(accessToken.userId);
      userProfile = this.adminUserService.convertToUserProfile(user);
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(
    userProfile: UserProfile,
    options?: AnyObject,
  ): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    let id: string;
    try {
      const opts = options ?? {};
      const accessToken = new AccessToken(
        Object.assign({}, opts, {
          userId: userProfile[securityId],
        }),
      );
      const res = await this.accessTokenRepository.create(
        accessToken,
        undefined,
      );
      id = res.id;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }
    return id;
  }
}
