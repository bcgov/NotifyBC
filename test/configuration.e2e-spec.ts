import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import supertest from 'supertest';
import { getAppAndClient, runAsSuperAdmin } from './test-helper';
describe('GET /configuration', () => {
  let client: supertest.SuperTest<supertest.Test>;
  let app: NestExpressApplication;
  let configurationsService: ConfigurationsService;

  beforeEach(() => {
    ({ app, client } = getAppAndClient());
    configurationsService = app.get<ConfigurationsService>(
      ConfigurationsService,
    );
  });

  beforeEach(async function () {
    await configurationsService.create({
      name: 'subscription',
      serviceName: 'myService',
      value: {
        confirmationRequest: {
          sms: {
            textBody: 'enter {confirmation_code}!',
          },
          email: {
            textBody: 'enter {confirmation_code} in email!',
          },
        },
        anonymousUndoUnsubscription: {
          successMessage: 'You have been re-subscribed.',
          failureMessage: 'Error happened while re-subscribing.',
        },
      },
    });
  });

  it('should be forbidden by anonymous user', async function () {
    const res = await client.get('/api/configurations');
    expect(res.status).toEqual(403);
  });
  it('should be allowed by admin user', async function () {
    await runAsSuperAdmin(async () => {
      const res = await client.get('/api/configurations');
      expect(res.status).toEqual(200);
    });
  });
});
