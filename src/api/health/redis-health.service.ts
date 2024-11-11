import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class RedisHealthService extends HealthIndicator {
  constructor(private appConfigService: AppConfigService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const redis = new Redis(this.appConfigService.get('queue.connection'));
      const msg = 'hello';
      if ((await redis.ping(msg)) === msg) {
        return this.getStatus(key, true);
      }
      throw new Error();
    } catch (ex) {
      throw new HealthCheckError('redis error', this.getStatus(key, false));
    }
  }
}
