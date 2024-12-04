import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Job } from 'bullmq';
import jmespath from 'jmespath';
import { pullAll } from 'lodash';
import { AnyObject } from 'mongoose';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { Subscription } from 'src/api/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import {
  CommonService,
  NotificationDispatchStatusField,
} from 'src/common/common.service';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
@Processor('n')
export class NotificationQueueConsumer
  extends WorkerHost
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  readonly logger = new Logger(NotificationQueueConsumer.name);
  private readonly appConfig;
  private get broadcastSubscriberChunkSize() {
    return this.appConfig.notification?.broadcastSubscriberChunkSize;
  }
  private get guaranteedBroadcastPushDispatchProcessing() {
    return this.appConfig.notification
      ?.guaranteedBroadcastPushDispatchProcessing;
  }
  private get logSkippedBroadcastPushDispatches() {
    return this.appConfig.notification?.logSkippedBroadcastPushDispatches;
  }
  private readonly jmespathSearchOpts: AnyObject = {};
  private get handleBounce() {
    return this.appConfig.email?.bounce?.enabled;
  }
  private get handleListUnsubscribeByEmail() {
    return this.appConfig.email?.listUnsubscribeByEmail?.enabled;
  }
  private get inboundSmtpServerDomain() {
    return this.appConfig.email.inboundSmtpServer?.domain;
  }

  constructor(
    appConfigService: AppConfigService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly notificationsService: NotificationsService,
    private readonly commonService: CommonService,
  ) {
    super();
    this.appConfig = appConfigService.get();

    const ft = this.appConfig.notification?.broadcastCustomFilterFunctions;
    if (ft) {
      this.jmespathSearchOpts.functionTable = ft;
    }
  }

  async notificationMsgCB(data, err: any, e: Subscription) {
    if (err) {
      return this.commonService.updateBroadcastPushNotificationStatus(
        data,
        NotificationDispatchStatusField.failed,
        {
          subscriptionId: e.id.toString(),
          userChannelId: e.userChannelId,
          error: err,
        },
      );
    } else if (
      this.guaranteedBroadcastPushDispatchProcessing ||
      this.handleBounce
    ) {
      return this.commonService.updateBroadcastPushNotificationStatus(
        data,
        NotificationDispatchStatusField.successful,
        e.id.toString(),
      );
    }
  }

  async broadcastToSubscriberChunk(data, job: Job) {
    const startIdx = job.data.s;
    const subChunk = (data.dispatch.candidates as string[]).slice(
      startIdx,
      startIdx + this.broadcastSubscriberChunkSize,
    );
    pullAll(
      pullAll(
        pullAll(
          subChunk,
          (data.dispatch?.failed ?? []).map((e: any) => e.subscriptionId),
        ),
        data.dispatch?.successful ?? [],
      ),
      data.dispatch?.skipped ?? [],
    );
    const subscribers = await this.subscriptionsService.findAll(
      {
        where: {
          id: { $in: subChunk },
        },
      },
      null,
    );
    let completed = 0;
    await Promise.all(
      subscribers.map(async (e) => {
        if (e.broadcastPushNotificationFilter && data.data) {
          let match: [];
          try {
            match = await jmespath.search(
              [data.data],
              '[?' + e.broadcastPushNotificationFilter + ']',
              this.jmespathSearchOpts,
            );
          } catch (ex) {}
          if (!match || match.length === 0) {
            if (
              this.guaranteedBroadcastPushDispatchProcessing &&
              this.logSkippedBroadcastPushDispatches
            )
              await this.commonService.updateBroadcastPushNotificationStatus(
                data,
                NotificationDispatchStatusField.skipped,
                e.id.toString(),
              );
            job.updateProgress(++completed / subscribers.length);
            return;
          }
        }
        if (e.data && data.broadcastPushNotificationSubscriptionFilter) {
          let match: [];
          try {
            match = await jmespath.search(
              [e.data],
              '[?' + data.broadcastPushNotificationSubscriptionFilter + ']',
              this.jmespathSearchOpts,
            );
          } catch (ex) {}
          if (!match || match.length === 0) {
            if (
              this.guaranteedBroadcastPushDispatchProcessing &&
              this.logSkippedBroadcastPushDispatches
            )
              await this.commonService.updateBroadcastPushNotificationStatus(
                data,
                NotificationDispatchStatusField.skipped,
                e.id.toString(),
              );
            job.updateProgress(++completed / subscribers.length);
            return;
          }
        }
        const textBody =
          data.message.textBody &&
          this.commonService.mailMerge(
            data.message.textBody,
            e,
            data,
            data.dispatch.req,
          );
        switch (e.channel) {
          case 'sms':
            try {
              await this.commonService.sendSMS(e.userChannelId, textBody, e);
              await this.notificationMsgCB(data, null, e);
            } catch (ex) {
              await this.notificationMsgCB(data, ex, e);
            } finally {
              job.updateProgress(++completed / subscribers.length);
              return;
            }
          default: {
            const subject =
              data.message.subject &&
              this.commonService.mailMerge(
                data.message.subject,
                e,
                data,
                data.dispatch.req,
              );
            const htmlBody =
              data.message.htmlBody &&
              this.commonService.mailMerge(
                data.message.htmlBody,
                e,
                data,
                data.dispatch.req,
              );
            const unsubscriptUrl = this.commonService.mailMerge(
              '{unsubscription_url}',
              e,
              data,
              data.dispatch.req,
            );
            let listUnsub = unsubscriptUrl;
            if (
              this.handleListUnsubscribeByEmail &&
              this.inboundSmtpServerDomain
            ) {
              const unsubEmail =
                this.commonService.mailMerge(
                  'un-{subscription_id}-{unsubscription_code}@',
                  e,
                  data,
                  data.dispatch.req,
                ) + this.inboundSmtpServerDomain;
              listUnsub = [[unsubEmail, unsubscriptUrl]];
            }
            const mailOptions: AnyObject = {
              from: data.message.from,
              to: e.userChannelId,
              subject: subject,
              text: textBody,
              html: htmlBody,
              list: {
                id: data.httpHost + '/' + encodeURIComponent(data.serviceName),
                unsubscribe: listUnsub,
              },
            };
            if (this.handleBounce && this.inboundSmtpServerDomain) {
              const bounceEmail = this.commonService.mailMerge(
                `bn-{subscription_id}-{unsubscription_code}@${this.inboundSmtpServerDomain}`,
                e,
                data,
                data.dispatch.req,
              );
              mailOptions.envelope = {
                from: bounceEmail,
                to: e.userChannelId,
              };
            }
            try {
              await this.commonService.sendEmail(mailOptions);
              await this.notificationMsgCB(data, null, e);
            } catch (ex) {
              await this.notificationMsgCB(data, ex, e);
            } finally {
              job.updateProgress(++completed / subscribers.length);
              return;
            }
          }
        }
      }),
    );
  }

  async postBroadcastProcessing(data) {
    data = await this.notificationsService.findById(data.id);
    const res = await this.subscriptionsService.findAll(
      {
        fields: {
          userChannelId: true,
        },
        where: {
          id: {
            $in: data.dispatch?.successful ?? [],
          },
        },
      },
      data.dispatch.req,
    );
    const userChannelIds = res.map((e) => e.userChannelId);
    const errUserChannelIds = (data.dispatch?.failed || []).map(
      (e: { userChannelId: any }) => e.userChannelId,
    );
    pullAll(userChannelIds, errUserChannelIds);
    await this.commonService.updateBounces(
      userChannelIds,
      data,
      data.dispatch.req,
    );
    if (data.state !== 'error') {
      data.state = 'sent';
    }
    await this.notificationsService.updateById(
      data.id,
      { state: data.state, $unset: { 'dispatch.req': 1 } },
      data.dispatch.req,
    );
    if (typeof data.asyncBroadcastPushNotification === 'string') {
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        await fetch(data.asyncBroadcastPushNotification, options);
      } catch (ex) {}
    }
  }

  async process(job: Job) {
    this.logger.debug(job?.id);
    const notification = await this.notificationsService.findOne(
      {
        where: { id: job.data.id },
      },
      null,
    );
    if (!notification) {
      throw new Error('notification not found');
    }
    switch (job.name) {
      case 'p':
        return this.postBroadcastProcessing(notification);
      case 'c':
        const hbTimeout = setInterval(() => {
          this.notificationsService.updateById(notification.id, {
            updated: new Date(),
          });
        }, 300000);
        try {
          await this.broadcastToSubscriberChunk(notification, job);
        } finally {
          clearInterval(hbTimeout);
        }
    }
  }

  async beforeApplicationShutdown() {
    await this.worker.close();
  }

  onApplicationBootstrap() {
    this.worker.opts.maxStalledCount = this
      .guaranteedBroadcastPushDispatchProcessing
      ? 2
      : 0;
  }
}
