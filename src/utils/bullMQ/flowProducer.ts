import { FlowProducer, Worker } from 'bullmq';
import { promisify } from 'util';
const queueName = 'foo';
export const wait = promisify(setTimeout);

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
    await wait(5000);
    console.log(job.name);
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379,
    },
    // limiter: {
    //   max: 1,
    //   duration: 10000,
    // },
    lockDuration: 1000,
  },
);
