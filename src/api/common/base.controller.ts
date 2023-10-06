import { Controller } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { ConfigurationsService } from '../configurations/configurations.service';

@Controller()
export class BaseController {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly configurationsService: ConfigurationsService,
  ) {}
}
