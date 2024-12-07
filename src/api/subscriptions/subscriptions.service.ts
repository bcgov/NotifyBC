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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { BaseService } from '../common/base.service';
import { CountDto } from '../common/dto/count.dto';
import { FilterDto } from '../common/dto/filter.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService extends BaseService<Subscription> {
  constructor(
    @InjectModel(Subscription.name)
    model: Model<Subscription>,
  ) {
    super(model);
  }

  distinct(field: string, filter?: FilterQuery<Subscription>) {
    return this.model.distinct(field, filter).exec();
  }

  accessInterceptor(
    req: Request & { user: UserProfile },
    where: FilterQuery<Subscription>,
  ): FilterQuery<Subscription> {
    if (!req) return where;
    if (req.user?.role !== Role.AuthenticatedUser) return where;
    return {
      $and: [
        where || {},
        { userId: req.user.securityId },
        {
          state: {
            $ne: 'deleted',
          },
        },
      ],
    };
  }

  async count(
    req: Request & { user: UserProfile },
    where?: FilterQuery<Subscription>,
  ): Promise<CountDto> {
    where = this.accessInterceptor(req, where);
    return super.count(where);
  }

  findAll(
    filter: FilterDto<Subscription> = {},
    req: Request & { user: UserProfile },
  ) {
    filter.where = this.accessInterceptor(req, filter.where);
    return super.findAll(filter);
  }

  async findOne(
    filter: FilterDto<Subscription> = {},
    req: Request & { user: UserProfile },
  ) {
    filter.where = this.accessInterceptor(req, filter.where);
    return super.findOne(filter);
  }

  updateAll(
    updateDto,
    where: FilterQuery<Subscription> | null,
    req: Request & { user: UserProfile },
  ) {
    where = this.accessInterceptor(req, where);
    return super.updateAll(updateDto, where, req);
  }

  async removeAll(
    where: FilterQuery<Subscription>,
    req?: Request & { user: UserProfile },
  ) {
    where = this.accessInterceptor(req, where);
    return super.removeAll(where);
  }
}
