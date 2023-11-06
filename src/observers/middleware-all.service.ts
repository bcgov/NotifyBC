import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AppConfigService } from 'src/config/app-config.service';
import { MiddlewareConfigService } from 'src/config/middleware-config.service';

@Injectable()
export class MiddlewareAllService implements OnModuleInit {
  readonly middlewareConfigs;
  readonly appConfig;
  constructor(
    private readonly middlewareConfigService: MiddlewareConfigService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.middlewareConfigs = middlewareConfigService.get();
    this.appConfig = appConfigService.get();
  }
  onModuleInit() {
    const allMiddlewareConfigs = this.middlewareConfigs.all;
    for (const middlewareFactoryNm in allMiddlewareConfigs) {
      if (allMiddlewareConfigs[middlewareFactoryNm].enabled === false) continue;
      const middlewareFactory: Function = require(middlewareFactoryNm);
      AppService.app.use(
        middlewareFactory.apply(
          this,
          allMiddlewareConfigs[middlewareFactoryNm].params,
        ),
      );
    }
  }
}
