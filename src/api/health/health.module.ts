import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from 'src/config/config.module';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { ConfigHealthService } from './config-health.service';
import { HealthController } from './health.controller';
import { RedisHealthService } from './redis-health.service';

@Module({
  imports: [TerminusModule, ConfigurationsModule, ConfigModule],
  controllers: [HealthController],
  providers: [ConfigHealthService, RedisHealthService],
})
export class HealthModule {}
