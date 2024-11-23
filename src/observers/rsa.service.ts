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

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import crypto from 'crypto';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { promisify } from 'util';

@Injectable()
export class RsaService implements OnApplicationBootstrap {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  /**
   * This method will be invoked when the application starts
   */
  async onApplicationBootstrap(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const data = await this.configurationsService.findOne({
      where: {
        name: 'rsa',
      },
    });
    if (data) return;

    if (process.env.NOTIFYBC_NODE_ROLE === 'secondary') {
      await promisify(setTimeout)(5000);
      await this.onApplicationBootstrap();
      return;
    }
    // only the node with cron enabled, which is supposed to be a singleton,
    // can generate RSA key pair by executing code below
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    await this.configurationsService.create(
      {
        name: 'rsa',
        value: {
          private: privateKey,
          public: publicKey,
        },
      },
      undefined,
    );
    return;
  }
}
