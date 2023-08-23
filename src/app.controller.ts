import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {AppConfigService} from './config/app-config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log(this.appConfigService.get('cron.purgeData'));
    return this.appService.getHello();
  }
}
