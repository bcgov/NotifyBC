import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { AppConfigService } from 'src/config/app-config.service';
import { ConfigHealthService } from './config-health.service';
import { RedisHealthService } from './redis-health.service';

@Controller('health')
@ApiTags('health')
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
  @ApiOperation({
    summary: 'get health status',
  })
  check() {
    const checks = [
      () => this.mongoose.pingCheck('MongoDB'),
      () => this.configHealthService.isHealthy('config'),
      () => this.redisHealthService.isHealthy('redis'),
    ];
    return this.health.check(checks);
  }
}
