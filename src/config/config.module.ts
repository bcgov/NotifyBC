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
