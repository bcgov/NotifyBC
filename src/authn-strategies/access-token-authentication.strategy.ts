import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  HttpErrors,
  MiddlewareContext,
  Request,
  RestBindings,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {AccessTokenService} from '../services/access-token.service';

export class AccessTokenAuthenticationStrategy
  implements AuthenticationStrategy {
  name = 'accessToken';
  constructor(
    @service(AccessTokenService)
    public tokenService: TokenService,
    @inject(RestBindings.Http.CONTEXT)
    protected httpContext: MiddlewareContext,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    try {
      const token: string = this.extractCredentials(request);
      const userProfile: UserProfile = await this.tokenService.verifyToken(
        token,
      );
      (this.httpContext as AnyObject).args = Object.assign(
        {},
        (this.httpContext as AnyObject).args,
        {
          options: {accessToken: userProfile},
        },
      );
      return Object.assign({}, userProfile, {authnStrategy: this.name});
    } catch (ex) {
      return undefined;
    }
  }

  extractCredentials(request: Request): string {
    // from Authorization header
    let token = request.headers.authorization;
    if (token) {
      return token;
    }
    // from access_token query parameter
    token = request.query?.access_token as string | undefined;
    if (!token) {
      throw new HttpErrors.Unauthorized(`Access token not found.`);
    }
    return token;
  }
}
