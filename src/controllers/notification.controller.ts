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

import {authenticate} from '@loopback/authentication';
import {CoreBindings, inject} from '@loopback/core';
import {
  AnyObject,
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  MiddlewareContext,
  oas,
  OperationVisibility,
  param,
  patch,
  post,
  put,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import request from 'axios';
import _ from 'lodash';
import {promisify} from 'util';
import {ApplicationConfig} from '..';
import {Notification, Subscription} from '../models';
import {
  BounceRepository,
  ConfigurationRepository,
  NotificationRepository,
  SubscriptionRepository,
} from '../repositories';
import {BaseController} from './base.controller';
export {request};
const jmespath = require('jmespath');
const queue = require('async/queue');
const sleep = promisify(setTimeout);

@authenticate(
  'ipWhitelist',
  'clientCertificate',
  'accessToken',
  'oidc',
  'siteMinder',
)
@oas.tags('notification')
export class NotificationController extends BaseController {
  constructor(
    @inject('repositories.NotificationRepository', {
      asProxyWithInterceptors: true,
    })
    public notificationRepository: NotificationRepository,
    @inject('repositories.BounceRepository', {
      asProxyWithInterceptors: true,
    })
    public bounceRepository: BounceRepository,
    @inject('repositories.SubscriptionRepository', {
      asProxyWithInterceptors: true,
    })
    public subscriptionRepository: SubscriptionRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT, {optional: true})
    private httpContext: MiddlewareContext,
  ) {
    super(appConfig, configurationRepository);
  }

  @post('/notifications', {
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification),
        },
        'application/x-www-form-urlencoded': {
          schema: getModelSchemaRef(Notification),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    await this.preCreationValidation(notification);
    const res = await this.notificationRepository.create(
      notification,
      undefined,
    );
    this.httpContext.bind('args').to({data: res});
    return this.dispatchNotification(res);
  }

  @get('/notifications/count', {
    responses: {
      '200': {
        description: 'Notification model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.count(where, undefined);
  }

  @get('/notifications', {
    responses: {
      '200': {
        description: 'Array of Notification model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Notification, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    const res = await this.notificationRepository.find(filter, undefined);
    if (res.length === 0) {
      return res;
    }
    if (await this.configurationRepository.isAdminReq(this.httpContext))
      return res;
    const currUser = await this.configurationRepository.getCurrentUser(
      this.httpContext,
    );
    if (!currUser) {
      return res;
    }
    return res.reduce((p: Notification[], e) => {
      if (e.validTill && Date.parse(e.validTill) < new Date().valueOf()) {
        return p;
      }
      if (
        e.invalidBefore &&
        Date.parse(e.invalidBefore) > new Date().valueOf()
      ) {
        return p;
      }
      if (e.deletedBy && e.deletedBy.indexOf(currUser) >= 0) {
        return p;
      }
      if (e.isBroadcast && e.readBy && e.readBy.indexOf(currUser) >= 0) {
        e.state = 'read';
      }
      if (e.isBroadcast) {
        e.readBy = null;
        e.deletedBy = null;
      }
      delete e.updatedBy;
      delete e.createdBy;
      p.push(e);
      return p;
    }, []);
  }

  @get('/notifications/{id}', {
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Notification, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Notification, {exclude: 'where'})
    filter?: FilterExcludingWhere<Notification>,
  ): Promise<Notification | null> {
    return this.notificationRepository.findOne(
      Object.assign({}, {where: {id}}, filter),
      undefined,
    );
  }

  @patch('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PATCH success',
      },
      '403': {
        description: 'Forbidden',
      },
      '400': {
        description: 'Bad Request',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
        'application/x-www-form-urlencoded': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Partial<Notification>,
  ): Promise<void> {
    const ctx = this.httpContext;
    // only allow changing inApp state for non-admin requests
    if (!(await this.configurationRepository.isAdminReq(ctx))) {
      const currUser = await this.configurationRepository.getCurrentUser(ctx);
      if (!currUser) {
        throw new HttpErrors[403]();
      }
      const instance = await this.notificationRepository.findOne(
        {where: {id}},
        undefined,
      );
      if (instance?.channel !== 'inApp') {
        throw new HttpErrors[403]();
      }
      if (!notification.state) {
        throw new HttpErrors[400]();
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
    await this.notificationRepository.updateById(id, notification, undefined);
  }

  @put('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notification: Notification,
  ): Promise<void> {
    await this.preCreationValidation(notification);
    await this.notificationRepository.replaceById(id, notification, undefined);
    notification = await this.notificationRepository.findById(
      id,
      undefined,
      undefined,
    );
    this.httpContext.bind('args').to({data: notification});
    await this.dispatchNotification(notification);
  }

  @del('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification DELETE success',
      },
      '403': {
        description: 'Forbidden',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const data = await this.notificationRepository.findOne(
      {where: {id}},
      undefined,
    );
    if (!data) throw new HttpErrors[404]();
    data.state = 'deleted';
    await this.updateById(id, data);
  }

  @oas.visibility(OperationVisibility.UNDOCUMENTED)
  @get('/notifications/{id}/broadcastToChunkSubscribers', {
    responses: {
      '204': {
        description: 'Operation Successful',
      },
    },
  })
  async broadcastToChunkSubscribers(
    @param.path.string('id') id: string,
    @param.query.integer('start') startIdx: number,
  ) {
    const notification = await this.notificationRepository.findOne(
      {where: {id}},
      undefined,
    );
    if (!notification) throw new HttpErrors[404]();
    this.httpContext.bind('args').to({data: notification});
    this.httpContext.bind('NotifyBC.startIdx').to(startIdx);
    return this.sendPushNotification(notification);
  }

  private async sendPushNotification(data: Notification) {
    const inboundSmtpServerDomain =
      this.appConfig.inboundSmtpServer?.domain ||
      this.appConfig.subscription?.unsubscriptionEmailDomain;
    const handleBounce = this.appConfig.notification?.handleBounce;
    const handleListUnsubscribeByEmail = this.appConfig.notification
      ?.handleListUnsubscribeByEmail;

    const updateBounces = async (
      userChannelIds: string[] | string,
      dataNotification: Notification,
    ) => {
      if (!handleBounce) {
        return;
      }
      let userChannelIdQry: any = userChannelIds;
      if (userChannelIds instanceof Array) {
        userChannelIdQry = {
          inq: userChannelIds,
        };
      }
      await this.bounceRepository.updateAll(
        {
          latestNotificationStarted: <string>dataNotification.updated,
          latestNotificationEnded: new Date().toISOString(),
        },
        {
          state: 'active',
          channel: dataNotification.channel,
          userChannelId: userChannelIdQry,
          or: [
            {
              latestNotificationStarted: null,
            },
            {
              latestNotificationStarted: {
                lt: dataNotification.updated,
              },
            },
          ],
        },
        undefined,
      );
    };

    switch (data.isBroadcast) {
      case false: {
        let sub: Partial<Subscription> = {};
        try {
          sub = await this.httpContext.get('NotifyBC.subscription');
        } catch (ex) {}
        const textBody =
          data.message.textBody &&
          this.mailMerge(data.message.textBody, sub, data, this.httpContext);
        switch (data.channel) {
          case 'sms':
            await this.sendSMS(data.userChannelId as string, textBody, sub);
            return;
          default: {
            const htmlBody =
              data.message.htmlBody &&
              this.mailMerge(
                data.message.htmlBody,
                sub,
                data,
                this.httpContext,
              );
            const subject =
              data.message.subject &&
              this.mailMerge(data.message.subject, sub, data, this.httpContext);
            const unsubscriptUrl = this.mailMerge(
              '{unsubscription_url}',
              sub,
              data,
              this.httpContext,
            );
            let listUnsub = unsubscriptUrl;
            if (handleListUnsubscribeByEmail && inboundSmtpServerDomain) {
              const unsubEmail =
                this.mailMerge(
                  'un-{subscription_id}-{unsubscription_code}@',
                  sub,
                  data,
                  this.httpContext,
                ) + inboundSmtpServerDomain;
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
            if (handleBounce && inboundSmtpServerDomain) {
              const bounceEmail = this.mailMerge(
                `bn-{subscription_id}-{unsubscription_code}@${inboundSmtpServerDomain}`,
                sub,
                data,
                this.httpContext,
              );
              mailOptions.envelope = {
                from: bounceEmail,
                to: data.userChannelId,
              };
            }
            await this.sendEmail(mailOptions);
            await updateBounces(data.userChannelId as string, data);
            return;
          }
        }
      }
      case true: {
        const broadcastSubscriberChunkSize = this.appConfig.notification
          ?.broadcastSubscriberChunkSize;
        const broadcastSubRequestBatchSize = this.appConfig.notification
          ?.broadcastSubRequestBatchSize;
        const guaranteedBroadcastPushDispatchProcessing = this.appConfig
          .notification?.guaranteedBroadcastPushDispatchProcessing;
        let startIdx: undefined | number;
        try {
          startIdx = await this.httpContext.get('NotifyBC.startIdx');
        } catch (ex) {}
        enum NotificationDispatchStatusField {
          failed,
          successful,
        }
        const updateBroadcastPushNotificationStatus = async (
          field: NotificationDispatchStatusField,
          payload: any,
        ) => {
          let success = false;
          while (!success) {
            try {
              if (
                this.notificationRepository.dataSource.connector?.name ===
                'mongodb'
              ) {
                const val =
                  payload instanceof Array ? {$each: payload} : payload;
                await this.notificationRepository.updateById(
                  data.id,
                  {
                    $push: {
                      ['dispatch.' +
                      NotificationDispatchStatusField[field]]: val,
                    },
                  },
                  undefined,
                );
                success = true;
                return;
              } else {
                const currentNotification = await this.notificationRepository.findById(
                  data.id,
                  {
                    fields: ['dispatch'],
                  },
                  undefined,
                );
                currentNotification.dispatch =
                  currentNotification.dispatch ?? {};
                currentNotification.dispatch[
                  NotificationDispatchStatusField[field]
                ] =
                  currentNotification.dispatch[
                    NotificationDispatchStatusField[field]
                  ] ?? [];
                const currentVal: any[] =
                  currentNotification.dispatch[
                    NotificationDispatchStatusField[field]
                  ];
                if (payload instanceof Array) {
                  currentNotification.dispatch[
                    NotificationDispatchStatusField[field]
                  ] = currentVal.concat(payload);
                } else {
                  currentVal.push(payload);
                }
                await this.notificationRepository.updateById(
                  data.id,
                  {dispatch: currentNotification.dispatch},
                  undefined,
                );
                success = true;
              }
            } catch (ex) {}
            await sleep(1000);
          }
        };
        const broadcastToSubscriberChunk = async () => {
          const subChunk = (data.dispatch.candidates as string[]).slice(
            startIdx,
            startIdx + broadcastSubscriberChunkSize,
          );
          _.pullAll(
            _.pullAll(
              subChunk,
              (data.dispatch?.failed ?? []).map((e: any) => e.subscriptionId),
            ),
            data.dispatch?.successful ?? [],
          );
          const subscribers = await this.subscriptionRepository.find(
            {
              where: {
                id: {inq: subChunk},
              },
            },
            undefined,
          );
          const jmespathSearchOpts: AnyObject = {};
          const ft = this.appConfig.notification
            ?.broadcastCustomFilterFunctions;
          if (ft) {
            jmespathSearchOpts.functionTable = ft;
          }
          const notificationMsgCB = async (err: any, e: Subscription) => {
            if (err) {
              return updateBroadcastPushNotificationStatus(
                NotificationDispatchStatusField.failed,
                {
                  subscriptionId: e.id,
                  userChannelId: e.userChannelId,
                  error: err,
                },
              );
            } else if (
              guaranteedBroadcastPushDispatchProcessing ||
              handleBounce
            ) {
              return updateBroadcastPushNotificationStatus(
                NotificationDispatchStatusField.successful,
                e.id,
              );
            }
          };
          await Promise.all(
            subscribers.map(async e => {
              if (e.broadcastPushNotificationFilter && data.data) {
                let match;
                try {
                  match = await jmespath.search(
                    [data.data],
                    '[?' + e.broadcastPushNotificationFilter + ']',
                    jmespathSearchOpts,
                  );
                } catch (ex) {}
                if (!match || match.length === 0) {
                  return;
                }
              }
              if (e.data && data.broadcastPushNotificationSubscriptionFilter) {
                let match;
                try {
                  match = await jmespath.search(
                    [e.data],
                    '[?' +
                      data.broadcastPushNotificationSubscriptionFilter +
                      ']',
                    jmespathSearchOpts,
                  );
                } catch (ex) {}
                if (!match || match.length === 0) {
                  return;
                }
              }
              const textBody =
                data.message.textBody &&
                this.mailMerge(
                  data.message.textBody,
                  e,
                  data,
                  this.httpContext,
                );
              switch (e.channel) {
                case 'sms':
                  try {
                    await this.sendSMS(e.userChannelId, textBody, e);
                    return await notificationMsgCB(null, e);
                  } catch (ex) {
                    return await notificationMsgCB(ex, e);
                  }
                  break;
                default: {
                  const subject =
                    data.message.subject &&
                    this.mailMerge(
                      data.message.subject,
                      e,
                      data,
                      this.httpContext,
                    );
                  const htmlBody =
                    data.message.htmlBody &&
                    this.mailMerge(
                      data.message.htmlBody,
                      e,
                      data,
                      this.httpContext,
                    );
                  const unsubscriptUrl = this.mailMerge(
                    '{unsubscription_url}',
                    e,
                    data,
                    this.httpContext,
                  );
                  let listUnsub = unsubscriptUrl;
                  if (handleListUnsubscribeByEmail && inboundSmtpServerDomain) {
                    const unsubEmail =
                      this.mailMerge(
                        'un-{subscription_id}-{unsubscription_code}@',
                        e,
                        data,
                        this.httpContext,
                      ) + inboundSmtpServerDomain;
                    listUnsub = [[unsubEmail, unsubscriptUrl]];
                  }
                  const mailOptions: AnyObject = {
                    from: data.message.from,
                    to: e.userChannelId,
                    subject: subject,
                    text: textBody,
                    html: htmlBody,
                    list: {
                      id:
                        data.httpHost +
                        '/' +
                        encodeURIComponent(data.serviceName),
                      unsubscribe: listUnsub,
                    },
                  };
                  if (handleBounce && inboundSmtpServerDomain) {
                    const bounceEmail = this.mailMerge(
                      `bn-{subscription_id}-{unsubscription_code}@${inboundSmtpServerDomain}`,
                      e,
                      data,
                      this.httpContext,
                    );
                    mailOptions.envelope = {
                      from: bounceEmail,
                      to: e.userChannelId,
                    };
                  }
                  try {
                    await this.sendEmail(mailOptions);
                    return await notificationMsgCB(null, e);
                  } catch (ex) {
                    return await notificationMsgCB(ex, e);
                  }
                }
              }
            }),
          );
        };
        if (typeof startIdx !== 'number') {
          // main request
          const postBroadcastProcessing = async () => {
            data = await this.notificationRepository.findById(
              data.id,
              undefined,
              undefined,
            );
            const res = await this.subscriptionRepository.find(
              {
                fields: {
                  userChannelId: true,
                },
                where: {
                  id: {
                    inq: data.dispatch?.successful,
                  },
                },
              },
              undefined,
            );
            const userChannelIds = res.map(e => e.userChannelId);
            const errUserChannelIds = (data.dispatch?.failed || []).map(
              (e: {userChannelId: any}) => e.userChannelId,
            );
            _.pullAll(userChannelIds, errUserChannelIds);
            await updateBounces(userChannelIds, data);

            if (!data.asyncBroadcastPushNotification) {
              return;
            } else {
              if (data.state !== 'error') {
                data.state = 'sent';
              }
              await this.notificationRepository.updateById(
                data.id,
                {state: data.state},
                {
                  httpContext: this.httpContext,
                },
              );
              if (typeof data.asyncBroadcastPushNotification === 'string') {
                const options = {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                };
                try {
                  await request.post(
                    data.asyncBroadcastPushNotification,
                    data,
                    options,
                  );
                } catch (ex) {}
              }
            }
          };

          const subCandidates = await this.subscriptionRepository.find(
            {
              where: {
                serviceName: data.serviceName,
                state: 'confirmed',
                channel: data.channel,
              },
              fields: ['id'],
            },
            undefined,
          );
          data.dispatch = data.dispatch ?? {};
          data.dispatch.candidates =
            data.dispatch.candidates ?? subCandidates.map(e => e.id);
          await this.notificationRepository.updateById(
            data.id,
            {state: 'sending', dispatch: data.dispatch},
            undefined,
          );

          const count = subCandidates.length;

          if (count <= broadcastSubscriberChunkSize) {
            startIdx = 0;
            await broadcastToSubscriberChunk();
            await postBroadcastProcessing();
          } else {
            // call broadcastToSubscriberChunk, coordinate output
            const chunks = Math.ceil(count / broadcastSubscriberChunkSize);
            let httpHost = this.appConfig.internalHttpHost;
            const restApiRoot = this.appConfig.restApiRoot ?? '';
            if (!httpHost) {
              httpHost =
                data.httpHost ||
                this.httpContext.request.protocol +
                  '://' +
                  this.httpContext.request.get('host');
            }

            const q = queue(async (task: {startIdx: string}) => {
              const uri =
                httpHost +
                restApiRoot +
                '/notifications/' +
                data.id +
                '/broadcastToChunkSubscribers?start=' +
                task.startIdx;
              const response = await request.get(uri);
              if (response.status < 300) {
                return response.data;
              }
              throw new HttpErrors[response.status]();
            }, broadcastSubRequestBatchSize);
            // re-submit task on error if
            // guaranteedBroadcastPushDispatchProcessing.
            // See issue #39
            let failedChunks: any[] = [];
            q.error((_err: any, task: any) => {
              if (guaranteedBroadcastPushDispatchProcessing) {
                q.push(task);
              } else {
                data.state = 'error';
                // mark all chunk subs as failed
                const subChunk = (data.dispatch.candidates as string[]).slice(
                  task.startIdx,
                  task.startIdx + broadcastSubscriberChunkSize,
                );
                failedChunks = failedChunks.concat(
                  subChunk.map(e => {
                    return {subscriptionId: e};
                  }),
                );
              }
            });
            let i = 0;
            while (i < chunks) {
              q.push({
                startIdx: i++ * broadcastSubscriberChunkSize,
              });
            }
            await q.drain();
            if (failedChunks.length > 0) {
              await updateBroadcastPushNotificationStatus(
                NotificationDispatchStatusField.failed,
                failedChunks,
              );
            }
            await postBroadcastProcessing();
          }
        } else {
          return broadcastToSubscriberChunk();
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
        if (
          res.invalidBefore &&
          Date.parse(res.invalidBefore) > new Date().valueOf()
        ) {
          return res;
        }
        if (!res.httpHost) {
          res.httpHost = this.appConfig.httpHost;
          if (!res.httpHost && this.httpContext.request) {
            res.httpHost =
              this.httpContext.request.protocol +
              '://' +
              this.httpContext.request.get('host');
          }
        }
        try {
          if (res.isBroadcast && res.asyncBroadcastPushNotification) {
            // async
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.sendPushNotification(res);
            return res;
          } else {
            await this.sendPushNotification(res);
            res.state = 'sent';
          }
        } catch (errSend: any) {
          res.state = 'error';
        }
        await this.notificationRepository.updateById(
          res.id,
          {state: res.state},
          {
            httpContext: this.httpContext,
          },
        );
        break;
      default:
        break;
    }
    return this.notificationRepository.findById(res.id, undefined, undefined);
  }

  public async preCreationValidation(data: Partial<Notification>) {
    if (!(await this.configurationRepository.isAdminReq(this.httpContext))) {
      throw new HttpErrors[403]();
    }
    if (
      !data.isBroadcast &&
      data.skipSubscriptionConfirmationCheck &&
      !data.userChannelId
    ) {
      throw new HttpErrors[403]('invalid user');
    }
    let filter = data.broadcastPushNotificationSubscriptionFilter;
    if (data.isBroadcast && data.channel !== 'inApp' && filter) {
      filter = '[?' + filter + ']';
      try {
        jmespath.compile(filter);
      } catch (ex) {
        throw new HttpErrors[400]('invalid broadcastPushNotificationFilter');
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
      throw new HttpErrors[403]('invalid user');
    }
    // validate userChannelId/userId of a unicast push notification against subscription data
    const whereClause: Where<Notification> = {
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
        regexp: escapedUserChannelIdRegExp,
      };
    }
    if (data.userId) {
      whereClause.userId = data.userId;
    }

    try {
      const subscription = await this.subscriptionRepository.findOne(
        {
          where: whereClause,
        },
        undefined,
      );
      if (!subscription) {
        throw new HttpErrors[403]('invalid user');
      }
      // in case request supplies userId instead of userChannelId
      data.userChannelId = subscription?.userChannelId;
      this.httpContext.bind('NotifyBC.subscription').to(subscription);
    } catch (ex) {
      throw new HttpErrors[403]('invalid user');
    }
  }
}
