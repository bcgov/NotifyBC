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
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts.`,
      );
    const token = parts[1];

    return token;
  }
}
