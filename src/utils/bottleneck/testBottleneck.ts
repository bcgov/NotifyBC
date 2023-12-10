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

import Bottleneck from 'bottleneck';
import { promisify } from 'util';

const clearDatastore = !!process.argv[4];
console.log(`clearDatastore=${clearDatastore}`);

const maxConcurrent = isNaN(parseInt(process.argv[3]))
  ? 9999
  : parseInt(process.argv[3]);

const priority = isNaN(parseInt(process.argv[2]))
  ? 5
  : parseInt(process.argv[2]);

async function log(n: number) {
  await promisify(setTimeout)(1);
  console.log('p' + priority + ' ' + n);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  const tasks: Promise<any>[] = [];
  const opts = {
    maxConcurrent,
    minTime: 1000,
    id: 'test',
    /* Redis clustering options */
    datastore: 'ioredis',
    clearDatastore,
    clientOptions: {
      host: '127.0.0.1',
      port: 6379,
    },
  };
  const bottleneck = new Bottleneck(opts);
  for (let i = 0; i < 100; i++) {
    tasks.push(
      (async () => {
        // const bottleneck = new Bottleneck(opts);
        try {
          await bottleneck
            .wrap(log)
            .withOptions({ priority, expiration: 500 }, i);
        } catch (ex) {
          if (
            !(
              ex instanceof Error &&
              ex.message.startsWith('This job timed out after')
            )
          ) {
            throw ex;
          }
        }
        // await bottleneck.disconnect();
      })(),
    );
  }
  await Promise.all(tasks);
  await bottleneck.disconnect();
})();
