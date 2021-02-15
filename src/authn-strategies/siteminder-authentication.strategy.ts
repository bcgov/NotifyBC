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

import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {MiddlewareContext, Request, RestBindings} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {ConfigurationRepository} from '../repositories';

export class SiteMinderAuthenticationStrategy
  implements AuthenticationStrategy {
  name = 'siteMinder';
  constructor(
    @inject('repositories.ConfigurationRepository')
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
    protected httpContext: MiddlewareContext,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let userProfile: UserProfile | undefined;
    const currUser = await this.configurationRepository.getCurrentUser(
      this.httpContext,
      true,
    );
    if (currUser) {
      userProfile = {
        [securityId]: currUser,
        authnStrategy: this.name,
      };
    }
    return userProfile;
  }
}
