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
