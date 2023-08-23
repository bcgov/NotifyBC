import { Global, Module } from '@nestjs/common';
import { configFactory } from './config.factory';
import { ConfigType } from './constants';
import { AppConfigService } from './app-config.service';
import { MiddlewareConfigService } from './middleware-config.service';
import { DbConfigService } from './db-config.service';

@Global()
@Module({
  providers: [
    configFactory(ConfigType.AppConfig),
    configFactory(ConfigType.MiddlewareConfig),
    configFactory(ConfigType.DbConfig),
    AppConfigService,
    MiddlewareConfigService,
    DbConfigService,
  ],
  exports: [AppConfigService, MiddlewareConfigService, DbConfigService],
})
export class ConfigModule {}
