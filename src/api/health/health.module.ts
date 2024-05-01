import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { ConfigHealthService } from './config-health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, ConfigurationsModule],
  controllers: [HealthController],
  providers: [ConfigHealthService],
})
export class HealthModule {}
