import { Global, Module } from '@nestjs/common';
import { configFactory } from './config.factory';
import { ConfigType } from './constants';

@Global()
@Module({
  providers: [
    configFactory(ConfigType.AppConfig),
    configFactory(ConfigType.MiddlewareConfig),
    configFactory(ConfigType.DbConfig),
  ],
})
export class ConfigModule {}
