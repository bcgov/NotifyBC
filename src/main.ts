import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const packageJson = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService).get();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NotifyBC')
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${appConfig.restApiRoot}/explorer`, app, document);
  app.setGlobalPrefix(appConfig.restApiRoot);
  await app.listen(appConfig.port, appConfig.host);
  console.info(
    `Server is running at http://${appConfig.host}:${appConfig.port}${appConfig.restApiRoot}`,
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
