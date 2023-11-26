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

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdministratorsModule } from 'src/api/administrators/administrators.module';
import { ObserversModule } from 'src/observers/observers.module';
import { AccessTokenAuthnStrategyMiddleware } from './access-token-authn-strategy.middleware';
import { ClientCertificateAuthnStrategyMiddleware } from './client-certificate-authn-strategy.middleware';
import { IpAuthnStrategyMiddleware } from './ip-authn-strategy.middleware';
import { OidcAuthnStrategyMiddleware } from './oidc-authn-strategy.middleware';
import { RolesGuard } from './roles.guard';
import { SiteminderAuthnStrategyMiddleware } from './siteminder-authn-strategy.middleware';

@Module({
  imports: [AdministratorsModule, ObserversModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ClientCertificateAuthnStrategyMiddleware,
        AccessTokenAuthnStrategyMiddleware,
        OidcAuthnStrategyMiddleware,
        SiteminderAuthnStrategyMiddleware,
        IpAuthnStrategyMiddleware,
      )
      .forRoutes('*');
  }
}
