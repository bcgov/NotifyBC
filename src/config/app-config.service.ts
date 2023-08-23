import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from './constants';
import * as _ from 'lodash';

@Injectable()
export class AppConfigService {
  constructor(@Inject(ConfigType.AppConfig) private readonly config) {}

  get(propName?: string, defaultVal?: any) {
    if (!propName) return this.config;
    return _.get(this.config, propName, defaultVal);
  }
}
