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
      await Promise.all(
        ['sms', 'email'].map(async (channel) => {
          {
            if (
              this.appConfigService.get(channel + '.throttle.datastore') !==
              'ioredis'
            ) {
              return;
            }
            const redis = new Redis(
              this.appConfigService.get(channel + '.throttle.clientOptions'),
            );
            const msg = 'hello';
            if ((await redis.ping(msg)) === msg) {
              return;
            }
            throw new Error();
          }
        }),
      );
      return this.getStatus(key, true);
    } catch (ex) {
      throw new HealthCheckError('redis error', this.getStatus(key, false));
    }
  }
}
