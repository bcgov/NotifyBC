import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from './constants';
import get from 'lodash-es/get';

@Injectable()
export class AppConfigService {
  constructor(@Inject(ConfigType.AppConfig) private readonly config) {}

  get(propName?: string, defaultVal?: any) {
    if (!propName) return this.config;
    return get(this.config, propName, defaultVal);
  }
}
