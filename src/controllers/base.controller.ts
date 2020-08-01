import {inject} from '@loopback/context';
import {ApplicationConfig, CoreBindings} from '@loopback/core';

export class BaseController {
  constructor() {}

  @inject(CoreBindings.APPLICATION_CONFIG)
  private appConfig: ApplicationConfig;
}
