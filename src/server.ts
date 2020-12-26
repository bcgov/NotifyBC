// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/example-express-composition
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {once} from 'events';
import express from 'express';
import http from 'http';
import {ApplicationConfig, NotifyBcApplication} from './application';
import webAdminConsole from './web-admin-console';
const loopback = require('loopback');
const compression = require('compression');
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const morgan = require('morgan');

export {ApplicationConfig};

export class ExpressServer {
  public readonly app: express.Application;
  public readonly lbApp: NotifyBcApplication;
  private server?: http.Server;
  public url: String;

  constructor(options: ApplicationConfig = {}) {
    this.app = express();

    // Middleware migrated from LoopBack 3
    this.app.use(loopback.favicon('favicon.ico'));
    this.app.use(compression());
    this.app.use(
      helmet({
        hsts: {
          maxAge: 0,
          includeSubDomains: true,
        },
      }),
    );

    // this.app.use(
    //   morgan(
    //     ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status ":req[X-Forwarded-For]"',
    //   ),
    // );

    // Mount the LB4 REST API
    this.lbApp = new NotifyBcApplication(options);
    this.app.use(options.restApiRoot, this.lbApp.requestHandler);

    // Custom Express routes
    webAdminConsole(this);
  }

  public async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port ?? 3000;
    const host = this.lbApp.restServer.config.host ?? '127.0.0.1';
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
