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

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Job, RateLimiterOptions } from 'bullmq';
import { AppConfigService } from 'src/config/app-config.service';
import { promisify } from 'util';

const wait = promisify(setTimeout);

@Injectable()
@Processor('s')
export class SmsQueueConsumer
  extends WorkerHost
  implements OnApplicationBootstrap
{
  readonly logger = new Logger(SmsQueueConsumer.name);
  readonly limiterConfig: RateLimiterOptions;
  constructor(appConfigService: AppConfigService) {
    super();
    this.limiterConfig = (({ duration, max }) => ({ duration, max }))(
      appConfigService.get('sms.throttle'),
    );
  }

  onApplicationBootstrap() {
    this.worker.opts.limiter = this.limiterConfig;
  }

  async process(job: Job<any, any, string>) {
    await wait(5);
    this.logger.debug(job?.id);
  }
}
