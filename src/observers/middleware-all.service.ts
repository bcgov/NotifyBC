// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AppConfigService } from 'src/config/app-config.service';
import { MiddlewareConfigService } from 'src/config/middleware-config.service';

@Injectable()
export class MiddlewareAllService {
  readonly middlewareConfigs;
  readonly appConfig;
  constructor(
    private readonly middlewareConfigService: MiddlewareConfigService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.middlewareConfigs = middlewareConfigService.get();
    this.appConfig = appConfigService.get();
  }
  async setupMiddlewareAll() {
    const allMiddlewareConfigs = this.middlewareConfigs.all;
    for (const middlewareFactoryNm in allMiddlewareConfigs) {
      if (allMiddlewareConfigs[middlewareFactoryNm].enabled === false) continue;
      const { default: middlewareFactory } = await import(middlewareFactoryNm);
      AppService.app.use(
        middlewareFactory.apply(
          this,
          allMiddlewareConfigs[middlewareFactoryNm].params,
        ),
      );
    }
  }
}
