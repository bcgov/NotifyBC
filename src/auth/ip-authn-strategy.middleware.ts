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
