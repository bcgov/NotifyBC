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
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import semver from 'semver';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';

@Injectable()
export class IndexDBSchemaService implements OnApplicationBootstrap {
  constructor(
    private readonly configurationsService: ConfigurationsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async onApplicationBootstrap(): Promise<void> {
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pJson = require('../../package.json');
    const targetVersion = pJson.dbSchemaVersion;
    let data = await this.configurationsService.findOne({
      where: { name: 'dbSchemaVersion' },
    });
    if (!data) {
      data = await this.configurationsService.create({
        name: 'dbSchemaVersion',
        value: '0.0.0',
      });
    }
    const currentVersion = data.value;
    if (
      semver.major(targetVersion) === semver.major(currentVersion) &&
      semver.minor(targetVersion) > semver.minor(currentVersion)
    ) {
      await this.connection.syncIndexes();
      data.value = targetVersion;
      await this.configurationsService.updateById(data.id, data);
      return;
    } else {
      return;
    }
  }
}
