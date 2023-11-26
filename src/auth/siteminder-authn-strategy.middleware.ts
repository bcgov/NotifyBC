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
