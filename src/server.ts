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

import {once} from 'events';
import express from 'express';
import http from 'http';
import {ApplicationConfig, NotifyBcApplication} from './application';
import webAdminConsole from './web-admin-console';

export {ApplicationConfig};

export class ExpressServer {
  public readonly app: express.Application;
  public readonly lbApp: NotifyBcApplication;
  private server?: http.Server;
  public url: String;

  constructor(options: ApplicationConfig = {}) {
    this.app = express();
    this.lbApp = new NotifyBcApplication(options);

    // Middleware migrated from LoopBack 3
    const allMiddlewareConfigs = this.lbApp.middlewareConfigs.all;
    for (const middlewareFactoryNm in allMiddlewareConfigs) {
      if (allMiddlewareConfigs[middlewareFactoryNm].enabled === false) continue;
      const middlewareFactory: Function = require(middlewareFactoryNm);
      this.app.use(
        middlewareFactory.apply(
          this,
          allMiddlewareConfigs[middlewareFactoryNm].params,
        ),
      );
    }

    // Mount the LB4 REST API
    this.app.use(this.lbApp.options.restApiRoot, this.lbApp.requestHandler);

    this.lbApp.options.trustedReverseProxyIps &&
      this.app.set('trust proxy', this.lbApp.options.trustedReverseProxyIps);

    // Custom Express routes
    webAdminConsole(this);
  }

  public async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port ?? 3000;
    const host = this.lbApp.restServer.config.host ?? '0.0.0.0';
    if (this.lbApp.options.tls?.key && this.lbApp.options.tls?.cert) {
      const https = require('https');
      let opts = Object.assign({}, this.lbApp.options.tls);
      if (this.lbApp.options.tls?.ca) {
        opts = Object.assign(opts, {
          requestCert: true,
          rejectUnauthorized: false,
        });
      }
      this.app.listen = function (...args: []) {
        const server = https.createServer(opts, this);
        return server.listen(...args);
      };
    }
    this.server = this.app.listen(port, host);
    await once(this.server, 'listening');
    this.url = `http://${host}:${port}`;
  }

  // For testing purposes
  public async stop() {
    if (!this.server) return;
    await this.lbApp.stop();
    this.server.close();
    await once(this.server, 'close');
    this.server = undefined;
  }
}
