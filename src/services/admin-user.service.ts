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

import {UserService} from '@loopback/authentication';
import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {Administrator} from '../models';
import {AdministratorRepository} from '../repositories';

export type Credentials = {
  email: string;
  password: string;
};

@injectable()
export class AdminUserService
  implements UserService<Administrator, Credentials> {
  constructor(
    @repository(AdministratorRepository)
    public userRepository: AdministratorRepository,
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<Administrator> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
      include: ['userCredential'],
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const passwordMatched = await compare(
      credentials.password,
      foundUser.userCredential.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: Administrator): UserProfile {
    return {
      [securityId]: (user.id as string).toString(),
      name: user.username,
      id: user.id,
      userId: (user.id as string).toString(),
      email: user.email,
    };
  }
}
