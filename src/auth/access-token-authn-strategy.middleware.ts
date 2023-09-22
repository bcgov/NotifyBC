import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenService } from 'src/api/administrators/access-token.service';
import { AdminUserProfile } from 'src/api/administrators/constants';
import { AuthnStrategy, Role } from './constants';

@Injectable()
export class AccessTokenAuthnStrategyMiddleware implements NestMiddleware {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  use(req: any, res: any, next: () => void) {
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
      (err) => {
        next();
      },
    );
  }

  extractCredentials(request: Request): string | undefined {
    // from Authorization header
    let token = request.headers.authorization;
    if (token) {
      return token;
    }
    // from access_token query parameter
    return request?.query?.access_token as string | undefined;
  }
}
