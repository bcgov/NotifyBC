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

import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { configFactory } from './config.factory';
import { ConfigType } from './constants';
import { DbConfigService } from './db-config.service';
import { MiddlewareConfigService } from './middleware-config.service';
import { OidcDiscoveryService } from './oidc-discovery.service';

@Global()
@Module({
  providers: [
    configFactory(ConfigType.AppConfig),
    configFactory(ConfigType.MiddlewareConfig),
    configFactory(ConfigType.DbConfig),
    AppConfigService,
    MiddlewareConfigService,
    DbConfigService,
    OidcDiscoveryService,
  ],
  exports: [
    AppConfigService,
    MiddlewareConfigService,
    DbConfigService,
    OidcDiscoveryService,
  ],
})
export class ConfigModule {}
