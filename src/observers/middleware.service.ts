import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { MiddlewareConfigService } from 'src/config/middleware-config.service';

@Injectable()
export class MiddlewareService implements OnModuleInit {
  readonly middlewareConfigs;
  constructor(
    private readonly middlewareConfigService: MiddlewareConfigService,
  ) {
    this.middlewareConfigs = middlewareConfigService.get();
  }
  onModuleInit() {
    // Middleware migrated from LoopBack 3
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
