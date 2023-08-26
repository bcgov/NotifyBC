import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigurationsModule } from './api/configurations/configurations.module';
import { NotificationsModule } from './api/notifications/notifications.module';
import { SubscriptionsModule } from './api/subscriptions/subscriptions.module';

@Module({
  imports: [ConfigModule, ConfigurationsModule, NotificationsModule, SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
