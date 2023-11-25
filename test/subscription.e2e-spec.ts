import { NestExpressApplication } from '@nestjs/platform-express';
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
