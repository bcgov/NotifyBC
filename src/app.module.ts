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

import { BullModule } from '@nestjs/bullmq';
import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import RedisMemoryServer from 'redis-memory-server';
import { AdministratorsModule } from './api/administrators/administrators.module';
import { BouncesModule } from './api/bounces/bounces.module';
import { ConfigurationsModule } from './api/configurations/configurations.module';
import { HealthModule } from './api/health/health.module';
import { MemoryModule } from './api/memory/memory.module';
import { NotificationsModule } from './api/notifications/notifications.module';
import { SubscriptionsModule } from './api/subscriptions/subscriptions.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { AppConfigService } from './config/app-config.service';
import { ConfigModule } from './config/config.module';
import { DbConfigService } from './config/db-config.service';
import { MiddlewareConfigService } from './config/middleware-config.service';
import { ObserversModule } from './observers/observers.module';
import { ShutdownService } from './observers/shutdown.service';
import { SwaggerService } from './observers/swagger.service';
import { QueueModule } from './queue/queue.module';
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
        const mongod = await MongoMemoryReplSet.create({
          instanceOpts: [dbConfig],
        });
        const uri = mongod.getUri();
        shutdownService.addMongoDBServer(mongod);
        Logger.log(`mongodb-memory-server started at ${uri}`, AppModule.name);
        return {
          autoIndex: false,
          uri,
        };
      },
    }),
    AuthModule,
    RssModule,
    HealthModule,
    MemoryModule,
    BullModule.forRootAsync({
      imports: [ConfigModule, ObserversModule],
      inject: [AppConfigService, ShutdownService],
      useFactory: async (
        appConfigService: AppConfigService,
        shutdownService: ShutdownService,
      ) => {
        const bullOpts = {
          prefix: 'nb',
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
          },
        };
        const connection = appConfigService.get('queue.connection');
        if (connection) {
          return {
            ...bullOpts,
            connection,
          };
        }

        let host, port;
        switch (process.platform) {
          case 'win32':
            const { GenericContainer } = await import('testcontainers');
            const redisContainer = await new GenericContainer('redis')
              .withExposedPorts(6379)
              .start();
            host = redisContainer.getHost();
            port = redisContainer.getMappedPort(6379);
            shutdownService.addRedisServer(redisContainer);
            break;
          default:
            const redisServer = new RedisMemoryServer();
            host = await redisServer.getHost();
            port = await redisServer.getPort();
            shutdownService.addRedisServer(redisServer);
        }

        return {
          ...bullOpts,
          connection: {
            host,
            port,
          },
        };
      },
    }),
    CommonModule,
    QueueModule.register(),
  ],
  providers: [SwaggerService, AppService],
})
export class AppModule {
  readonly middlewareConfigs;
  readonly appConfig;
  constructor(
    middlewareConfigService: MiddlewareConfigService,
    appConfigService: AppConfigService,
  ) {
    this.middlewareConfigs = middlewareConfigService.get();
    this.appConfig = appConfigService.get();
  }

  async configure(consumer: MiddlewareConsumer) {
    const apiOnlyMiddlewareConfigs = this.middlewareConfigs.apiOnly;
    const apiOnlyMiddlewares = [];
    for (const middlewareFactoryNm in apiOnlyMiddlewareConfigs) {
      if (apiOnlyMiddlewareConfigs[middlewareFactoryNm].enabled === false)
        continue;
      const { default: m } = await import(middlewareFactoryNm);
      apiOnlyMiddlewares.push(
        m.apply(this, apiOnlyMiddlewareConfigs[middlewareFactoryNm].params),
      );
    }
    consumer.apply(...apiOnlyMiddlewares).forRoutes('*');
  }
}
