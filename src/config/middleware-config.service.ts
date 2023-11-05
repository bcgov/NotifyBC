import { Inject, Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { ConfigType } from './constants';

@Injectable()
export class MiddlewareConfigService {
  constructor(@Inject(ConfigType.MiddlewareConfig) private readonly config) {}

  get(propName?: string, defaultVal?: any) {
    if (!propName) return this.config;
    return get(this.config, propName, defaultVal);
  }
}
