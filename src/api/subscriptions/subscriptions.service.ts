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
    if (req.user?.role !== Role.AuthenticatedUser) return where;
    return {
      $and: [where || {}, { userId: req.user.securityId }],
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
    req: Request & { user: UserProfile },
    filter: FilterDto<Subscription> = {},
  ) {
    filter.where = this.accessInterceptor(req, filter.where);
    return super.findAll(filter);
  }

  async findOne(
    req: Request & { user: UserProfile },
    filter: FilterDto<Subscription> = {},
  ): Promise<Subscription> {
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
    req: Request & { user: UserProfile },
    where?: FilterQuery<Subscription>,
  ) {
    where = this.accessInterceptor(req, where);
    return super.removeAll(where);
  }
}
