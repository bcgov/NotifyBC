import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigurationsModule } from './api/configurations/configurations.module';
import { NotificationsModule } from './api/notifications/notifications.module';
import { SubscriptionsModule } from './api/subscriptions/subscriptions.module';
import { AdministratorsModule } from './api/administrators/administrators.module';
import { BouncesModule } from './api/bounces/bounces.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfigService } from './config/db-config.service';

@Module({
  imports: [
    ConfigModule,
    ConfigurationsModule,
    NotificationsModule,
    SubscriptionsModule,
    AdministratorsModule,
    BouncesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (dbConfigService: DbConfigService) =>
        dbConfigService.get(),
      inject: [DbConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
