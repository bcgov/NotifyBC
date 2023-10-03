import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionsQueryTransformPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private request: Request & { user: UserProfile },
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if ([Role.SuperAdmin, Role.Admin].includes(this.request.user.role))
      return value;
    value = value ?? {};
    let whereClause = metadata.data === 'where' ? value : value?.where;
    whereClause = {
      $and: [
        whereClause,
        { userId: this.request.user.securityId },
        {
          state: {
            $ne: 'deleted',
          },
        },
      ],
    };
    switch (metadata.data) {
      case 'where':
        value = whereClause;
        break;
      default:
        value.where = whereClause;
    }
    return value;
  }
}
