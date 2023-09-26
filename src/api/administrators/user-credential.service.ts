import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { UserCredential } from './entities/user-credential.entity';

@Injectable()
export class UserCredentialService extends BaseService<UserCredential> {
  constructor(
    @InjectModel(UserCredential.name)
    model: Model<UserCredential>,
  ) {
    super(model);
  }
}
