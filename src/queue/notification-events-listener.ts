import {
  InjectQueue,
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { BeforeApplicationShutdown, Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { pullAll } from 'lodash';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import {
  CommonService,
  NotificationDispatchStatusField,
} from 'src/common/common.service';
import { AppConfigService } from 'src/config/app-config.service';

@QueueEventsListener('n')
@Injectable()
export class NotificationEventsListener
  extends QueueEventsHost
  implements BeforeApplicationShutdown
{
  readonly logger = new Logger(NotificationEventsListener.name);
  private readonly appConfig;
  private get guaranteedBroadcastPushDispatchProcessing() {
    return this.appConfig.notification
      ?.guaranteedBroadcastPushDispatchProcessing;
  }
  private get broadcastSubscriberChunkSize() {
    return this.appConfig.notification?.broadcastSubscriberChunkSize;
  }

  constructor(
    appConfigService: AppConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly commonService: CommonService,
    @InjectQueue('n') private notificationQueue: Queue,
  ) {
    super();
    this.appConfig = appConfigService.get();
  }

  // failed listener marks all candidates in the chunk failed if
  // guaranteedBroadcastPushDispatchProcessing is false
  @OnQueueEvent('failed')
  async onFailed({ jobId }) {
    const job = await Job.fromId(this.notificationQueue, jobId);
    if (this.guaranteedBroadcastPushDispatchProcessing || job?.name !== 'c') {
      job.remove();
      return;
    }
    const notification = await this.notificationsService.findOne(
      {
        where: { id: job.data.id },
      },
      null,
    );
    const startIdx = job.data.s;
    const subChunk = (notification.dispatch.candidates as string[]).slice(
      startIdx,
      startIdx + this.broadcastSubscriberChunkSize,
    );
    pullAll(
      subChunk,
      (notification.dispatch?.failed ?? []).map((e: any) => e.subscriptionId),
    );
    await this.commonService.updateBroadcastPushNotificationStatus(
      notification,
      NotificationDispatchStatusField.failed,
      subChunk.map((e) => ({
        subscriptionId: e,
      })),
      null,
    );
    job.remove();
  }

  async beforeApplicationShutdown() {
    await this.queueEvents.close();
  }
}
