import { Module } from '@nestjs/common';
import { BouncesModule } from 'src/api/bounces/bounces.module';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { SubscriptionsModule } from 'src/api/subscriptions/subscriptions.module';
import { EmailQueueConsumer } from './email-queue-consumer';
import { NotificationQueueConsumer } from './notification-queue-consumer';
import { SmsQueueConsumer } from './sms-queue-consumer';

@Module({
  imports: [NotificationsModule, SubscriptionsModule, BouncesModule],
  providers: [EmailQueueConsumer, SmsQueueConsumer, NotificationQueueConsumer],
})
export class QueueConsumersModule {}
