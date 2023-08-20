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

import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {NotifyBcApplication} from '../application';
import {ConfigurationRepository} from '../repositories';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g2')
export class AutoUpdateObserver implements LifeCycleObserver {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const pJson = require('../../package.json');
    const semver = require('semver');
    const targetVersion = pJson.dbSchemaVersion;
    let data = await this.configurationRepository.findOne({
      where: {name: 'dbSchemaVersion'},
    });
    if (!data) {
      data = await this.configurationRepository.create({
        name: 'dbSchemaVersion',
        value: '0.0.0',
      });
    }
    const currentVersion = data.value;
    if (
      semver.major(targetVersion) === semver.major(currentVersion) &&
      semver.minor(targetVersion) > semver.minor(currentVersion)
    ) {
      await (this.app as NotifyBcApplication).migrateSchema();
      data.value = targetVersion;
      await this.configurationRepository.update(data);
      return;
    } else {
      return;
    }
  }
}
