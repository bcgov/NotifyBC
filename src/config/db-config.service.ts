import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from './constants';
import {get} from 'lodash';

@Injectable()
export class DbConfigService {
  constructor(@Inject(ConfigType.DbConfig) private readonly config) {}

  get(propName?: string, defaultVal?: any) {
    if (!propName) return this.config;
    return get(this.config, propName, defaultVal);
  }
}
