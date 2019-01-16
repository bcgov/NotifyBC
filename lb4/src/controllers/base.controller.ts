import { inject } from '@loopback/context'
import * as _ from 'lodash'
import { ApplicationConfig, CoreBindings } from '@loopback/core'

export class BaseController {
  constructor() {
  }

  @inject(CoreBindings.APPLICATION_CONFIG)
  private appConfig: ApplicationConfig
}
