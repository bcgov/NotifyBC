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

import { NestExpressApplication } from '@nestjs/platform-express';
import { merge } from 'lodash';
import { BaseController } from 'src/api/common/base.controller';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { Subscription } from 'src/api/subscriptions/entities/subscription.entity';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
import { AppConfigService } from 'src/config/app-config.service';
import supertest from 'supertest';
import { getAppAndClient, runAsSuperAdmin } from './test-helper';

let app: NestExpressApplication;
let client: supertest.SuperTest<supertest.Test>;
let subscriptionsService: SubscriptionsService;
let configurationsService: ConfigurationsService;

beforeAll(async () => {
  ({ app, client } = getAppAndClient());
  subscriptionsService = app.get<SubscriptionsService>(SubscriptionsService);
  configurationsService = app.get<ConfigurationsService>(ConfigurationsService);
});

describe('GET /subscriptions', () => {
  beforeEach(async () => {
    await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@foo.com',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
  });

  it('should be forbidden by anonymous user', async () => {
    const res = await client.get('/api/subscriptions');
    expect(res.status).toEqual(403);
  });

  it("should return sm user's own subscription", async () => {
    const res = await client
      .get('/api/subscriptions')
      .set('Accept', 'application/json')
      .set('SM_USER', 'baz');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(0);
  });

  it('should have confirmationRequest field removed for sm user requests', async () => {
    const res = await client
      .get('/api/subscriptions')
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].confirmationRequest).toBeUndefined();
  });

  it('should be allowed by admin users', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client.get('/api/subscriptions');
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].confirmationRequest).toBeDefined();
    });
  });
});

describe('POST /subscriptions', function () {
  it('should allow admin users create subscriptions without sending confirmation request', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .post('/api/subscriptions')
        .send({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          confirmationRequest: {
            sendRequest: false,
          },
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(
        BaseController.prototype.sendEmail as unknown as jest.SpyInstance,
      ).not.toBeCalled();
      const data = await subscriptionsService.findAll(
        {
          where: {
            serviceName: 'myService',
            userChannelId: 'bar@foo.com',
          },
        },
        undefined,
      );
      expect(data[0].state).toEqual('confirmed');
    });
  });

  it('should allow admin users create subscriptions and send confirmation request with proper mail merge', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .post('/api/subscriptions')
        .send({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'foo@bar.com',
          unsubscriptionCode: '54321',
          confirmationRequest: {
            from: 'a@b.com',
            subject: 'subject',
            sendRequest: true,
            textBody:
              '{subscription_confirmation_code} {service_name} {http_host} {rest_api_root} {subscription_id} {unsubscription_code} {unsubscription_url} {subscription_confirmation_url} {unsubscription_reversion_url}',
            confirmationCode: '12345',
          },
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      const spiedSendEmail = BaseController.prototype
        .sendEmail as unknown as jest.SpyInstance;
      expect(spiedSendEmail).toBeCalled();
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{subscription_confirmation_code}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{service_name}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{http_host}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{rest_api_root}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{subscription_id}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{unsubscription_code}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{unsubscription_url}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{subscription_confirmation_url}'),
        }),
      );
      expect(spiedSendEmail).not.toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('{unsubscription_reversion_url}'),
        }),
      );

      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('12345'),
        }),
      );
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('myService'),
        }),
      );
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('http://127.0.0.1'),
        }),
      );
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('/api'),
        }),
      );
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('1 '),
        }),
      );
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('54321'),
        }),
      );
      //unsubscription_url
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(
            `/api/subscriptions/${res.body.id}/unsubscribe?unsubscriptionCode=54321`,
          ),
        }),
      );
      //subscription_confirmation_url
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(
            `/api/subscriptions/${res.body.id}/verify?confirmationCode=12345`,
          ),
        }),
      );
      //unsubscription_reversion_url
      expect(spiedSendEmail).toBeCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(
            `/api/subscriptions/${res.body.id}/unsubscribe/undo?unsubscriptionCode=54321`,
          ),
        }),
      );

      const data = await subscriptionsService.findAll(
        {
          where: {
            serviceName: 'myService',
            userChannelId: 'foo@bar.com',
          },
        },
        undefined,
      );
      expect(data.length).toEqual(1);
    });
  });

  it('should generate unsubscription code for subscriptions created by admin user', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .post('/api/subscriptions')
        .send({
          serviceName: 'myService',
          channel: 'sms',
          userChannelId: '12345',
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(
        BaseController.prototype.sendSMS as unknown as jest.SpyInstance,
      ).toBeCalledTimes(1);
      const data = await subscriptionsService.findAll(
        {
          where: {
            serviceName: 'myService',
            userChannelId: '12345',
          },
        },
        undefined,
      );
      expect(data[0].unsubscriptionCode).toMatch(/\d{5}/);
    });
  });

  it('should generate unsubscription code for subscriptions created by admin user with confirmationRequest field populated', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .post('/api/subscriptions')
        .send({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'foo@bar.com',
          confirmationRequest: {
            from: 'foo@invalid.local',
            subject: 'subject',
            sendRequest: true,
            textBody:
              '{subscription_confirmation_code} {service_name} {http_host} {rest_api_root} {subscription_id} {unsubscription_code} {unsubscription_url} {subscription_confirmation_url} {unsubscription_reversion_url}',
            confirmationCodeRegex: '12345',
          },
        })
        .set('Accept', 'application/json');
      expect(res.status).toEqual(200);
      expect(
        BaseController.prototype.sendEmail as unknown as jest.SpyInstance,
      ).toBeCalledTimes(1);
      const data = await subscriptionsService.findAll(
        {
          where: {
            serviceName: 'myService',
            userChannelId: 'foo@bar.com',
          },
        },
        undefined,
      );
      expect(data?.[0]?.confirmationRequest?.confirmationCode).toEqual('12345');
    });
  });

  it('should allow non-admin user create sms subscription using swift provider', async () => {
    const spiedSendSms = (
      BaseController.prototype.sendSMS as unknown as jest.SpyInstance
    ).mockReset();
    const fetchStub = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response());
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(spiedSendSms).toBeCalledTimes(1);
    expect(fetchStub).toBeCalledWith(
      'https://secure.smsgateway.ca/services/message.svc/123/12345',
      expect.anything(),
    );
    expect(
      JSON.parse((fetchStub.mock.calls[0][1] as any).body)['MessageBody'],
    ).toMatch(/Enter \d{5} on screen/);
    const data = await subscriptionsService.findAll(
      {
        where: {
          serviceName: 'myService',
          userChannelId: '12345',
        },
      },
      undefined,
    );
    expect(data[0].unsubscriptionCode).toMatch(/\d{5}/);
  });

  it('should ignore message supplied by non-admin user when creating a subscription', async () => {
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'nobody@invalid.local',
        confirmationRequest: {
          confirmationCodeRegex: '\\d{5}',
          sendRequest: true,
          from: 'nobody@invalid.local',
          subject: 'spoofed subject',
          textBody: 'spoofed body',
          confirmationCode: '41488',
        },
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    const spiedSendEmail = BaseController.prototype
      .sendEmail as unknown as jest.SpyInstance;
    expect(spiedSendEmail).toBeCalledTimes(1);
    const data = await subscriptionsService.findAll(
      {
        where: {
          serviceName: 'myService',
          userChannelId: 'nobody@invalid.local',
        },
      },
      undefined,
    );
    expect(data[0].confirmationRequest?.textBody).not.toMatch('spoofed');
    expect(spiedSendEmail.mock.calls[0][0].subject).not.toMatch('spoofed');
  });

  it('should reject subscriptions with invalid string broadcastPushNotificationFilter', async () => {
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
        broadcastPushNotificationFilter: "a === 'b'",
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
    const data = await subscriptionsService.findAll(
      {
        where: {
          serviceName: 'myService',
          userChannelId: '12345',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(0);
  });

  it('should accept subscriptions with valid broadcastPushNotificationFilter', async () => {
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
        broadcastPushNotificationFilter: "a == 'b'",
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(
      BaseController.prototype.sendSMS as unknown as jest.SpyInstance,
    ).toBeCalledTimes(1);
    const data = await subscriptionsService.findAll(
      {
        where: {
          serviceName: 'myService',
          userChannelId: '12345',
        },
      },
      undefined,
    );
    expect(data[0].unsubscriptionCode).toMatch(/\d{5}/);
  });

  it('should detect duplicated subscription', async () => {
    jest
      .spyOn(BaseController.prototype, 'getMergedConfig')
      .mockImplementation(async function (...args) {
        const res = {
          detectDuplicatedSubscription: true,
          duplicatedSubscriptionNotification: {
            email: {
              from: 'no_reply@invalid.local',
              subject: 'Duplicated Subscription',
              textBody:
                'A duplicated subscription was submitted and rejected. you will continue receiving notifications. If the request was not created by you, please ignore this message.',
            },
          },
          confirmationRequest: {
            email: {
              confirmationCodeRegex: '\\d{5}',
              sendRequest: true,
              from: 'no_reply@invalid.local',
              subject: 'Subscription confirmation',
              textBody: 'Enter {subscription_confirmation_code} on screen',
            },
          },
          anonymousUnsubscription: {
            code: {
              required: true,
              regex: '\\d{5}',
            },
          },
        };
        const cb = args[args.length - 1];
        if (typeof cb === 'function') {
          return process.nextTick(cb, null, res);
        } else {
          return res;
        }
      });

    await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@invalid.local',
      state: 'confirmed',
    });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@invalid.local',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    const spiedSendEmail = BaseController.prototype
      .sendEmail as unknown as jest.SpyInstance;
    expect(spiedSendEmail).toBeCalled();
    expect(spiedSendEmail).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('A duplicated subscription'),
      }),
    );
    const data = await subscriptionsService.findAll(
      {
        where: {
          serviceName: 'myService',
          channel: 'email',
          state: 'unconfirmed',
          userChannelId: 'bar@invalid.local',
        },
      },
      undefined,
    );
    expect(data.length).toEqual(1);
  });
});

describe('PATCH /subscriptions/{id}', () => {
  let subscriptionId;
  beforeEach(async () => {
    const res = await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@foo.com',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
    subscriptionId = res.id;
  });

  it('should allow sm users change their user channel id', async () => {
    const res = await client
      .patch(`/api/subscriptions/${subscriptionId}`)
      .send({
        userChannelId: 'baz@foo.com',
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.body.state).toEqual('unconfirmed');
    expect(res.body.userChannelId).toEqual('baz@foo.com');
  });

  it("should deny sm user from changing other user's subscription", async () => {
    const res = await client
      .patch(`/api/subscriptions/${subscriptionId}`)
      .send({
        userChannelId: 'baz@foo.com',
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'baz');
    expect(res.status).toEqual(404);
  });

  it("should deny anonymous user's access", async () => {
    const res = await client
      .patch(`/api/subscriptions/${subscriptionId}`)
      .send({
        userChannelId: 'baz@foo.com',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });
});

describe('GET /subscriptions/{id}/verify', () => {
  let data: Subscription[];
  beforeEach(async () => {
    data = await Promise.all([
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@foo.com',
        state: 'unconfirmed',
        confirmationRequest: {
          confirmationCode: '37688',
        },
      }),
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'unconfirmed',
        confirmationRequest: {
          confirmationCode: '37689',
        },
      }),
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
      }),
    ]);
  });

  it('should verify confirmation code sent by sm user', async () => {
    let res: any = await client
      .get(`/api/subscriptions/${data[0].id}/verify?confirmationCode=37688`)
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[0].id);
    expect(res.state).toEqual('confirmed');
  });

  it('should verify confirmation code sent by anonymous user', async () => {
    let res: any = await client.get(
      `/api/subscriptions/${data[1].id}/verify?confirmationCode=37689`,
    );
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[1].id);
    expect(res.state).toEqual('confirmed');
  });

  it('should deny incorrect confirmation code', async () => {
    let res: any = await client.get(
      `/api/subscriptions/${data[1].id}/verify?confirmationCode=0000`,
    );
    expect(res.status).toEqual(403);
    res = await subscriptionsService.findById(data[1].id);
    expect(res.state).toEqual('unconfirmed');
  });

  it('should unsubscribe existing subscriptions when replace parameter is supplied', async () => {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[1].id +
        '/verify?confirmationCode=37689&replace=true',
    );
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[2].id);
    expect(res.state).toEqual('deleted');
  });
});

describe('DELETE /subscriptions/{id}', () => {
  let data: any[];
  beforeEach(async () => {
    data = await Promise.all([
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        confirmationRequest: {
          confirmationCodeRegex: '\\d{5}',
          sendRequest: true,
          from: 'no_reply@invlid.local',
          subject: 'Subscription confirmation',
          textBody: 'enter {confirmation_code} in this email',
          confirmationCode: '37688',
        },
      }),
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        confirmationRequest: {
          confirmationCodeRegex: '\\d{5}',
          sendRequest: true,
          from: 'no_reply@invlid.local',
          subject: 'Subscription confirmation',
          textBody: 'enter {confirmation_code} in this email',
          confirmationCode: '37689',
        },
        unsubscriptionCode: '50032',
      }),
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'unconfirmed',
        confirmationRequest: {
          confirmationCodeRegex: '\\d{5}',
          sendRequest: true,
          from: 'no_reply@invlid.local',
          subject: 'Subscription confirmation',
          textBody: 'enter {confirmation_code} in this email',
          confirmationCode: '37689',
        },
      }),
      subscriptionsService.create({
        serviceName: 'redirectAck',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        unsubscriptionCode: '12345',
      }),
      subscriptionsService.create({
        serviceName: 'redirectAck',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'deleted',
        unsubscriptionCode: '12345',
      }),
      configurationsService.create({
        name: 'subscription',
        serviceName: 'redirectAck',
        value: {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: {
                redirectUrl: 'http://nowhere',
              },
            },
          },
        },
      }),
    ]);
  });

  it('should allow unsubscription by sm user', async () => {
    let res: any = await client
      .delete('/api/subscriptions/' + data[0].id)
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[0].id);
    expect(res.state).toEqual('deleted');
  });

  it('should allow unsubscription by anonymous user', async () => {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[1].id +
          '/unsubscribe?unsubscriptionCode=50032',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[1].id);
    expect(res.state).toEqual('deleted');
  });

  it('should deny unsubscription by anonymous user with incorrect unsubscriptionCode', async () => {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[1].id +
          '/unsubscribe?unsubscriptionCode=50033',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
    res = await subscriptionsService.findById(data[1].id);
    expect(res.state).toEqual('confirmed');
  });

  it('should deny unsubscription if state is not confirmed', async () => {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[2].id +
          '/unsubscribe?unsubscriptionCode=50033',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
    res = await subscriptionsService.findById(data[2].id);
    expect(res.state).toEqual('unconfirmed');
  });

  it('should deny unsubscription by another sm user', async () => {
    let res: any = await client
      .delete('/api/subscriptions/' + data[0].id)
      .set('Accept', 'application/json')
      .set('SM_USER', 'baz');
    expect(res.status).toEqual(404);
    res = await subscriptionsService.findById(data[0].id);
    expect(res.state).toEqual('confirmed');
  });

  it('should redirect onscreen acknowledgements', async () => {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[3].id +
          '/unsubscribe?unsubscriptionCode=12345',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(302);
    expect(res.header.location).toEqual('http://nowhere?channel=email');
    res = await subscriptionsService.findById(data[3].id);
    expect(res.state).toEqual('deleted');
  });

  it('should redirect onscreen acknowledgements with error', async () => {
    jest
      .spyOn(BaseController.prototype, 'getMergedConfig')
      .mockImplementation(async function () {
        return {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: {
                redirectUrl: 'http://nowhere',
              },
            },
          },
        };
      });

    const res = await client
      .get(
        '/api/subscriptions/' +
          data[4].id +
          '/unsubscribe?unsubscriptionCode=12345',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(302);
    expect(res.header.location).toMatch(
      /http:\/\/nowhere\?channel=email\&err=.+/,
    );
  });

  it('should display onScreen acknowledgements failureMessage', async () => {
    jest
      .spyOn(BaseController.prototype, 'getMergedConfig')
      .mockImplementation(async function () {
        return {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: {
                failureMessage: 'fail',
              },
            },
          },
        };
      });

    const res = await client
      .get(
        '/api/subscriptions/' +
          data[4].id +
          '/unsubscribe?unsubscriptionCode=12345',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
    expect(res.text).toEqual('fail');
    expect(res.type).toEqual('text/plain');
  });
});

describe('GET /subscriptions/{id}/unsubscribe', () => {
  let data: Subscription[];
  beforeEach(async function () {
    data = await Promise.all([
      subscriptionsService.create({
        serviceName: 'myService1',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        unsubscriptionCode: '12345',
      }),
      subscriptionsService.create({
        serviceName: 'myService2',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        unsubscriptionCode: '54321',
      }),
      subscriptionsService.create({
        serviceName: 'myService3',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        unsubscriptionCode: '11111',
      }),
    ]);
  });

  it('should allow bulk unsubscribing all services', async () => {
    jest
      .spyOn(BaseController.prototype, 'getMergedConfig')
      .mockImplementation(async function () {
        return {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: { successMessage: '' },
              notification: {
                email: {
                  from: 'no_reply@invalid.local',
                  subject: '',
                  textBody: '{unsubscription_service_names}',
                  htmlBody: '{unsubscription_service_names}',
                },
              },
            },
          },
        };
      });

    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe?unsubscriptionCode=12345&additionalServices=_all',
    );
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findAll(
      {
        where: {
          state: 'deleted',
        },
      },
      undefined,
    );
    expect(res.length).toEqual(3);
    expect(
      BaseController.prototype.sendEmail as unknown as jest.SpyInstance,
    ).toBeCalledWith(
      expect.objectContaining({
        text: expect.stringMatching(
          /services myService\d, myService\d and myService\d/,
        ),
      }),
    );
  });

  it('should allow bulk unsubscribing selected additional service', async () => {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe?unsubscriptionCode=12345&additionalServices=myService3',
    );
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findAll(
      {
        where: {
          state: 'deleted',
        },
      },
      undefined,
    );
    expect(res.length).toEqual(2);
  });

  it('should allow bulk unsubscribing selected additional service as an array', async () => {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe?unsubscriptionCode=12345&additionalServices[]=myService3',
    );
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findAll(
      {
        where: {
          state: 'deleted',
        },
      },
      undefined,
    );
    expect(res.length).toEqual(2);
  });
});

describe('GET /subscriptions/{id}/unsubscribe/undo', () => {
  let data: Subscription[] = [];
  beforeEach(async () => {
    const data0 = await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'email',
      userChannelId: 'bar@foo.com',
      state: 'deleted',
      unsubscriptionCode: '50032',
    });
    const promiseAllRes = await Promise.all([
      subscriptionsService.create({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'unconfirmed',
        confirmationRequest: {
          confirmationCodeRegex: '\\d{5}',
          sendRequest: true,
          from: 'no_reply@invlid.local',
          subject: 'Subscription confirmation',
          textBody: 'enter {confirmation_code} in this email',
          confirmationCode: '37689',
        },
        unsubscriptionCode: '50032',
      }),
      subscriptionsService.create({
        serviceName: 'myService2',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'deleted',
        unsubscriptionCode: '12345',
        unsubscribedAdditionalServices: {
          names: ['myService'],
          ids: [data0.id],
        },
      }),
    ]);
    data = [data0, ...promiseAllRes];
  });

  it('should allow undelete subscription by anonymous user', async () => {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[0].id +
          '/unsubscribe/undo?unsubscriptionCode=50032',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[0].id);
    expect(res.state).toEqual('confirmed');
  });

  it('should forbid undelete subscription by anonymous user with incorrect unsubscriptionCode', async () => {
    const res = await client
      .get(
        '/api/subscriptions/' +
          data[0].id +
          '/unsubscribe/undo?unsubscriptionCode=50033',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
    const sub = await subscriptionsService.findById(data[0].id);
    expect(sub.state).toEqual('deleted');
  });

  it('should forbid undelete subscription where state is not deleted', async () => {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[1].id +
          '/unsubscribe/undo?unsubscriptionCode=50032',
      )
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
    res = await subscriptionsService.findById(data[1].id);
    expect(res.state).toEqual('unconfirmed');
  });

  it('should redirect response if set so', async () => {
    await configurationsService.create({
      name: 'subscription',
      serviceName: 'myService',
      value: {
        anonymousUndoUnsubscription: {
          redirectUrl: 'http://nowhere',
        },
      },
    });
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe/undo?unsubscriptionCode=50032',
    );
    expect(res.status).toEqual(302);
    expect(res.headers.location).toEqual('http://nowhere?channel=email');
    res = await subscriptionsService.findById(data[0].id);
    expect(res.state).toEqual('confirmed');
  });

  it('should allow bulk undo unsubscriptions by anonymous user', async () => {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[2].id +
        '/unsubscribe/undo?unsubscriptionCode=12345',
    );
    expect(res.status).toEqual(200);
    res = await subscriptionsService.findById(data[0].id);
    expect(res.state).toEqual('confirmed');
    res = await subscriptionsService.findById(data[2].id);
    expect(res.unsubscribedAdditionalServices).toBeUndefined();
  });
});

describe('PUT /subscriptions/{id}', () => {
  let subscriptionId;
  beforeEach(async function () {
    const res = await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@invalid.local',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
    subscriptionId = res.id;
  });

  it('should allow admin user replace subscription', async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .put(`/api/subscriptions/${subscriptionId}`)
        .send({
          serviceName: 'myService',
          channel: 'email',
          userId: 'bar',
          userChannelId: 'bar@invalid.local',
          state: 'deleted',
          unsubscriptionCode: '50033',
        })
        .set('Accept', 'application/json');
      expect(res.body.state).toEqual('deleted');
      expect(res.body.confirmationRequest).toBeUndefined();
    });
  });

  it('should deny anonymous user replace subscription', async () => {
    const res = await client
      .put(`/api/subscriptions/${subscriptionId}`)
      .send({
        serviceName: 'myService',
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@invalid.local',
        state: 'deleted',
        unsubscriptionCode: '50032',
      })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });
});

describe('GET /subscriptions/services', () => {
  beforeEach(async () => {
    await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@invalid.local',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
  });

  it(`should allow admin user's access`, async () => {
    await runAsSuperAdmin(async () => {
      const res = await client
        .get('/api/subscriptions/services')
        .set('Accept', 'application/json');
      expect(res.body instanceof Array).toEqual(true);
      expect(res.body.length).toEqual(1);
    });
  });

  it("should deny anonymous user's access", async () => {
    const res = await client
      .get('/api/subscriptions/services')
      .set('Accept', 'application/json');
    expect(res.status).toEqual(403);
  });
});

describe('POST /subscriptions/swift', () => {
  let appConfig, origSmsConfig, subscriptionId;
  beforeAll(async function () {
    appConfig = app.get<AppConfigService>(AppConfigService).get();
    origSmsConfig = appConfig.sms;
    const newSmsConfig = merge({}, origSmsConfig, {
      providerSettings: { swift: { notifyBCSwiftKey: '12345' } },
    });
    appConfig.sms = newSmsConfig;
  });
  afterAll(async function () {
    appConfig.sms = origSmsConfig;
  });
  beforeEach(async function () {
    const res = await subscriptionsService.create({
      serviceName: 'myService',
      channel: 'sms',
      userChannelId: '250-000-0000',
      state: 'confirmed',
      unsubscriptionCode: '12345',
    });
    subscriptionId = res.id;
  });

  it(`should unsubscribe with valid id reference`, async () => {
    let res: any = await client.post('/api/subscriptions/swift').send({
      Reference: subscriptionId,
      PhoneNumber: '12500000000',
      notifyBCSwiftKey: '12345',
    });
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('You have been un-subscribed.');
    res = await subscriptionsService.findById(subscriptionId);
    expect(res.state).toEqual('deleted');
  });

  it(`should unsubscribe with valid phone number`, async () => {
    let res: any = await client.post('/api/subscriptions/swift').send({
      PhoneNumber: '12500000000',
      notifyBCSwiftKey: '12345',
    });
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('You have been un-subscribed.');
    res = await subscriptionsService.findById(subscriptionId);
    expect(res.state).toEqual('deleted');
  });

  it(`should deny invalid swift key`, async () => {
    let res: any = await client.post('/api/subscriptions/swift').send({
      Reference: subscriptionId,
      PhoneNumber: '12500000000',
      notifyBCSwiftKey: 'invalid',
    });
    expect(res.status).toEqual(403);
    res = await subscriptionsService.findById(subscriptionId);
    expect(res.state).toEqual('confirmed');
  });
});
