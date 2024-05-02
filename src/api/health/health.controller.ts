import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { AppConfigService } from 'src/config/app-config.service';
import { ConfigHealthService } from './config-health.service';
import { RedisHealthService } from './redis-health.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private configHealthService: ConfigHealthService,
    private appConfigService: AppConfigService,
    private redisHealthService: RedisHealthService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const checks = [
      () => this.mongoose.pingCheck('MongoDB'),
      () => this.configHealthService.isHealthy('config'),
    ];
    if (
      this.appConfigService.get('email.throttle.datastore') == 'ioredis' ||
      this.appConfigService.get('sms.throttle.datastore') == 'ioredis'
    ) {
      checks.push(() => this.redisHealthService.isHealthy('redis'));
    }
    return this.health.check(checks);
  }
}
