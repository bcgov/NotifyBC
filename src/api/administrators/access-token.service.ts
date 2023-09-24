import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import cryptoRandomString from 'crypto-random-string';
import { Request } from 'express';
import { AnyObject, Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { AdministratorsService } from './administrators.service';
import { AdminUserProfile } from './constants';
import { AccessToken } from './entities/access-token.entity';
import { Administrator } from './entities/administrator.entity';
@Injectable()
export class AccessTokenService extends BaseService<AccessToken> {
  constructor(
    @InjectModel(AccessToken.name)
    model: Model<AccessToken>,
    @InjectModel(Administrator.name)
    private readonly administratorModel: Model<Administrator>,
    private readonly administratorsService: AdministratorsService,
  ) {
    super(model);
  }

  async verifyToken(token: string): Promise<AdminUserProfile> {
    if (!token) {
      throw new HttpException(
        `Error verifying token : 'token' is null`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    let userProfile: AdminUserProfile;

    try {
      const accessToken = await this.model.findById(token);
      if (
        accessToken.ttl !== undefined &&
        accessToken.created.valueOf() + 1000 * accessToken.ttl < Date.now()
      ) {
        throw new Error('token expired');
      }
      const user = await this.administratorModel.findById(accessToken.userId);
      userProfile = this.administratorsService.convertToUserProfile(user);
    } catch (error) {
      throw new HttpException(
        `Error verifying token : ${error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return userProfile;
  }

  async generateToken(
    userProfile: AdminUserProfile,
    req: (Request & { user?: any }) | null,
    options?: AnyObject,
  ) {
    if (!userProfile) {
      throw new HttpException(
        'Error generating token : userProfile is null',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const opts = options ?? {};
      const _id = cryptoRandomString({ length: 64, type: 'alphanumeric' });
      return this.create({ ...opts, userId: userProfile.securityId, _id }, req);
    } catch (error) {
      throw new HttpException(
        `Error encoding token : ${error}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
