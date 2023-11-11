import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import ipRangeCheck from 'ip-range-check';
import { AppConfigService } from 'src/config/app-config.service';
import { AuthnStrategy, Role } from './constants';
import { UserProfile } from './dto/user-profile.dto';

@Injectable()
export class IpAuthnStrategyMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(req: Request & { user: UserProfile }, res: any, next: () => void) {
    const adminIps: [] =
      this.appConfigService.get('adminIps') ||
      this.appConfigService.get('defaultAdminIps');
    if (adminIps && adminIps.length > 0) {
      if (
        adminIps.some(function (e: string) {
          return ipRangeCheck(req.ip, e);
        })
      ) {
        req.user = {
          securityId: req.ip,
          authnStrategy: AuthnStrategy.Ip,
          role: Role.SuperAdmin,
        };
      }
    }
    if (!req.user || req.get('is_anonymous')) {
      req.user = {
        securityId: req.ip,
        authnStrategy: AuthnStrategy.Ip,
        role: Role.Anonymous,
      };
    }
    next();
  }
}
