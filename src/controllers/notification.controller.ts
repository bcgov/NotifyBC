import {CoreBindings, inject, intercept} from '@loopback/core';
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
import {AuthenticatedOrAdminInterceptor} from '../interceptors';
import {Notification} from '../models';
import {
  BounceRepository,
  ConfigurationRepository,
  NotificationRepository,
  SubscriptionRepository,
} from '../repositories';
import {BaseController} from './base.controller';
const jmespath = require('jmespath');
const queue = require('async/queue');

@intercept(AuthenticatedOrAdminInterceptor.BINDING_KEY)
@oas.tags('notification')
export class NotificationController extends BaseController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @repository(BounceRepository)
    public bounceRepository: BounceRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepositoryRepository: SubscriptionRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
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
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotification',
            exclude: ['id'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    return this.notificationRepository.create(notification);
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
    return this.notificationRepository.count(where);
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
    const res = await this.notificationRepository.find(filter);
    if (res.length === 0) {
      return res;
    }
    const currUser = this.configurationRepository.getCurrentUser(
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
  ): Promise<Notification> {
    return this.notificationRepository.findById(id, filter);
  }

  @patch('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PATCH success',
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
      },
    })
    notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.updateById(id, notification);
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
    await this.notificationRepository.replaceById(id, notification);
  }

  @del('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.notificationRepository.deleteById(id);
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
          state: 'active',
          channel: dataNotification.channel,
          userChannelId: userChannelIdQry,
          or: [
            {
              latestNotificationStarted: undefined,
            },
            {
              latestNotificationStarted: {
                lt: dataNotification.updated,
              },
            },
          ],
        },
        {
          latestNotificationStarted: dataNotification.updated,
          latestNotificationEnded: Date.now(),
        },
      );
    };

    switch (data.isBroadcast) {
      case false: {
        const tokenData = _.assignIn(
          {},
          this.httpContext.getSync('NotifyBC.subscription'),
          {
            data: data.data,
          },
        );
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
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
        let startIdx =
          (this.httpContext.getSync('NotifyBC.startIdx') as number) || 0;
        const broadcastToChunkSubscribers = async () => {
          const subscribers = await this.subscriptionRepositoryRepository.find({
            where: {
              serviceName: data.serviceName,
              state: 'confirmed',
              channel: data.channel,
            },
            order: ['created ASC'],
            skip: startIdx,
            limit: broadcastSubscriberChunkSize,
          });
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
          const postBroadcastProcessingCb = () => {
            if (!logSuccessfulBroadcastDispatches) {
              delete data.successfulDispatches;
            }
            if (!data.asyncBroadcastPushNotification) {
              return;
            } else {
              if (data.state !== 'error') {
                data.state = 'sent';
              }
              data.save(
                {
                  httpContext: this.httpContext,
                },
                async function () {
                  if (typeof data.asyncBroadcastPushNotification === 'string') {
                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    };
                    await request.post(
                      data.asyncBroadcastPushNotification,
                      data,
                      options,
                    );
                  }
                },
              );
            }
          };
          const postBroadcastProcessing = async () => {
            const res = await this.subscriptionRepositoryRepository.find({
              fields: {
                userChannelId: true,
              },
              where: {
                id: {
                  inq: data.successfulDispatches,
                },
              },
            });
            const userChannelIds = res.map(e => e.userChannelId);
            const errUserChannelIds = (data.failedDispatches || []).map(
              (e: {userChannelId: any}) => e.userChannelId,
            );
            _.pullAll(userChannelIds, errUserChannelIds);
            await updateBounces(userChannelIds, data);
            postBroadcastProcessingCb();
          };
          const count = (
            await this.subscriptionRepositoryRepository.count({
              serviceName: data.serviceName,
              state: 'confirmed',
              channel: data.channel,
            })
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
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            await postBroadcastProcessing();
          } else {
            // call broadcastToChunkSubscribers, coordinate output
            const chunks = Math.ceil(count / broadcastSubscriberChunkSize);
            let httpHost = this.appConfig.internalHttpHost;
            const restApiRoot = this.appConfig.restApiRoot;
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
                      subs = await this.subscriptionRepositoryRepository.find({
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
                      });
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
          await broadcastToChunkSubscribers();
        }
        break;
      }
    }
  }

  private async dispatchNotification(res: Notification) {
    // send non-inApp notifications immediately
    switch (res.channel) {
      case 'email':
      case 'sms':
        if (
          res.invalidBefore &&
          Date.parse(res.invalidBefore) > new Date().valueOf()
        ) {
          return;
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
        await res.save({
          httpContext: this.httpContext,
        });
        break;
      default:
        break;
    }
  }
}
