import { FlowProducer, Queue, QueueEvents, Worker } from 'bullmq';
import { promisify } from 'util';
export const wait = promisify(setTimeout);

const queueName = 'foo';
const myQueue = new Queue(queueName, {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
  defaultJobOptions: {
    removeOnComplete: true,
  },
  streams: {
    events: {
      maxLen: 10,
    },
  },
});

function rateLimit(queueName: string, fn: (...args: any[]) => Promise<any>) {
  return async function (...args: any[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const queueEvents = new QueueEvents(queueName);
      const queuedID = [];
      // IMPORTANT: place queueEvents.on before myQueue.add
      queueEvents.on('completed', async ({ jobId }) => {
        if (!j?.id) {
          queuedID.push(jobId);
          return;
        }
        if (jobId !== j?.id) {
          return;
        }
        try {
          resolve(await fn.apply(this, args));
        } catch (ex) {
          reject(ex);
        }
        queueEvents.close();
      });
      const j = await myQueue.add('myJobName', undefined);
      // extra guard in case queueEvents.on is called before j is assigned.
      if (queuedID.indexOf(j.id) >= 0) {
        try {
          resolve(await fn.apply(this, args));
        } catch (ex) {
          reject(ex);
        }
      }
    });
  };
}

async function theWork(count) {
  await wait(100);
  console.log({ count, time: new Date() });
}

async function addJobs() {
  for (let i = 0; i < 10; i++) {
    rateLimit(queueName, theWork)(i);
    // non-rateLimited counterpart
    // theWork(i);
  }
}

// addJobs();

// A FlowProducer constructor takes an optional "connection"
// object otherwise it connects to a local redis instance.
const flowProducer = new FlowProducer();

async function addFlowJobs() {
  await flowProducer.add(
    {
      name: 'renovate-interior',
      queueName: queueName,
      children: [
        { name: 'paint', data: { place: 'ceiling' }, queueName: queueName },
        { name: 'paint', data: { place: 'walls' }, queueName: queueName },
        { name: 'fix', data: { place: 'floor' }, queueName: queueName },
      ],
    },
    {
      queuesOptions: {
        [queueName]: {
          defaultJobOptions: {
            removeOnComplete: true,
          },
        },
      },
    },
  );
}

addFlowJobs();

new Worker(
  queueName,
  async (job) => {
    await wait(10);
    console.log(job.name);
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
    limiter: {
      max: 1,
      duration: 10000,
    },
  },
);
