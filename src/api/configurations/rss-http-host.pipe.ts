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

import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable({ scope: Scope.REQUEST })
export class RssHttpHostPipe implements PipeTransform {
  readonly appConfig;
  constructor(
    @Inject(REQUEST) private request: Request,
    readonly appConfigService: AppConfigService,
  ) {
    this.appConfig = appConfigService.get();
  }

  transform(value: any) {
    if (
      value.name === 'notification' &&
      value.value &&
      value.value.rss &&
      !value.value.httpHost &&
      !this.appConfig.httpHost
    ) {
      value.value.httpHost =
        this.request.protocol + '://' + this.request.get('host');
    }
    return value;
  }
}
