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
import { AccessTokenService } from 'src/api/administrators/access-token.service';
import { AdminUserProfile } from 'src/api/administrators/constants';
import { AuthnStrategy, Role } from './constants';
import { UserProfile } from './dto/user-profile.dto';

@Injectable()
export class AccessTokenAuthnStrategyMiddleware implements NestMiddleware {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  use(req: Request & { user: UserProfile }, res: any, next: () => void) {
    if (req.user) return next();
    const token: string = this.extractCredentials(req);
    this.accessTokenService.verifyToken(token).then(
      (userProfile: AdminUserProfile) => {
        req.user = {
          securityId: userProfile.securityId,
          role: Role.Admin,
          authnStrategy: AuthnStrategy.AccessToken,
        };
        return next();
      },
      () => {
        next();
      },
    );
  }

  extractCredentials(request: Request): string | undefined {
    // from Authorization header
    const token = request.headers.authorization;
    if (token) {
      return token;
    }
    // from access_token query parameter
    return request?.query?.access_token as string | undefined;
  }
}
