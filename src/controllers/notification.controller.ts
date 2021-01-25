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
import {ApplicationConfig} from '..';
import {Notification} from '../models';
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

@authenticate('ipWhitelist', 'accessToken', 'siteMinder')
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
      '200': {
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
      '200': {
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
          latestNotificationStarted: dataNotification.updated,
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
        let sub = {};
        try {
          sub = await this.httpContext.get('NotifyBC.subscription');
        } catch (ex) {}
        const tokenData = _.assignIn({}, sub, {
          data: data.data,
        });
        const textBody =
          data.message.textBody &&
          this.mailMerge(data.message.textBody, tokenData, this.httpContext);
        switch (data.channel) {
          case 'sms':
            await this.sendSMS(
              data.userChannelId as string,
              textBody,
              tokenData,
            );
            return;
          default: {
            const htmlBody =
              data.message.htmlBody &&
              this.mailMerge(
                data.message.htmlBody,
                tokenData,
                this.httpContext,
              );
            const subject =
              data.message.subject &&
              this.mailMerge(data.message.subject, tokenData, this.httpContext);
            const unsubscriptUrl = this.mailMerge(
              '{unsubscription_url}',
              tokenData,
              this.httpContext,
            );
            let listUnsub = unsubscriptUrl;
            if (handleListUnsubscribeByEmail && inboundSmtpServerDomain) {
              const unsubEmail =
                this.mailMerge(
                  'un-{subscription_id}-{unsubscription_code}@',
                  tokenData,
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
                tokenData,
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
        const logSuccessfulBroadcastDispatches = this.appConfig.notification
          ?.logSuccessfulBroadcastDispatches;
        let startIdx: undefined | number;
        try {
          startIdx = await this.httpContext.get('NotifyBC.startIdx');
        } catch (ex) {}
        const broadcastToChunkSubscribers = async () => {
          const subscribers = await this.subscriptionRepository.find(
            {
              where: {
                serviceName: data.serviceName,
                state: 'confirmed',
                channel: data.channel,
              },
              order: ['created ASC'],
              skip: startIdx,
              limit: broadcastSubscriberChunkSize,
            },
            undefined,
          );
          const jmespathSearchOpts: AnyObject = {};
          const ft = this.appConfig.notification
            ?.broadcastCustomFilterFunctions;
          if (ft) {
            jmespathSearchOpts.functionTable = ft;
          }
          const tasks: Promise<any>[] = [];
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
              tasks.push(
                new Promise(resolve => {
                  const notificationMsgCB = function (err: any) {
                    const res: AnyObject = {};
                    if (err) {
                      res.fail = {
                        subscriptionId: e.id,
                        userChannelId: e.userChannelId,
                        error: err,
                      };
                    } else if (
                      logSuccessfulBroadcastDispatches ||
                      handleBounce
                    ) {
                      res.success = e.id;
                    }
                    return resolve(res);
                  };
                  const tokenData = _.assignIn({}, e, {
                    data: data.data,
                  });
                  const textBody =
                    data.message.textBody &&
                    this.mailMerge(
                      data.message.textBody,
                      tokenData,
                      this.httpContext,
                    );
                  switch (e.channel) {
                    case 'sms':
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      this.sendSMS(
                        e.userChannelId,
                        textBody,
                        tokenData,
                        notificationMsgCB,
                      );
                      break;
                    default: {
                      const subject =
                        data.message.subject &&
                        this.mailMerge(
                          data.message.subject,
                          tokenData,
                          this.httpContext,
                        );
                      const htmlBody =
                        data.message.htmlBody &&
                        this.mailMerge(
                          data.message.htmlBody,
                          tokenData,
                          this.httpContext,
                        );
                      const unsubscriptUrl = this.mailMerge(
                        '{unsubscription_url}',
                        tokenData,
                        this.httpContext,
                      );
                      let listUnsub = unsubscriptUrl;
                      if (
                        handleListUnsubscribeByEmail &&
                        inboundSmtpServerDomain
                      ) {
                        const unsubEmail =
                          this.mailMerge(
                            'un-{subscription_id}-{unsubscription_code}@',
                            tokenData,
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
                          tokenData,
                          this.httpContext,
                        );
                        mailOptions.envelope = {
                          from: bounceEmail,
                          to: e.userChannelId,
                        };
                      }
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      this.sendEmail(mailOptions, notificationMsgCB);
                    }
                  }
                }),
              );
            }),
          );
          const resArr = await Promise.all(tasks);
          const ret: AnyObject = {
            fail: [],
            success: [],
          };
          for (const res of resArr) {
            if (res.fail) {
              ret.fail.push(res.fail);
            } else if (res.success) {
              ret.success.push(res.success);
            }
          }
          return ret;
        };
        if (typeof startIdx !== 'number') {
          const postBroadcastProcessing = async () => {
            const res = await this.subscriptionRepository.find(
              {
                fields: {
                  userChannelId: true,
                },
                where: {
                  id: {
                    inq: data.successfulDispatches,
                  },
                },
              },
              undefined,
            );
            const userChannelIds = res.map(e => e.userChannelId);
            const errUserChannelIds = (data.failedDispatches || []).map(
              (e: {userChannelId: any}) => e.userChannelId,
            );
            _.pullAll(userChannelIds, errUserChannelIds);
            await updateBounces(userChannelIds, data);

            if (!logSuccessfulBroadcastDispatches) {
              delete data.successfulDispatches;
            }
            if (!data.asyncBroadcastPushNotification) {
              return;
            } else {
              if (data.state !== 'error') {
                data.state = 'sent';
              }
              await this.notificationRepository.updateById(data.id, data, {
                httpContext: this.httpContext,
              });
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
          const count = (
            await this.subscriptionRepository.count(
              {
                serviceName: data.serviceName,
                state: 'confirmed',
                channel: data.channel,
              },
              undefined,
            )
          ).count;
          if (count <= broadcastSubscriberChunkSize) {
            startIdx = 0;
            const res = await broadcastToChunkSubscribers();
            if (res.fail) {
              data.failedDispatches = res.fail;
            }
            if (res.success) {
              data.successfulDispatches = res.success;
            }
            await postBroadcastProcessing();
          } else {
            // call broadcastToChunkSubscribers, coordinate output
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

            const q = queue(
              (
                task: {startIdx: string},
                cb: (arg0: null, arg1: any) => any,
              ) => {
                const uri =
                  httpHost +
                  restApiRoot +
                  '/notifications/' +
                  data.id +
                  '/broadcastToChunkSubscribers?start=' +
                  task.startIdx;
                request
                  .get(uri)
                  .then(function (response) {
                    const body = response.data;
                    if (response.status === 200) {
                      return cb?.(null, body);
                    }
                    throw new HttpErrors[response.status]();
                  })
                  .catch(async () => {
                    let subs, err;
                    try {
                      subs = await this.subscriptionRepository.find(
                        {
                          where: {
                            serviceName: data.serviceName,
                            state: 'confirmed',
                            channel: data.channel,
                          },
                          order: ['created ASC'],
                          skip: parseInt(task.startIdx),
                          limit: broadcastSubscriberChunkSize,
                          fields: {
                            userChannelId: true,
                          },
                        },
                        undefined,
                      );
                    } catch (ex) {
                      err = ex;
                    }
                    return cb?.(
                      err,
                      subs?.map(e => e.userChannelId),
                    );
                  });
              },
              broadcastSubRequestBatchSize,
            );
            const queuedTasks = [];
            let i = 0;
            while (i < chunks) {
              queuedTasks.push({
                startIdx: i * broadcastSubscriberChunkSize,
              });
              i++;
            }
            q.push(
              queuedTasks,
              function (err: any, res: {success: string | any[]; fail: any}) {
                if (err) {
                  data.state = 'error';
                  return;
                }
                if (res.success && res.success.length > 0) {
                  data.successfulDispatches = (
                    data.successfulDispatches || []
                  ).concat(res.success);
                }
                const failedDispatches = res.fail || res || [];
                if (failedDispatches instanceof Array) {
                  if (failedDispatches.length <= 0) {
                    return;
                  }
                  data.failedDispatches = (data.failedDispatches || []).concat(
                    failedDispatches,
                  );
                } else {
                  data.state = 'error';
                }
              },
            );
            await q.drain();
            await postBroadcastProcessing();
          }
        } else {
          return broadcastToChunkSubscribers();
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
          } else {
            await this.sendPushNotification(res);
            res.state = 'sent';
          }
        } catch (errSend: any) {
          res.state = 'error';
        }
        await this.notificationRepository.updateById(res.id, res, {
          httpContext: this.httpContext,
        });
        break;
      default:
        break;
    }
    return res;
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
