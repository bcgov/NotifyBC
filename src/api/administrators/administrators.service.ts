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
