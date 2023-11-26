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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { AdminUserProfile } from './constants';
import { LoginDto } from './dto/login.dto';
import { Administrator } from './entities/administrator.entity';

@Injectable()
export class AdministratorsService extends BaseService<Administrator> {
  constructor(
    @InjectModel(Administrator.name)
    model: Model<Administrator>,
  ) {
    super(model);
  }

  async verifyCredentials(credentials: LoginDto): Promise<Administrator> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.model
      .findOne({
        email: credentials.email,
      })
      .populate('userCredential')
      .exec();

    if (!foundUser) {
      throw new HttpException(invalidCredentialsError, HttpStatus.UNAUTHORIZED);
    }
    const passwordMatched = await compare(
      credentials.password,
      foundUser.userCredential.password,
    );

    if (!passwordMatched) {
      throw new HttpException(invalidCredentialsError, HttpStatus.UNAUTHORIZED);
    }
    return foundUser;
  }

  convertToUserProfile(user): AdminUserProfile {
    return {
      securityId: (user._id as string).toString(),
      name: user.username,
      id: user.id,
      userId: (user._id as string).toString(),
      email: user.email,
    };
  }
}
