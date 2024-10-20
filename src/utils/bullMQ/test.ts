import { Queue, Worker } from 'bullmq';

const myQueue = new Queue('foo', {
  connection: {
    host: '127.0.0.1',
    port: 6379,
  },
  defaultJobOptions: {
    removeOnComplete: true,
  },
});

async function addJobs() {
  for (let i = 0; i < 10; i++) {
    await myQueue.add('myJobName', {
      count: i,
    });
  }
}

addJobs();
new Worker(
  'foo',
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log({ ...job.data, time: new Date() });
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
