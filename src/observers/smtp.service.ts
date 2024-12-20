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

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { createTestAccount } from 'nodemailer';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { AppConfigService } from 'src/config/app-config.service';
import { promisify } from 'util';
import { smtpServer } from './smtp-server';

@Injectable()
export class SmtpService implements OnApplicationBootstrap {
  readonly appConfig;
  private readonly logger = new Logger(SmtpService.name);

  constructor(
    appConfigService: AppConfigService,
    private readonly configurationsService: ConfigurationsService,
  ) {
    this.appConfig = appConfigService.get();
  }

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const smtpSvr = this.appConfig.email.inboundSmtpServer;
    if (smtpSvr.enabled) {
      await smtpServer(this.appConfig);
    }
    if (this.appConfig?.email?.smtp?.host) {
      return;
    }
    const name = 'etherealAccount';
    const data = await this.configurationsService.findOne({
      where: {
        name,
      },
    });
    if (data) return;

    if (process.env.NOTIFYBC_NODE_ROLE === 'secondary') {
      await promisify(setTimeout)(5000);
      await this.onApplicationBootstrap();
      return;
    }

    // create ethereal.email account
    this.logger.log('obtaining ethereal email account...');
    const etherealAccount = await promisify(createTestAccount)();
    this.logger.log('ethereal email account created:');
    this.logger.log(etherealAccount);
    await this.configurationsService.create({
      name,
      value: etherealAccount,
    });
  }
}
