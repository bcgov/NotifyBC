import { DynamicModule, Module } from '@nestjs/common';
import { BouncesModule } from 'src/api/bounces/bounces.module';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { SubscriptionsModule } from 'src/api/subscriptions/subscriptions.module';
import { EmailQueueConsumer } from './email-queue-consumer';
import { NotificationQueueConsumer } from './notification-queue-consumer';
import { SmsQueueConsumer } from './sms-queue-consumer';

@Module({})
export class QueueConsumersModule {
  static register(): DynamicModule {
    const providers = [];
    const imports = [];
    if (process.env.NOTIFYBC_NODE_ROLE !== 'primary') {
      imports.push(NotificationsModule);
      imports.push(SubscriptionsModule);
      imports.push(BouncesModule);
      providers.push(EmailQueueConsumer);
      providers.push(SmsQueueConsumer);
      providers.push(NotificationQueueConsumer);
    }
    return {
      module: QueueConsumersModule,
      imports,
      providers,
    };
  }
}
