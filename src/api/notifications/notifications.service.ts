import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { BaseService } from '../common/base.service';
import { FilterDto } from '../common/dto/filter.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService extends BaseService<Notification> {
  constructor(
    @InjectModel(Notification.name)
    model: Model<Notification>,
  ) {
    super(model);
  }

  accessInterceptor(
    req: Request & { user: UserProfile },
    where: FilterQuery<Notification>,
  ): FilterQuery<Notification> {
    if (!req) return where;
    if ([Role.Admin, Role.SuperAdmin].includes(req.user?.role)) return where;
    if (req.user?.role !== Role.AuthenticatedUser)
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    return {
      $and: [
        where || {},
        { channel: 'inApp' },
        {
          $or: [
            { isBroadcast: true },
            {
              $or: [
                { userChannelId: req.user?.securityId },
                { userId: req.user?.securityId },
              ],
            },
          ],
        },
      ],
    };
  }

  findAll(
    req: Request & { user: UserProfile },
    filter: FilterDto<Notification> = {},
  ) {
    filter.where = this.accessInterceptor(req, filter.where);
    return super.findAll(filter);
  }

  async findOne(
    req: Request & { user: UserProfile },
    filter: FilterDto<Notification> = {},
  ): Promise<Notification> {
    filter.where = this.accessInterceptor(req, filter.where);
    return super.findOne(filter);
  }

  updateAll(
    updateDto,
    where: FilterQuery<Notification> | null,
    req: Request & { user: UserProfile },
  ) {
    where = this.accessInterceptor(req, where);
    return super.updateAll(updateDto, where, req);
  }

  async removeAll(
    req: Request & { user: UserProfile },
    where?: FilterQuery<Notification>,
  ) {
    where = this.accessInterceptor(req, where);
    return super.removeAll(where);
  }
}
