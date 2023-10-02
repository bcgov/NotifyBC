import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import ipRangeCheck from 'ip-range-check';
import { AppConfigService } from 'src/config/app-config.service';
import { AuthnStrategy, Role } from './constants';
import { UserProfile } from './dto/user-profile.dto';
@Injectable()
export class SiteminderAuthnStrategyMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(req: Request & { user: UserProfile }, res: any, next: () => void) {
    if (req.user) return next();
    const currUser =
      req.get('SM_UNIVERSALID') ||
      req.get('sm_user') ||
      req.get('smgov_userdisplayname');
    if (!currUser) {
      return next();
    }
    const siteMinderReverseProxyIps = this.appConfigService.get(
      'siteMinderReverseProxyIps',
    );
    if (!siteMinderReverseProxyIps || siteMinderReverseProxyIps.length <= 0) {
      return next();
    }
    // rely on express 'trust proxy' settings to obtain real ip
    const realIp = req.ip;
    const isFromSM = siteMinderReverseProxyIps.some(function (e: string) {
      return ipRangeCheck(realIp, e);
    });
    if (isFromSM) {
      req.user = {
        securityId: currUser,
        authnStrategy: AuthnStrategy.SiteMinder,
        role: Role.AuthenticatedUser,
      };
    }
    return next();
  }
}
