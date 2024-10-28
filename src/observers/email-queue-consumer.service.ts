import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
@Processor('e')
export class EmailQueueConsumerService extends WorkerHost {
  async process(job: Job<any, any, string>) {
    console.log(job.id);
  }
}
