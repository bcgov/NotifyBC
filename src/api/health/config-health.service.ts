import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { ConfigurationsService } from '../configurations/configurations.service';

@Injectable()
export class ConfigHealthService extends HealthIndicator {
  constructor(readonly configurationsService: ConfigurationsService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const count = (await this.configurationsService.count()).count;

    const isHealthy = count >= 2 ? true : false;
    const result = this.getStatus(key, isHealthy, { count });

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('config item count error', result);
  }
}
