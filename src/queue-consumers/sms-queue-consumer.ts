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
import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Job } from 'bullmq';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
@Processor('s')
export class SmsQueueConsumer
  extends WorkerHost
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  readonly logger = new Logger(SmsQueueConsumer.name);
  constructor(readonly appConfigService: AppConfigService) {
    super();
  }

  onApplicationBootstrap() {
    this.worker.opts.limiter = (({ duration, max }) => ({ duration, max }))(
      this.appConfigService.get('sms.throttle'),
    );
  }

  async beforeApplicationShutdown() {
    await this.worker.close();
  }

  async process(job: Job<any, any, string>) {
    this.logger.debug(job?.id);
  }
}
