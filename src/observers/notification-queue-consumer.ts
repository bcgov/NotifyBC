import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
@Processor('n')
export class NotificationQueueConsumer extends WorkerHost {
  readonly logger = new Logger(NotificationQueueConsumer.name);

  constructor() {
    super();
  }

  async process(job: Job) {
    this.logger.debug(job?.id);
  }
}
