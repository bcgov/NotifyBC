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

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import cluster from 'cluster';
import express from 'express';
import https from 'https';
import os from 'os';
import path from 'path';
import { ErrorsInterceptor } from './api/common/errors.interceptor';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { AppConfigService } from './config/app-config.service';
import { MiddlewareAllService } from './observers/middleware-all.service';
import { ShutdownService } from './observers/shutdown.service';
const logger = new Logger(path.parse(__filename).name);

// setupApp is shared between bootstrap and e2e setupApplication
export async function setupApp(app: NestExpressApplication) {
  AppService.app = app;
  app.useGlobalInterceptors(new ErrorsInterceptor());

  const appConfig = app.get(AppConfigService).get();
  app.setGlobalPrefix(appConfig.restApiRoot);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  appConfig.trustedReverseProxyIps &&
    app.set('trust proxy', appConfig.trustedReverseProxyIps);
  const middlewareAllService = app.get(MiddlewareAllService);
  // setupMiddlewareAll has to be called before app.init(),
  // otherwise middleware has no effect on routes
  await middlewareAllService.setupMiddlewareAll();
}

async function bootstrap() {
  const expressServer = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressServer),
  );
  await setupApp(app);
  await app.init();
  const appConfig = app.get(AppConfigService).get();
  app.useLogger(appConfig.loggingLevels);

  const port = appConfig.port ?? 3000;
  const host = appConfig.host ?? '0.0.0.0';
  const proto = appConfig.tls?.enabled ? 'https' : 'http';
  if (appConfig.tls?.enabled) {
    let opts = { ...appConfig.tls };
    if (appConfig.tls?.clientCertificateEnabled) {
      opts = { ...opts, requestCert: true, rejectUnauthorized: false };
    }
    await new Promise((resolve) => {
      const shutdownService = app.get(ShutdownService);
      shutdownService.addHttpServer(
        https.createServer(opts, expressServer).listen(port, host, () => {
          resolve(undefined);
        }),
      );
    });
  } else {
    await app.listen(port, host);
  }
  logger.log(
    `Server is running at ${proto}://${appConfig.host}:${appConfig.port}${appConfig.restApiRoot}`,
  );
}

if (require.main === module) {
  let numWorkers = parseInt(process.env.NOTIFYBC_WORKER_PROCESS_COUNT ?? '');
  if (isNaN(numWorkers)) {
    numWorkers = os.cpus().length;
  }
  if (numWorkers < 2) {
    bootstrap().catch((err) => {
      logger.error('Cannot start the application.', err);
      process.exit(1);
    });
    logger.log(`Worker ${process.pid} started`);
  } else {
    if (cluster.isPrimary) {
      logger.log(`# of worker processes = ${numWorkers}`);
      logger.log(`Primary ${process.pid} is running`);
      let primaryWorker: any;
      // Fork workers.
      for (let i = 0; i < numWorkers; i++) {
        if (i > 0) {
          cluster.fork({
            NOTIFYBC_NODE_ROLE: 'secondary',
          });
        } else {
          primaryWorker = cluster.fork({
            NOTIFYBC_NODE_ROLE: process.env.NOTIFYBC_NODE_ROLE ?? 'primary',
          });
        }
      }

      cluster.on('exit', (worker: { process: { pid: any } }) => {
        logger.log(`worker ${worker.process.pid} died`);
        if (worker === primaryWorker) {
          logger.log(`worker ${worker.process.pid} is the primary worker`);
          primaryWorker = cluster.fork({
            NOTIFYBC_NODE_ROLE: process.env.NOTIFYBC_NODE_ROLE ?? 'primary',
          });
        } else {
          cluster.fork({
            NOTIFYBC_NODE_ROLE: 'secondary',
          });
        }
      });
    } else {
      bootstrap().catch((err) => {
        logger.error('Cannot start the application.', err);
        process.exit(1);
      });
      logger.log(`Worker ${process.pid} started`);
    }
  }
}
