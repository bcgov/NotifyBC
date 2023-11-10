import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AdministratorsModule } from './api/administrators/administrators.module';
import { BouncesModule } from './api/bounces/bounces.module';
import { BaseController } from './api/common/base.controller';
import { ConfigurationsModule } from './api/configurations/configurations.module';
import { NotificationsModule } from './api/notifications/notifications.module';
import { SubscriptionsModule } from './api/subscriptions/subscriptions.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigService } from './config/app-config.service';
import { ConfigModule } from './config/config.module';
import { DbConfigService } from './config/db-config.service';
import { MiddlewareConfigService } from './config/middleware-config.service';
import { ObserversModule } from './observers/observers.module';
import { ShutdownService } from './observers/shutdown.service';
import { SwaggerService } from './observers/swagger.service';
import { RssModule } from './rss/rss.module';

@Module({
  imports: [
    ConfigModule,
    AdministratorsModule,
    BouncesModule,
    ConfigurationsModule,
    NotificationsModule,
    SubscriptionsModule,
    ObserversModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule, ObserversModule],
      inject: [DbConfigService, ShutdownService],
      useFactory: async (
        dbConfigService: DbConfigService,
        shutdownService: ShutdownService,
      ) => {
        const dbConfig = dbConfigService.get();
        if (dbConfig.uri) return { ...dbConfig, autoIndex: false };
        const mongod = await MongoMemoryServer.create({
          instance: dbConfig,
        });
        const uri = mongod.getUri();
        shutdownService.addMongoDBServer(mongod);
        Logger.log(`mongodb-memory-server started at ${uri}`, AppModule.name);
        return {
          uri,
        };
      },
    }),
    AuthModule,
    RssModule,
  ],
  controllers: [BaseController],
  providers: [SwaggerService, AppService],
})
export class AppModule {
  readonly middlewareConfigs;
  readonly appConfig;
  constructor(
    private readonly middlewareConfigService: MiddlewareConfigService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.middlewareConfigs = middlewareConfigService.get();
    this.appConfig = appConfigService.get();
  }

  configure(consumer: MiddlewareConsumer) {
    const apiOnlyMiddlewareConfigs = this.middlewareConfigs.apiOnly;
    const apiOnlyMiddlewares = [];
    for (const middlewareFactoryNm in apiOnlyMiddlewareConfigs) {
      if (apiOnlyMiddlewareConfigs[middlewareFactoryNm].enabled === false)
        continue;
      apiOnlyMiddlewares.push(
        require(middlewareFactoryNm).apply(
          this,
          apiOnlyMiddlewareConfigs[middlewareFactoryNm].params,
        ),
      );
    }
    consumer.apply(...apiOnlyMiddlewares).forRoutes('*');
  }
}
