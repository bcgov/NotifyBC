import { Injectable, NestMiddleware } from '@nestjs/common';
import ipRangeCheck from 'ip-range-check';
import { AppConfigService } from 'src/config/app-config.service';
import { AuthnStrategy, Role } from './constants';

@Injectable()
export class IpAuthnStrategyMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(req: any, res: any, next: () => void) {
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
    if (!req.user) {
      req.user = {
        securityId: req.ip,
        authnStrategy: AuthnStrategy.Ip,
      };
    }
    next();
  }
}
