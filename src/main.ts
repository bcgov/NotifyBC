import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import https from 'https';
import path from 'path';
import { ErrorsInterceptor } from './api/common/errors.interceptor';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { ShutdownService } from './observers/shutdown.service';
import { SwaggerService } from './swagger.service';
import webAdminConsole from './web-admin-console';
const logger = new Logger(path.parse(__filename).name);

async function bootstrap() {
  const expressServer = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressServer),
  );
  SwaggerService.app = app;
  app.useGlobalInterceptors(new ErrorsInterceptor());

  const appConfig = app.get(AppConfigService).get();

  // app.setGlobalPrefix has to be called before SwaggerModule.setup
  // otherwise swagger doesn't honor GlobalPrefix
  app.setGlobalPrefix(appConfig.restApiRoot);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  appConfig.trustedReverseProxyIps &&
    app.set('trust proxy', appConfig.trustedReverseProxyIps);

  // Starts listening for shutdown hooks only in test env
  if (process.env.NODE_ENV === 'test') {
    app.enableShutdownHooks();
  }
  webAdminConsole(app, appConfig);
  await app.init();
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
  Logger.log(
    `Server is running at ${proto}://${appConfig.host}:${appConfig.port}${appConfig.restApiRoot}`,
    'bootstrap',
  );
}

if (require.main === module) {
  let numWorkers = parseInt(process.env.NOTIFYBC_WORKER_PROCESS_COUNT ?? '');
  if (isNaN(numWorkers)) {
    numWorkers = require('os').cpus().length;
  }
  if (numWorkers < 2) {
    bootstrap().catch((err) => {
      logger.error('Cannot start the application.', err);
      process.exit(1);
    });
    logger.log(`Worker ${process.pid} started`);
  } else {
    const cluster = require('cluster');
    if (cluster.isMaster) {
      logger.log(`# of worker processes = ${numWorkers}`);
      logger.log(`Master ${process.pid} is running`);
      let masterWorker: any;
      // Fork workers.
      for (let i = 0; i < numWorkers; i++) {
        if (i > 0) {
          cluster.fork({
            NOTIFYBC_NODE_ROLE: 'slave',
          });
        } else {
          masterWorker = cluster.fork();
        }
      }

      cluster.on(
        'exit',
        (worker: { process: { pid: any } }, code: any, signal: any) => {
          logger.log(`worker ${worker.process.pid} died`);
          if (worker === masterWorker) {
            logger.log(`worker ${worker.process.pid} is the master worker`);
            masterWorker = cluster.fork();
          } else {
            cluster.fork({
              NOTIFYBC_NODE_ROLE: 'slave',
            });
          }
        },
      );
    } else {
      bootstrap().catch((err) => {
        logger.error('Cannot start the application.', err);
        process.exit(1);
      });
      logger.log(`Worker ${process.pid} started`);
    }
  }
}
