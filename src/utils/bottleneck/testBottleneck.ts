import Bottleneck from 'bottleneck';
import { promisify } from 'util';

async function log(n: number) {
  await promisify(setTimeout)(1000);
  console.log(n);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  const tasks: Promise<any>[] = [];
  const opts = {
    maxConcurrent: 1,
    minTime: 4000,
    id: 'test',
    /* Redis clustering options */
    datastore: 'ioredis',
    // clearDatastore: true,
    clientOptions: {
      host: '127.0.0.1',
      port: 6379,
    },
  };
  console.log(`priority=${process.argv[2]}`);
  for (let i = 0; i < 10; i++) {
    tasks.push(
      (async () => {
        const bottleneck = new Bottleneck(opts);
        try {
          await bottleneck
            .wrap(log)
            .withOptions(
              { priority: parseInt(process.argv[2]) ?? 5, expiration: 500 },
              i,
            );
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
        await bottleneck.disconnect();
      })(),
    );
  }
  await Promise.all(tasks);
})();
