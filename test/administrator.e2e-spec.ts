import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from 'src/config/app-config.service';
import supertest from 'supertest';
import { setupApplication } from './test-helper';

describe('Administrator API', () => {
  let client: supertest.SuperTest<supertest.Test>;
  let app: NestExpressApplication;
  const VALID_PASSWORD = '1aA@aaaaaa';
  beforeEach(async () => {
    ({ app, client } = await setupApplication());
  }, 99999);
  let token: string;

  beforeEach(async function () {
    const appConfig = app.get<AppConfigService>(AppConfigService).get();
    const origAdminIPs = appConfig.adminIps;
    appConfig.adminIps = ['127.0.0.1'];
    let res = await client.post('/api/administrators').send({
      email: 'foo@invalid.local',
      password: VALID_PASSWORD,
    });
    res = await client
      .post('/api/administrators/login')
      .send({
        email: 'foo@invalid.local',
        password: VALID_PASSWORD,
        tokenName: 'myApp',
      })
      .set({ is_anonymous: true });
    token = res.body.token;
    res = await client.post('/api/administrators').send({
      email: 'bar@invalid.local',
      password: VALID_PASSWORD,
    });
    appConfig.adminIps = origAdminIPs;
  });

  describe('POST /administrator', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: VALID_PASSWORD,
      });
      expect(res.status).toEqual(403);
    });
  });
});
