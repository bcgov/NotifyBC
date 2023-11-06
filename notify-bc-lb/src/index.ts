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
import {ApplicationConfig, ExpressServer} from './server';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new ExpressServer(options);
  await app.boot();
  await app.start();

  const url = app.url;
  console.log(`Server is running at ${url}`);

  return app;
}

const config = {
  rest: {
    // port and host come from config.json
    // port: +(process.env.PORT ?? 3000),
    // host: process.env.HOST,
    // The `gracePeriodForClose` provides a graceful close for http/https
    // servers with keep-alive clients. The default value is `Infinity`
    // (don't force-close). If you want to immediately destroy all sockets
    // upon stop, set its value to `0`.
    // See https://www.npmjs.com/package/stoppable
    gracePeriodForClose: 5000, // 5 seconds
    openApiSpec: {
      // useful when used with OpenAPI-to-GraphQL to locate your application
      setServersFromRequest: true,
    },
    // Use the LB4 application as a route. It should not be listening.
    listenOnStart: false,
  },
};

if (require.main === module) {
  let numWorkers = parseInt(process.env.NOTIFYBC_WORKER_PROCESS_COUNT ?? '');
  if (isNaN(numWorkers)) {
    numWorkers = require('os').cpus().length;
  }
  if (numWorkers < 2) {
    main(config).catch(err => {
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
        (worker: {process: {pid: any}}, code: any, signal: any) => {
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
      main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
      });
      console.log(`Worker ${process.pid} started`);
    }
  }
}
