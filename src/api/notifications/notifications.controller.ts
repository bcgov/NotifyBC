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

import { getFlowProducerToken } from '@nestjs/bullmq';
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
  Patch,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FlowJob, FlowProducer, QueueEvents } from 'bullmq';
import { Request } from 'express';
import jmespath from 'jmespath';
import { pick } from 'lodash';
import { AnyObject, FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
import { CommonService } from 'src/common/common.service';
import { AppConfigService } from 'src/config/app-config.service';
import { CountDto } from '../common/dto/count.dto';
import { FilterDto } from '../common/dto/filter.dto';
import {
  ApiFilterJsonQuery,
  ApiWhereJsonQuery,
  JsonQuery,
} from '../common/json-query.decorator';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@Controller({
  path: 'notifications',
  scope: Scope.REQUEST,
})
@ApiTags('notification')
@Roles(Role.Admin, Role.SuperAdmin, Role.AuthenticatedUser)
export class NotificationsController {
  private readonly appConfig;
  private readonly handleBounce;
  private readonly guaranteedBroadcastPushDispatchProcessing;
  private readonly broadcastSubscriberChunkSize;
  private readonly inboundSmtpServerDomain;
  private readonly handleListUnsubscribeByEmail;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly subscriptionsService: SubscriptionsService,
    appConfigService: AppConfigService,
    private readonly commonService: CommonService,
    @Inject(REQUEST) private readonly req: Request & { user: UserProfile },
    @Inject(getFlowProducerToken()) private readonly flowProducer: FlowProducer,
  ) {
    this.appConfig = appConfigService.get();
    this.handleBounce = this.appConfig.email?.bounce?.enabled;
    this.guaranteedBroadcastPushDispatchProcessing =
      this.appConfig.notification?.guaranteedBroadcastPushDispatchProcessing;
    this.broadcastSubscriberChunkSize =
      this.appConfig.notification?.broadcastSubscriberChunkSize;
    this.inboundSmtpServerDomain =
      this.appConfig.email.inboundSmtpServer?.domain;
    this.handleListUnsubscribeByEmail =
      this.appConfig.email?.listUnsubscribeByEmail?.enabled;
  }

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

  async waitForFlowJobCompletion(flowJob: FlowJob) {
    return new Promise(async (resolve, reject) => {
      const queueEvents = new QueueEvents(flowJob.queueName, {
        connection: this.flowProducer.opts.connection,
        prefix: this.flowProducer.opts.prefix,
      });
      const queuedID = [];
      // IMPORTANT: place queueEvents.on before queue add
      queueEvents.on('completed', async ({ jobId }) => {
        if (!j?.job?.id) {
          queuedID.push(jobId);
          return;
        }
        if (jobId !== j?.job.id) {
          return;
        }
        Logger.debug(
          `job ${jobId} completed on queueEventsListener for ${j?.job.id}`,
          NotificationsController.name,
        );
        try {
          resolve(null);
        } catch (ex) {
          reject(ex);
        }
        queueEvents.close();
      });

      await queueEvents.waitUntilReady();

      const j = await this.flowProducer.add(flowJob, {
        queuesOptions: {
          [flowJob.queueName]: {
            defaultJobOptions: {
              removeOnComplete: true,
            },
          },
        },
      });

      // extra guard in case queueEvents.on is called before j is assigned.
      if (queuedID.indexOf(j.job.id) >= 0) {
        try {
          resolve(null);
        } catch (ex) {
          reject(ex);
        }
      }
    });
  }

  async sendPushNotification(data: Notification) {
    switch (data.isBroadcast) {
      case false: {
        const sub: Partial<Subscription> =
          this.req['NotifyBC.subscription'] ?? {};
        const textBody =
          data.message.textBody &&
          this.commonService.mailMerge(
            data.message.textBody,
            sub,
            data,
            this.req,
          );
        switch (data.channel) {
          case 'sms':
            await this.commonService.sendSMS(
              data.userChannelId as string,
              textBody,
              sub,
            );
            return;
          default: {
            const htmlBody =
              data.message.htmlBody &&
              this.commonService.mailMerge(
                data.message.htmlBody,
                sub,
                data,
                this.req,
              );
            const subject =
              data.message.subject &&
              this.commonService.mailMerge(
                data.message.subject,
                sub,
                data,
                this.req,
              );
            const unsubscriptUrl = this.commonService.mailMerge(
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
                this.commonService.mailMerge(
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
              const bounceEmail = this.commonService.mailMerge(
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
            await this.commonService.sendEmail(mailOptions);
            await this.commonService.updateBounces(
              data.userChannelId as string,
              data,
              this.req,
            );
            return;
          }
        }
      }
      case true: {
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
          data.dispatch.candidates ?? subCandidates.map((e) => e.id.toString());
        // todo: pick more props is needed
        data.dispatch.req = pick(this.req, ['user', 'protocol', 'hostname']);
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
        const chunks = Math.ceil(count / this.broadcastSubscriberChunkSize);
        let i = 0;
        const children = [];
        while (i < chunks) {
          children.push({
            name: 'c',
            queueName: 'n',
            data: {
              id: data.id,
              s: i++ * this.broadcastSubscriberChunkSize,
            },
            opts: { ignoreDependencyOnFailure: true },
          });
        }
        await this.waitForFlowJobCompletion({
          name: 'p',
          queueName: 'n',
          data: { id: data.id },
          children,
        });
        clearTimeout(hbTimeout);
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
          }
        } catch (errSend: any) {
          await this.notificationsService.updateById(
            res.id,
            { state: 'error' },
            this.req,
          );
        }
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
