import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from './constants';
import {get} from 'lodash';

@Injectable()
export class MiddlewareConfigService {
  constructor(@Inject(ConfigType.AppConfig) private readonly config) {}

  get(propName?: string, defaultVal?: any) {
    if (!propName) return this.config;
    return get(this.config, propName, defaultVal);
  }
}
