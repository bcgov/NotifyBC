// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { queue } from 'async';
import axios from 'axios';
import { Request } from 'express';
import jmespath from 'jmespath';
import { pullAll } from 'lodash';
import { AnyObject, FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AppConfigService } from 'src/config/app-config.service';
import { promisify } from 'util';
import { BouncesService } from '../bounces/bounces.service';
import { BaseController } from '../common/base.controller';
import { CountDto } from '../common/dto/count.dto';
import { FilterDto } from '../common/dto/filter.dto';
import {
  ApiFilterJsonQuery,
  ApiWhereJsonQuery,
  JsonQuery,
} from '../common/json-query.decorator';
import { ConfigurationsService } from '../configurations/configurations.service';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
const wait = promisify(setTimeout);
enum NotificationDispatchStatusField {
  failed,
  successful,
  skipped,
}

@Controller({
  path: 'notifications',
  scope: Scope.REQUEST,
})
@ApiTags('notification')
@Roles(Role.Admin, Role.SuperAdmin, Role.AuthenticatedUser)
export class NotificationsController extends BaseController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly subscriptionsService: SubscriptionsService,
    readonly appConfigService: AppConfigService,
    readonly configurationsService: ConfigurationsService,
    private readonly bouncesService: BouncesService,
    @Inject(REQUEST) private readonly req: Request & { user: UserProfile },
  ) {
    super(appConfigService, configurationsService);
    const ft = this.appConfig.notification?.broadcastCustomFilterFunctions;
    if (ft) {
      this.jmespathSearchOpts.functionTable = ft;
    }
  }
  chunkRequestAborted = false;
  readonly jmespathSearchOpts: AnyObject = {};

  @Get('count')
  @ApiOkResponse({
    description: 'Notification model count',
    type: CountDto,
  })
  @ApiWhereJsonQuery()
  async count(
    @JsonQuery('where')
    where?: FilterQuery<Notification>,
  ): Promise<CountDto> {
    return this.notificationsService.count(where);
  }

  @Put(':id')
  @ApiNoContentResponse({
    description: 'Notification PUT success',
  })
  @HttpCode(204)
  @Roles(Role.Admin, Role.SuperAdmin)
  async replaceById(
    @Param('id') id: string,
    @Body() notification: CreateNotificationDto,
  ): Promise<void> {
    await this.preCreationValidation(notification);
    await this.notificationsService.replaceById(id, notification, this.req);
    notification = await this.notificationsService.findById(id);
    this.req['args'] = { data: notification };
    await this.dispatchNotification(notification as Notification);
  }

  @Patch(':id')
  @ApiNoContentResponse({
    description: 'Notification PATCH success',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(204)
  async updateById(
    @Param('id') id: string,
    @Body() notification: UpdateNotificationDto,
  ): Promise<void> {
    // only allow changing inApp state for non-admin requests
    if (![Role.Admin, Role.SuperAdmin].includes(this.req.user.role)) {
      const currUser =
        this.req.user.role === Role.AuthenticatedUser &&
        this.req.user.securityId;
      if (!currUser) {
        throw new HttpException(undefined, HttpStatus.FORBIDDEN);
      }
      const instance = await this.notificationsService.findOne(
        {
          where: { id },
        },
        this.req,
      );
      if (instance?.channel !== 'inApp') {
        throw new HttpException(undefined, HttpStatus.FORBIDDEN);
      }
      if (!notification.state) {
        throw new HttpException(undefined, HttpStatus.NOT_FOUND);
      }
      notification = {
        state: notification.state,
      };
      if (instance.isBroadcast) {
        switch (notification.state) {
          case 'read':
            notification.readBy = instance.readBy || [];
            if (notification.readBy.indexOf(currUser) < 0) {
              notification.readBy.push(currUser);
            }
            break;
          case 'deleted':
            notification.deletedBy = instance.deletedBy || [];
            if (notification.deletedBy.indexOf(currUser) < 0) {
              notification.deletedBy.push(currUser);
            }
            break;
        }
        delete notification.state;
      }
    }
    await this.notificationsService.updateById(id, notification, this.req);
  }

  @Get(':id')
  @ApiQuery({
    name: 'filter',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            fields: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Notification model instance',
  })
  async findById(
    @Param('id') id: string,
    @JsonQuery('filter')
    filter: Omit<FilterDto<Notification>, 'where'>,
  ): Promise<Notification | null> {
    return this.notificationsService.findOne(
      {
        ...filter,
        where: { id },
      },
      this.req,
    );
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Notification DELETE success' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(204)
  async deleteById(@Param('id') id: string): Promise<void> {
    const data = await this.notificationsService.findOne(
      {
        where: { id },
      },
      this.req,
    );
    if (!data) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
    data.state = 'deleted';
    await this.updateById(id, data);
  }

  @Post()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Notification model instance',
    type: Notification,
  })
  @Roles(Role.Admin, Role.SuperAdmin)
  async create(
    @Body() notification: CreateNotificationDto,
  ): Promise<Notification> {
    await this.preCreationValidation(notification);
    const res = await this.notificationsService.create(notification, this.req);
    this.req['args'] = { data: res };
    return this.dispatchNotification(res);
  }

  @Get()
  @ApiOkResponse({
    description: 'Array of Notification model instances',
    type: [Notification],
  })
  @ApiFilterJsonQuery()
  async find(
    @JsonQuery('filter')
    filter: FilterDto<Notification>,
  ): Promise<Notification[]> {
    const res = await this.notificationsService.findAll(filter, this.req);
    if (res.length === 0) {
      return res;
    }
    if ([Role.Admin, Role.SuperAdmin].includes(this.req.user.role)) return res;
    const currUser =
      this.req.user.role === Role.AuthenticatedUser && this.req.user.securityId;
    if (!currUser) {
      return res;
    }
    return res.reduce((p: Notification[], e: Notification) => {
      if (e.validTill && e.validTill < new Date()) {
        return p;
      }
      if (e.invalidBefore && e.invalidBefore > new Date()) {
        return p;
      }
      if (e.isBroadcast && e.deletedBy && e.deletedBy.indexOf(currUser) >= 0) {
        return p;
      }
      if (e.isBroadcast && e.readBy && e.readBy.indexOf(currUser) >= 0) {
        e.state = 'read';
      }
      if (e.isBroadcast) {
        e.readBy = null;
        e.deletedBy = null;
      }
      e.updatedBy = undefined;
      e.createdBy = undefined;
      p.push(e);
      return p;
    }, []);
  }

  @Get(':id/broadcastToChunkSubscribers')
  @ApiExcludeEndpoint()
  async broadcastToChunkSubscribers(
    @Param('id') id: string,
    @Query('start', ParseIntPipe) startIdx: number,
  ) {
    if (
      this.appConfig.notification?.guaranteedBroadcastPushDispatchProcessing
    ) {
      this.req.on('close', () => {
        this.chunkRequestAborted = true;
      });
    }
    const notification = await this.notificationsService.findOne(
      {
        where: { id },
      },
      this.req,
    );
    if (!notification) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
    this.req['args'] = { data: notification };
    this.req['NotifyBC.startIdx'] = startIdx;
    return this.sendPushNotification(notification);
  }

  handleBounce = this.appConfig.email?.bounce?.enabled;
  async updateBounces(
    userChannelIds: string[] | string,
    dataNotification: Notification,
  ) {
    if (!this.handleBounce) {
      return;
    }
    let userChannelIdQry: any = userChannelIds;
    if (userChannelIds instanceof Array) {
      userChannelIdQry = {
        $in: userChannelIds,
      };
    }
    await this.bouncesService.updateAll(
      {
        latestNotificationStarted: dataNotification.updated,
        latestNotificationEnded: new Date(),
      },
      {
        state: 'active',
        channel: dataNotification.channel,
        userChannelId: userChannelIdQry,
        $or: [
          {
            latestNotificationStarted: null,
          },
          {
            latestNotificationStarted: {
              $lt: dataNotification.updated,
            },
          },
        ],
      },
      this.req,
    );
  }

  async updateBroadcastPushNotificationStatus(
    data,
    field: NotificationDispatchStatusField,
    payload: any,
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
          this.req,
        );
        success = true;
        return;
      } catch (ex) {}
      await wait(1000);
    }
  }

  guaranteedBroadcastPushDispatchProcessing =
    this.appConfig.notification?.guaranteedBroadcastPushDispatchProcessing;
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
      this.req,
    );
    const userChannelIds = res.map((e) => e.userChannelId);
    const errUserChannelIds = (data.dispatch?.failed || []).map(
      (e: { userChannelId: any }) => e.userChannelId,
    );
    pullAll(userChannelIds, errUserChannelIds);
    await this.updateBounces(userChannelIds, data);

    if (!data.asyncBroadcastPushNotification) {
      return;
    } else {
      if (data.state !== 'error') {
        data.state = 'sent';
      }
      await this.notificationsService.updateById(
        data.id,
        { state: data.state },
        this.req,
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
  }

  broadcastSubscriberChunkSize =
    this.appConfig.notification?.broadcastSubscriberChunkSize;
  logSkippedBroadcastPushDispatches =
    this.appConfig.notification?.logSkippedBroadcastPushDispatches;
  inboundSmtpServerDomain = this.appConfig.email.inboundSmtpServer?.domain;
  handleListUnsubscribeByEmail =
    this.appConfig.email?.listUnsubscribeByEmail?.enabled;

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
      this.req,
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
          this.mailMerge(data.message.textBody, e, data, this.req);
        switch (e.channel) {
          case 'sms':
            try {
              if (this.chunkRequestAborted)
                throw new HttpException(
                  undefined,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              await this.sendSMS(e.userChannelId, textBody, e);
              return await this.notificationMsgCB(data, null, e);
            } catch (ex) {
              return await this.notificationMsgCB(data, ex, e);
            }
            break;
          default: {
            const subject =
              data.message.subject &&
              this.mailMerge(data.message.subject, e, data, this.req);
            const htmlBody =
              data.message.htmlBody &&
              this.mailMerge(data.message.htmlBody, e, data, this.req);
            const unsubscriptUrl = this.mailMerge(
              '{unsubscription_url}',
              e,
              data,
              this.req,
            );
            let listUnsub = unsubscriptUrl;
            if (
              this.handleListUnsubscribeByEmail &&
              this.inboundSmtpServerDomain
            ) {
              const unsubEmail =
                this.mailMerge(
                  'un-{subscription_id}-{unsubscription_code}@',
                  e,
                  data,
                  this.req,
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
              const bounceEmail = this.mailMerge(
                `bn-{subscription_id}-{unsubscription_code}@${this.inboundSmtpServerDomain}`,
                e,
                data,
                this.req,
              );
              mailOptions.envelope = {
                from: bounceEmail,
                to: e.userChannelId,
              };
            }
            try {
              if (this.chunkRequestAborted)
                throw new HttpException(
                  undefined,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              await this.sendEmail(mailOptions);
              return await this.notificationMsgCB(data, null, e);
            } catch (ex) {
              return await this.notificationMsgCB(data, ex, e);
            }
          }
        }
      }),
    );
  }

  async sendPushNotification(data: Notification) {
    switch (data.isBroadcast) {
      case false: {
        const sub: Partial<Subscription> =
          this.req['NotifyBC.subscription'] ?? {};
        const textBody =
          data.message.textBody &&
          this.mailMerge(data.message.textBody, sub, data, this.req);
        switch (data.channel) {
          case 'sms':
            await this.sendSMS(data.userChannelId as string, textBody, sub);
            return;
          default: {
            const htmlBody =
              data.message.htmlBody &&
              this.mailMerge(data.message.htmlBody, sub, data, this.req);
            const subject =
              data.message.subject &&
              this.mailMerge(data.message.subject, sub, data, this.req);
            const unsubscriptUrl = this.mailMerge(
              '{unsubscription_url}',
              sub,
              data,
              this.req,
            );
            let listUnsub = unsubscriptUrl;
            if (
              this.handleListUnsubscribeByEmail &&
              this.inboundSmtpServerDomain
            ) {
              const unsubEmail =
                this.mailMerge(
                  'un-{subscription_id}-{unsubscription_code}@',
                  sub,
                  data,
                  this.req,
                ) + this.inboundSmtpServerDomain;
              listUnsub = [[unsubEmail, unsubscriptUrl]];
            }
            const mailOptions: AnyObject = {
              from: data.message.from,
              to: data.userChannelId,
              subject: subject,
              text: textBody,
              html: htmlBody,
              list: {
                id: data.httpHost + '/' + encodeURIComponent(data.serviceName),
                unsubscribe: listUnsub,
              },
            };
            if (this.handleBounce && this.inboundSmtpServerDomain) {
              const bounceEmail = this.mailMerge(
                `bn-{subscription_id}-{unsubscription_code}@${this.inboundSmtpServerDomain}`,
                sub,
                data,
                this.req,
              );
              mailOptions.envelope = {
                from: bounceEmail,
                to: data.userChannelId,
              };
            }
            await this.sendEmail(mailOptions);
            await this.updateBounces(data.userChannelId as string, data);
            return;
          }
        }
      }
      case true: {
        const broadcastSubRequestBatchSize =
          this.appConfig.notification?.broadcastSubRequestBatchSize;
        let startIdx: undefined | number = this.req['NotifyBC.startIdx'];
        if (typeof startIdx !== 'number') {
          // main request
          const subCandidates = await this.subscriptionsService.findAll(
            {
              where: {
                serviceName: data.serviceName,
                state: 'confirmed',
                channel: data.channel,
              },
              fields: ['id'],
            },
            this.req,
          );
          data.dispatch = data.dispatch ?? {};
          data.dispatch.candidates =
            data.dispatch.candidates ??
            subCandidates.map((e) => e.id.toString());
          await this.notificationsService.updateById(
            data.id,
            {
              state: 'sending',
              dispatch: data.dispatch,
            },
            this.req,
          );
          const hbTimeout = setInterval(() => {
            this.notificationsService.updateById(
              data.id,
              {
                updated: new Date(),
              },
              this.req,
            );
          }, 60000);

          const count = subCandidates.length;

          if (count <= this.broadcastSubscriberChunkSize) {
            startIdx = 0;
            await this.broadcastToSubscriberChunk(data, startIdx);
            await this.postBroadcastProcessing(data);
          } else {
            // call broadcastToSubscriberChunk, coordinate output
            const chunks = Math.ceil(count / this.broadcastSubscriberChunkSize);
            let httpHost = this.appConfig.internalHttpHost;
            const restApiRoot = this.appConfig.restApiRoot ?? '';
            if (!httpHost) {
              httpHost =
                data.httpHost ||
                this.req.protocol + '://' + this.req.get('host');
            }

            const q = queue(async (task: { startIdx: string }) => {
              const uri =
                httpHost +
                restApiRoot +
                '/notifications/' +
                data.id +
                '/broadcastToChunkSubscribers?start=' +
                task.startIdx;
              const response = await axios.get(uri);
              return response.data;
            }, broadcastSubRequestBatchSize);
            // re-submit task on error if
            // guaranteedBroadcastPushDispatchProcessing.
            // See issue #39
            let failedChunks: any[] = [];
            q.error((_err: any, task: any) => {
              if (this.guaranteedBroadcastPushDispatchProcessing) {
                Logger.debug(_err, NotificationsController.name);
                Logger.debug(
                  `re-push task startIdx=${task.startIdx}`,
                  NotificationsController.name,
                );
                q.push(task);
              } else {
                data.state = 'error';
                // mark all chunk subs as failed
                const subChunk = (data.dispatch.candidates as string[]).slice(
                  task.startIdx,
                  task.startIdx + this.broadcastSubscriberChunkSize,
                );
                failedChunks = failedChunks.concat(
                  subChunk.map((e) => {
                    return { subscriptionId: e };
                  }),
                );
              }
            });
            let i = 0;
            while (i < chunks) {
              q.push({
                startIdx: i++ * this.broadcastSubscriberChunkSize,
              });
            }
            await q.drain();
            if (failedChunks.length > 0) {
              await this.updateBroadcastPushNotificationStatus(
                data,
                NotificationDispatchStatusField.failed,
                failedChunks,
              );
            }
            await this.postBroadcastProcessing(data);
          }
          clearTimeout(hbTimeout);
        } else {
          return this.broadcastToSubscriberChunk(data, startIdx);
        }
        break;
      }
    }
  }

  public async dispatchNotification(res: Notification): Promise<Notification> {
    // send non-inApp notifications immediately
    switch (res.channel) {
      case 'email':
      case 'sms':
        if (res.invalidBefore && res.invalidBefore > new Date()) {
          return res;
        }
        if (!res.httpHost) {
          res.httpHost = this.appConfig.httpHost;
          if (!res.httpHost && this.req) {
            res.httpHost = this.req.protocol + '://' + this.req.get('host');
          }
        }
        try {
          if (res.isBroadcast && res.asyncBroadcastPushNotification) {
            this.sendPushNotification(res);
            return res;
          } else {
            await this.sendPushNotification(res);
            res.state = 'sent';
          }
        } catch (errSend: any) {
          res.state = 'error';
        }
        await this.notificationsService.updateById(
          res.id,
          { state: res.state },
          this.req,
        );
        break;
      default:
        break;
    }
    return this.notificationsService.findById(res.id);
  }

  public async preCreationValidation(data: CreateNotificationDto) {
    if (
      !data.isBroadcast &&
      data.skipSubscriptionConfirmationCheck &&
      !data.userChannelId
    ) {
      throw new HttpException('invalid user', HttpStatus.FORBIDDEN);
    }
    let filter = data.broadcastPushNotificationSubscriptionFilter;
    if (data.isBroadcast && data.channel !== 'inApp' && filter) {
      filter = '[?' + filter + ']';
      try {
        jmespath.compile(filter);
      } catch (ex) {
        throw new HttpException(
          'invalid broadcastPushNotificationFilter',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (
      data.channel === 'inApp' ||
      data.skipSubscriptionConfirmationCheck ||
      data.isBroadcast
    ) {
      return;
    }
    if (!data.userChannelId && !data.userId) {
      throw new HttpException('invalid user', HttpStatus.FORBIDDEN);
    }
    // validate userChannelId/userId of a unicast push notification against subscription data
    const whereClause: FilterQuery<Notification> = {
      serviceName: data.serviceName,
      state: 'confirmed',
      channel: data.channel,
    };
    if (data.userChannelId) {
      // email address check should be case insensitive
      const escapedUserChannelId = data.userChannelId.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        '\\$&',
      );
      const escapedUserChannelIdRegExp = new RegExp(escapedUserChannelId, 'i');
      whereClause.userChannelId = {
        $regex: escapedUserChannelIdRegExp,
      };
    }
    if (data.userId) {
      whereClause.userId = data.userId;
    }

    try {
      const subscription = await this.subscriptionsService.findOne(
        {
          where: whereClause,
        },
        this.req,
      );
      if (!subscription) {
        throw new HttpException('invalid user', HttpStatus.FORBIDDEN);
      }
      // in case request supplies userId instead of userChannelId
      data.userChannelId = subscription?.userChannelId;
      this.req['NotifyBC.subscription'] = subscription;
    } catch (ex) {
      throw new HttpException('invalid user', HttpStatus.FORBIDDEN);
    }
  }
}
