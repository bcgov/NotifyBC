import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
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
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
