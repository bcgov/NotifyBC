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

// file ported
import {
  ApplicationConfig,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g10')
export class OidcDiscoveryObserver implements LifeCycleObserver {
  static authorizationUrl: string;
  static certs: AnyObject;
  private retryCount = 0;
  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG)
    private appConfig: ApplicationConfig,
  ) {}

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    if (!this.appConfig.oidc?.discoveryUrl) {
      return;
    }
    try {
      let res = await (await fetch(this.appConfig.oidc?.discoveryUrl)).json();
      if (!res) {
        throw new Error('no discovery data');
      }
      OidcDiscoveryObserver.authorizationUrl = res.authorization_endpoint;
      res = await (await fetch(res.jwks_uri)).json();
      if (!res) {
        throw new Error('no cert data');
      }
      OidcDiscoveryObserver.certs = res;
    } catch (ex) {
      console.error(new Error(ex));
      this.retryCount++;
      if (this.retryCount > 10) return;
      console.error('retry in one minute');
      setTimeout(() => {
        // eslint-disable-next-line no-void
        void this.start();
      }, 60000);
    }
  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
