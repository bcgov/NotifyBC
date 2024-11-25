import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { BouncesModule } from 'src/api/bounces/bounces.module';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { ConfigurationsModule } from '../api/configurations/configurations.module';
import { ConfigModule } from '../config/config.module';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    ConfigurationsModule,
    BullModule.registerQueue(
      { name: 's' /* sms */ },
      { name: 'e' /* email */ },
      { name: 'n' /* notification */ },
    ),
    BouncesModule,
    NotificationsModule,
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
