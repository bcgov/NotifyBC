import { NestExpressApplication } from '@nestjs/platform-express';
import { compare } from 'bcryptjs';
import { AdministratorsService } from 'src/api/administrators/administrators.service';
import supertest from 'supertest';
import { getAppAndClient, runAsSuperAdmin } from './test-helper';

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
  let id1: string, id2: string;

  beforeEach(async function () {
    await runAsSuperAdmin(async () => {
      let res = await client.post('/api/administrators').send({
        email: 'foo@invalid.local',
        password: VALID_PASSWORD,
      });
      id1 = res.body.id;
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
      id2 = res.body.id;
    });
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
      await runAsSuperAdmin(async () => {
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
      });
    });

    it("should forbid if password doesn't meet complexity rules", async function () {
      await runAsSuperAdmin(async () => {
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
      });
    });

    it('should forbid duplicated email address', async function () {
      await runAsSuperAdmin(async () => {
        const res = await client.post('/api/administrators').send({
          email: 'foo@invalid.local',
          password: VALID_PASSWORD,
        });
        expect(res.status).toEqual(400);
        expect(res.text).toContain('duplicate key');
      });
    });
  });

  describe('POST /administrator/login', function () {
    it('should allow anonymous user', async function () {
      const res = await client.post('/api/administrators/login').send({
        email: 'bar@invalid.local',
        password: VALID_PASSWORD,
        tokenName: 'myApp',
      });
      expect(res.status).toEqual(200);
      const admin = await administratorsService.findOne({
        where: {
          email: 'bar@invalid.local',
        },
        include: ['accessTokens'],
      });
      expect(admin?.accessTokens[0]?.id).toEqual(res.body.token);
      expect(res.body.token).toHaveLength(64);
    });
  });

  describe('GET /administrator', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.get('/api/administrators');
      expect(res.status).toEqual(403);
    });
    it('should allow super-admin user', async function () {
      await runAsSuperAdmin(async () => {
        const res = await client.get('/api/administrators');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2);
      });
    });
    it('should allow own record only for admin user', async function () {
      const res = await client
        .get('/api/administrators')
        .set('Authorization', token);
      expect(res.body.length).toEqual(1);
    });
  });

  describe('GET /administrator/{id}', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.get('/api/administrators/1');
      expect(res.status).toEqual(403);
    });
    it('should allow super-admin user', async function () {
      await runAsSuperAdmin(async () => {
        const res = await client.get(`/api/administrators/${id1}`);
        expect(res.status).toEqual(200);
        expect(res.body.email).toEqual('foo@invalid.local');
      });
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .get(`/api/administrators/${id1}`)
        .set('Authorization', token);
      expect(res.status).toEqual(200);
      expect(res.body.email).toEqual('foo@invalid.local');
      res = await client
        .get(`/api/administrators/${id2}`)
        .set('Authorization', token);
      expect(res.status).toEqual(403);
    });
  });

  describe('DELETE /administrator/{id}', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.delete(`/api/administrators/${id1}`);
      expect(res.status).toEqual(403);
    });
    it('should allow super-admin user', async function () {
      await runAsSuperAdmin(async () => {
        const res = await client.delete(`/api/administrators/${id1}`);
        expect(res.status).toEqual(204);
      });
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .delete(`/api/administrators/${id2}`)
        .set('Authorization', token);
      expect(res.status).toEqual(403);
      res = await client
        .delete(`/api/administrators/${id1}`)
        .set('Authorization', token);
      expect(res.status).toEqual(204);
    });
  });
});
