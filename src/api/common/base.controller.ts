import { Controller } from '@nestjs/common';
import { merge } from 'lodash';
import { AppConfigService } from 'src/config/app-config.service';
import { ConfigurationsService } from '../configurations/configurations.service';
import { Configuration } from '../configurations/entities/configuration.entity';

@Controller()
export class BaseController {
  constructor(
    readonly appConfigService: AppConfigService,
    readonly configurationsService: ConfigurationsService,
  ) {}

  async getMergedConfig(
    configName: string,
    serviceName: string,
    next?: Function,
  ) {
    let data;
    try {
      data = await this.configurationsService.findOne({
        where: {
          name: configName,
          serviceName: serviceName,
        },
      });
    } catch (ex) {
      if (next) {
        return next(ex, null);
      } else {
        throw ex;
      }
    }
    let res;
    try {
      res = merge({}, this.appConfigService.get(configName));
    } catch (ex) {}
    try {
      res = merge({}, res, (data as Configuration).value);
    } catch (ex) {}
    next?.(null, res);
    return res;
  }
}
