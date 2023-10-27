import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BouncesModule } from '../bounces/bounces.module';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    SubscriptionsModule,
    ConfigurationsModule,
    BouncesModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
