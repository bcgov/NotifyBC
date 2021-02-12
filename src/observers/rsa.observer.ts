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
import {ConfigurationRepository} from '../repositories';
const NodeRSA = require('node-rsa');

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g4')
export class RsaObserver implements LifeCycleObserver {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const configurationRepository: ConfigurationRepository = await this.app.get<ConfigurationRepository>(
      'repositories.ConfigurationRepository',
    );
    const data = await configurationRepository.findOne({
      where: {
        name: 'rsa',
      },
    });
    const key = new NodeRSA();
    if (data) {
      key.importKey(data.value.private, 'private');
      key.importKey(data.value.public, 'public');
      module.exports.key = key;
      return;
    }
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.start();
      return;
    }
    // only the node with cron enabled, which is supposed to be a singleton,
    // can generate RSA key pair by executing code below
    key.generateKeyPair();
    module.exports.key = key;
    await configurationRepository.create({
      name: 'rsa',
      value: {
        private: key.exportKey('private'),
        public: key.exportKey('public'),
      },
    });
    return;
  }
}
