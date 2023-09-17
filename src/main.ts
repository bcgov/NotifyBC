import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FilterDto } from './api/common/dto/filter.dto';
import { ErrorsInterceptor } from './api/common/errors.interceptor';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

const packageJson = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalInterceptors(new ErrorsInterceptor());

  const appConfig = app.get(AppConfigService).get();

  // app.setGlobalPrefix has to be called before SwaggerModule.setup
  // otherwise swagger doesn't honor GlobalPrefix
  app.setGlobalPrefix(appConfig.restApiRoot);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NotifyBC')
    .setExternalDoc('./openapi.json', `${appConfig.restApiRoot}/explorer-json`)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [FilterDto],
  });
  SwaggerModule.setup(`${appConfig.restApiRoot}/explorer`, app, document, {
    patchDocumentOnRequest(req: any, _res: unknown, document: OpenAPIObject) {
      let colonPort = ':' + req.connection.localPort;
      if (req.connection.localPort === 80 && req.protocol === 'http')
        colonPort = '';
      if (req.connection.localPort === 443 && req.protocol === 'https')
        colonPort = '';
      const url = `${req.protocol}://${req.hostname}${colonPort}`;
      if (!document.servers.find((v: any) => v.url === url)) {
        document.servers.push({
          url,
        });
      }
      return document;
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  appConfig.trustedReverseProxyIps &&
    app.set('trust proxy', appConfig.trustedReverseProxyIps);
  await app.listen(appConfig.port, appConfig.host);
  Logger.log(
    `Server is running at http://${appConfig.host}:${appConfig.port}${appConfig.restApiRoot}`,
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
      console.error('Cannot start the application.', err);
      process.exit(1);
    });
    console.log(`Worker ${process.pid} started`);
  } else {
    const cluster = require('cluster');
    if (cluster.isMaster) {
      console.log(`# of worker processes = ${numWorkers}`);
      console.log(`Master ${process.pid} is running`);
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
          console.log(`worker ${worker.process.pid} died`);
          if (worker === masterWorker) {
            console.log(`worker ${worker.process.pid} is the master worker`);
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
        console.error('Cannot start the application.', err);
        process.exit(1);
      });
      console.log(`Worker ${process.pid} started`);
    }
  }
}
