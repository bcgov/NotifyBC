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

interface SmtpServer {
  listen(port: number): void;
  close(callback?: Function): void;
}

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g6')
export class SmtpServerObserver implements LifeCycleObserver {
  smtpServer: SmtpServer;
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const appConfig = await this.app.get<any>(CoreBindings.APPLICATION_CONFIG);
    const smtpSvr = appConfig.email.inboundSmtpServer;
    if (!smtpSvr.enabled) {
      return;
    }
    // get a handle of server in order to be able to stop
    this.smtpServer = await require('./smtp-server').app(appConfig);
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    return new Promise(resolve => {
      if (!this.smtpServer) {
        return resolve();
      }
      this.smtpServer.close(() => resolve());
    });
  }
}
