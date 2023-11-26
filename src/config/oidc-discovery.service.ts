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

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AnyObject } from 'mongoose';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class OidcDiscoveryService implements OnModuleInit {
  authorizationUrl: string;
  static certs: AnyObject;
  private retryCount = 0;
  readonly appConfig;
  private readonly logger = new Logger(OidcDiscoveryService.name);
  constructor(private readonly appConfigService: AppConfigService) {
    this.appConfig = appConfigService.get();
  }
  async onModuleInit() {
    if (!this.appConfig.oidc?.discoveryUrl) {
      return;
    }
    try {
      let res = await (await fetch(this.appConfig.oidc?.discoveryUrl)).json();
      if (!res) {
        throw new Error('no discovery data');
      }
      this.authorizationUrl = res.authorization_endpoint;
      res = await (await fetch(res.jwks_uri)).json();
      if (!res) {
        throw new Error('no cert data');
      }
      OidcDiscoveryService.certs = res;
    } catch (ex) {
      this.logger.error(new Error(ex));
      this.retryCount++;
      if (this.retryCount > 10) return;
      this.logger.verbose('retry in one minute');
      setTimeout(() => {
        // eslint-disable-next-line no-void
        void this.onModuleInit();
      }, 60000);
    }
  }
}
