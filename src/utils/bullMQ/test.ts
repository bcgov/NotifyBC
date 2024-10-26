import { Queue, QueueEvents, Worker } from 'bullmq';

const myQueue = new Queue('foo', {
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

async function addJobs() {
  for (let i = 0; i < 10; i++) {
    async function theWork() {
      console.log({ count: i, time: new Date() });
    }
    const queueEvents = new QueueEvents('foo');
    const queuedID = [];
    // IMPORTANT: place queueEvents.on before myQueue.add
    queueEvents.on('completed', ({ jobId }) => {
      if (!j?.id) {
        queuedID.push(jobId);
        return;
      }
      if (jobId !== j?.id) {
        return;
      }
      theWork();
      queueEvents.close();
    });
    const j = await myQueue.add('myJobName', {
      count: i,
    });
    // extra guard in case queueEvents.on is called before j is assigned.
    if (queuedID.indexOf(j.id) >= 0) {
      theWork();
    }
  }
}

addJobs();
new Worker(
  'foo',
  async () => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    // console.log({ ...job.data, time: new Date() });
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
