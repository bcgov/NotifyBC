import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { promisify } from 'util';

const wait = promisify(setTimeout);

@Injectable()
@Processor('e', {
  limiter: {
    max: 1,
    duration: 10000,
  },
})
export class EmailQueueConsumer extends WorkerHost {
  readonly logger = new Logger(EmailQueueConsumer.name);

  async process(job: Job<any, any, string>) {
    await wait(5);
    this.logger.debug(job?.id);
  }
}
