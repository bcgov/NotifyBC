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
  implements AuthenticationStrategy
{
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
