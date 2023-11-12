import { NestExpressApplication } from '@nestjs/platform-express';
import { compare } from 'bcryptjs';
import { AdministratorsService } from 'src/api/administrators/administrators.service';
import { AppConfigService } from 'src/config/app-config.service';
import supertest from 'supertest';
import { getAppAndClient } from './test-helper';

describe('Administrator API', () => {
  let client: supertest.SuperTest<supertest.Test>;
  let app: NestExpressApplication;
  const VALID_PASSWORD = '1aA@aaaaaa';
  let administratorsService: AdministratorsService;
  beforeEach(() => {
    ({ app, client } = getAppAndClient());
    administratorsService = app.get<AdministratorsService>(
      AdministratorsService,
    );
  });
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

    it('should be allowed by admin user', async function () {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origAdminIPs = appConfig.adminIps;
      appConfig.adminIps = ['127.0.0.1'];

      const res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: VALID_PASSWORD,
      });
      expect(res.status).toEqual(200);
      const admin = await administratorsService.findById(res.body.id, {
        include: ['userCredential'],
      });
      expect(admin.email).toEqual(res.body.email);
      const passwordMatched = await compare(
        VALID_PASSWORD,
        admin.userCredential.password,
      );
      expect(passwordMatched).toBeTruthy();
      appConfig.adminIps = origAdminIPs;
    });

    it("should forbid if password doesn't meet complexity rules", async function () {
      const appConfig = app.get<AppConfigService>(AppConfigService).get();
      const origAdminIPs = appConfig.adminIps;
      appConfig.adminIps = ['127.0.0.1'];

      let res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: 'Too_sh0rt',
      });
      expect(res.status).toEqual(400);
      expect(res.text).toMatch('must match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: 'No__number',
      });
      expect(res.status).toEqual(400);
      expect(res.text).toMatch('must match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: '1no_uppercase',
      });
      expect(res.status).toEqual(400);
      expect(res.text).toMatch('must match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: '1NO_LOWERCASE',
      });
      expect(res.status).toEqual(400);
      expect(res.text).toMatch('must match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: '1NoSpecialChar',
      });
      expect(res.status).toEqual(400);
      expect(res.text).toMatch('must match pattern');
      appConfig.adminIps = origAdminIPs;
    });
  });
});
