import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Request } from 'express';
import jmespath from 'jmespath';
import { pullAll } from 'lodash';
import { AnyObject } from 'mongoose';
import { NotificationsService } from 'src/api/notifications/notifications.service';
import { Subscription } from 'src/api/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { CommonService } from 'src/common/common.service';
import { AppConfigService } from 'src/config/app-config.service';
import { promisify } from 'util';

enum NotificationDispatchStatusField {
  failed,
  successful,
  skipped,
}

const wait = promisify(setTimeout);

@Injectable()
@Processor('n')
export class NotificationQueueConsumer extends WorkerHost {
  readonly logger = new Logger(NotificationQueueConsumer.name);
  private readonly appConfig;
  private readonly broadcastSubscriberChunkSize;
  private readonly guaranteedBroadcastPushDispatchProcessing;
  private readonly logSkippedBroadcastPushDispatches;
  private readonly jmespathSearchOpts: AnyObject = {};
  private readonly handleBounce;
  private readonly handleListUnsubscribeByEmail;
  private readonly inboundSmtpServerDomain;

  constructor(
    appConfigService: AppConfigService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly notificationsService: NotificationsService,
    private readonly commonService: CommonService,
  ) {
    super();
    this.appConfig = appConfigService.get();
    this.broadcastSubscriberChunkSize =
      this.appConfig.notification?.broadcastSubscriberChunkSize;
    this.guaranteedBroadcastPushDispatchProcessing =
      this.appConfig.notification?.guaranteedBroadcastPushDispatchProcessing;
    this.logSkippedBroadcastPushDispatches =
      this.appConfig.notification?.logSkippedBroadcastPushDispatches;
    this.handleBounce = this.appConfig.email?.bounce?.enabled;
    this.handleListUnsubscribeByEmail =
      this.appConfig.email?.listUnsubscribeByEmail?.enabled;
    this.inboundSmtpServerDomain =
      this.appConfig.email.inboundSmtpServer?.domain;

    const ft = this.appConfig.notification?.broadcastCustomFilterFunctions;
    if (ft) {
      this.jmespathSearchOpts.functionTable = ft;
    }
  }

  async updateBroadcastPushNotificationStatus(
    data,
    field: NotificationDispatchStatusField,
    payload: any,
    req?: (Request & { user?: any }) | null,
  ) {
    let success = false;
    while (!success) {
      try {
        const val = payload instanceof Array ? { $each: payload } : payload;
        await this.notificationsService.updateById(
          data.id,
          {
            $push: {
              ['dispatch.' + NotificationDispatchStatusField[field]]: val,
            },
          },
          req,
        );
        success = true;
        return;
      } catch (ex) {}
      await wait(1000);
    }
  }

  async notificationMsgCB(data, err: any, e: Subscription) {
    if (err) {
      return this.updateBroadcastPushNotificationStatus(
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
      return this.updateBroadcastPushNotificationStatus(
        data,
        NotificationDispatchStatusField.successful,
        e.id.toString(),
      );
    }
  }

  async broadcastToSubscriberChunk(data, startIdx) {
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
              await this.updateBroadcastPushNotificationStatus(
                data,
                NotificationDispatchStatusField.skipped,
                e.id.toString(),
              );
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
              await this.updateBroadcastPushNotificationStatus(
                data,
                NotificationDispatchStatusField.skipped,
                e.id.toString(),
              );
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
              return await this.notificationMsgCB(data, null, e);
            } catch (ex) {
              return await this.notificationMsgCB(data, ex, e);
            }
            break;
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
              return await this.notificationMsgCB(data, null, e);
            } catch (ex) {
              return await this.notificationMsgCB(data, ex, e);
            }
          }
        }
      }),
    );
  }

  async process(job: Job) {
    this.logger.debug(job?.id);
    switch (job.name) {
      case 'p':
        break;
      case 'c':
        const notification = await this.notificationsService.findOne(
          {
            where: { id: job.data.id },
          },
          null,
        );
        if (!notification) {
          throw new Error('notification not found');
        }
        return this.broadcastToSubscriberChunk(notification, job.data.s);
    }
  }
}
