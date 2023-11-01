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

// file ported
import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {MiddlewareContext, Request, RestBindings} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {ConfigurationRepository} from '../repositories';

export class IpWhitelistAuthenticationStrategy
  implements AuthenticationStrategy
{
  name = 'ipWhitelist';
  constructor(
    @inject('repositories.ConfigurationRepository')
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
    protected httpContext: MiddlewareContext,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let userProfile: UserProfile | undefined;
    if (
      await this.configurationRepository.isAdminReq(
        this.httpContext,
        true,
        true,
      )
    ) {
      userProfile = {
        [securityId]: request.ip,
        authnStrategy: this.name,
      };
    }
    return userProfile;
  }
}
