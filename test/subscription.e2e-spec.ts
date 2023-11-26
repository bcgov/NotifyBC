import { NestExpressApplication } from '@nestjs/platform-express';
import { BaseController } from 'src/api/common/base.controller';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { SubscriptionsService } from 'src/api/subscriptions/subscriptions.service';
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
