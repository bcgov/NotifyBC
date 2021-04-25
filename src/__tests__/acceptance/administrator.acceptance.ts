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

import {CoreBindings} from '@loopback/core';
import {Client, expect} from '@loopback/testlab';
import axios from 'axios';
import {compare} from 'bcryptjs';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {AdministratorRepository} from '../../repositories';
import {BaseCrudRepository} from '../../repositories/baseCrudRepository';
import {setupApplication} from './test-helper';

describe('Administrator API', function () {
  let client: Client;
  let app: NotifyBcApplication;
  let administratorRepository: AdministratorRepository;
  const VALID_PASSWORD = '1aA@aaaaaa';
  before('setupApplication', async function () {
    ({app, client} = await setupApplication());
    administratorRepository = await app.get(
      'repositories.AdministratorRepository',
    );
  });

  let token: string;
  beforeEach(async function () {
    const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      Object.assign({}, origConfig, {
        adminIps: ['127.0.0.1'],
      }),
    );
    let res = await client.post('/api/administrators').send({
      email: 'foo@invalid.local',
      password: VALID_PASSWORD,
    });
    res = await client.post('/api/administrators/login').send({
      email: 'foo@invalid.local',
      password: VALID_PASSWORD,
      tokenName: 'myApp',
    });
    token = res.body.token;
    res = await client.post('/api/administrators').send({
      email: 'bar@invalid.local',
      password: VALID_PASSWORD,
    });
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });

  describe('POST /administrator', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: VALID_PASSWORD,
      });
      expect(res.status).equal(401);
    });

    it('should be allowed by admin user', async function () {
      const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(
        Object.assign({}, origConfig, {
          adminIps: ['127.0.0.1'],
        }),
      );
      const res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: VALID_PASSWORD,
      });
      expect(res.status).equal(200);
      const admin = await administratorRepository.findById(res.body.id, {
        include: ['userCredential'],
      });
      expect(admin.email).equal(res.body.email);
      const passwordMatched = await compare(
        VALID_PASSWORD,
        admin.userCredential.password,
      );
      expect(passwordMatched).true();
      app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
    });

    it("should forbid if password doesn't meet complexity rules", async function () {
      const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(
        Object.assign({}, origConfig, {
          adminIps: ['127.0.0.1'],
        }),
      );
      let res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: 'Too_sh0rt',
      });
      expect(res.status).equal(422);
      sinon.assert.match(res.text, 'should match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: 'No__number',
      });
      expect(res.status).equal(422);
      sinon.assert.match(res.text, 'should match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: '1no_uppercase',
      });
      expect(res.status).equal(422);
      sinon.assert.match(res.text, 'should match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: '1NO_LOWERCASE',
      });
      expect(res.status).equal(422);
      sinon.assert.match(res.text, 'should match pattern');
      res = await client.post('/api/administrators').send({
        email: 'baz@invalid.local',
        password: '1NoSpecialChar',
      });
      expect(res.status).equal(422);
      sinon.assert.match(res.text, 'should match pattern');
      app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
    });

    it('should forbid duplicated email address', async function () {
      const origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(
        Object.assign({}, origConfig, {
          adminIps: ['127.0.0.1'],
        }),
      );
      const res = await client.post('/api/administrators').send({
        email: 'foo@invalid.local',
        password: VALID_PASSWORD,
      });
      expect(res.status).equal(409);
      app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
    });
  });

  describe('POST /administrator/login', function () {
    it('should allow anonymous user', async function () {
      const res = await client.post('/api/administrators/login').send({
        email: 'bar@invalid.local',
        password: VALID_PASSWORD,
        tokenName: 'myApp',
      });
      expect(res.status).equal(200);
      const admin = await administratorRepository.findOne({
        where: {
          email: 'bar@invalid.local',
        },
        include: ['accessTokens'],
      });
      expect(admin?.accessTokens[0].id).equal(res.body.token);
      expect(res.body.token).lengthOf(64);
    });
  });

  describe('GET /administrator', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.get('/api/administrators');
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client.get('/api/administrators');
      expect(res.status).equal(200);
      expect(res.body.length).equal(2);
    });
    it('should allow own record only for admin user', async function () {
      const res = await client
        .get('/api/administrators')
        .set('Authorization', token);
      expect(res.body.length).equal(1);
    });
  });

  describe('GET /administrator/{id}', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.get('/api/administrators/1');
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client.get('/api/administrators/1');
      expect(res.status).equal(200);
      expect(res.body.email).equal('foo@invalid.local');
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .get('/api/administrators/1')
        .set('Authorization', token);
      expect(res.status).equal(200);
      expect(res.body.email).equal('foo@invalid.local');
      res = await client
        .get('/api/administrators/2')
        .set('Authorization', token);
      expect(res.status).equal(403);
    });
  });

  describe('DELETE /administrator/{id}', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.delete('/api/administrators/1');
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client.delete('/api/administrators/1');
      expect(res.status).equal(204);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .delete('/api/administrators/2')
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .delete('/api/administrators/1')
        .set('Authorization', token);
      expect(res.status).equal(204);
    });
  });

  describe('PATCH /administrator/{id}', function () {
    it('should forbid anonymous user', async function () {
      const res = await client
        .patch('/api/administrators/1')
        .send({username: 'foo'});
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .patch('/api/administrators/1')
        .send({username: 'foo'});
      expect(res.status).equal(204);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .patch('/api/administrators/2')
        .send({username: 'foo'})
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .patch('/api/administrators/1')
        .send({username: 'foo'})
        .set('Authorization', token);
      expect(res.status).equal(204);
    });
  });

  describe('PUT /administrator/{id}', function () {
    it('should forbid anonymous user', async function () {
      const res = await client
        .put('/api/administrators/1')
        .send({username: 'foo', email: 'foo@invalid.local'});
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .put('/api/administrators/1')
        .send({username: 'foo', email: 'foo@invalid.local'});
      expect(res.status).equal(204);
    });
    it('should ensure email uniqueness', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .put('/api/administrators/1')
        .send({email: 'bar@invalid.local'});
      expect(res.status).equal(409);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .patch('/api/administrators/2')
        .send({username: 'foo', email: 'foo@invalid.local'})
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .patch('/api/administrators/1')
        .send({username: 'foo', email: 'foo@invalid.local'})
        .set('Authorization', token);
      expect(res.status).equal(204);
    });
  });

  describe('POST /administrator/{id}/user-credential', function () {
    it('should forbid anonymous user', async function () {
      const res = await client
        .post('/api/administrators/1/user-credential')
        .send({password: VALID_PASSWORD});
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .post('/api/administrators/1/user-credential')
        .send({password: VALID_PASSWORD});
      expect(res.status).equal(200);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .post('/api/administrators/2/user-credential')
        .send({password: VALID_PASSWORD})
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .post('/api/administrators/1/user-credential')
        .send({password: VALID_PASSWORD})
        .set('Authorization', token);
      expect(res.status).equal(200);
      const passwordMatched = await compare(VALID_PASSWORD, res.body.password);
      expect(passwordMatched).true();
    });
  });

  describe('POST /administrator/{id}/access-tokens', function () {
    it('should forbid anonymous user', async function () {
      const res = await client
        .post('/api/administrators/1/access-tokens')
        .send({
          ttl: 0,
          name: 'myApp',
        });
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .post('/api/administrators/1/access-tokens')
        .send({
          ttl: 0,
          name: 'myApp',
        });
      expect(res.status).equal(200);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .post('/api/administrators/2/access-tokens')
        .send({
          ttl: 0,
          name: 'myApp',
        })
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .post('/api/administrators/1/access-tokens')
        .send({
          ttl: 0,
          name: 'myApp',
        })
        .set('Authorization', token);
      expect(res.status).equal(200);
      expect(res.body.id).lengthOf(64);
    });
  });

  describe('PATCH /administrator/{id}/access-tokens', function () {
    it('should forbid anonymous user', async function () {
      const res = await client
        .patch('/api/administrators/1/access-tokens')
        .send({
          ttl: 0,
        });
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .patch('/api/administrators/1/access-tokens')
        .send({
          ttl: 0,
        });
      expect(res.status).equal(200);
      expect(res.body.count).equal(1);
    });
    it('should forbid patching userId', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client
        .patch('/api/administrators/1/access-tokens')
        .send({
          userId: '2',
        });
      expect(res.status).equal(403);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .patch('/api/administrators/2/access-tokens')
        .send({
          ttl: 0,
        })
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .patch('/api/administrators/1/access-tokens')
        .send({
          ttl: 0,
        })
        .set('Authorization', token);
      expect(res.status).equal(200);
      expect(res.body.count).equal(1);
    });
  });

  describe('GET /administrator/{id}/access-tokens', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.get('/api/administrators/1/access-tokens');
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client.get('/api/administrators/1/access-tokens');
      expect(res.status).equal(200);
      expect(res.body[0].id).equal(token);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .get('/api/administrators/2/access-tokens')
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .get('/api/administrators/1/access-tokens')
        .set('Authorization', token);
      expect(res.status).equal(200);
      expect(res.body[0].id).equal(token);
    });
  });

  describe('DELETE /administrator/{id}/access-tokens', function () {
    it('should forbid anonymous user', async function () {
      const res = await client.delete('/api/administrators/1/access-tokens');
      expect(res.status).equal(401);
    });
    it('should allow super-admin user', async function () {
      sinon
        .stub(BaseCrudRepository.prototype, 'isAdminReq')
        .callsFake(async () => true);
      const res = await client.delete('/api/administrators/1/access-tokens');
      expect(res.status).equal(200);
      expect(res.body.count).equal(1);
    });
    it('should allow own record only for admin user', async function () {
      let res = await client
        .delete('/api/administrators/2/access-tokens')
        .set('Authorization', token);
      expect(res.status).equal(403);
      res = await client
        .delete('/api/administrators/1/access-tokens')
        .set('Authorization', token);
      expect(res.status).equal(200);
      expect(res.body.count).equal(1);
    });
  });

  describe('GET /administrator/whoami', function () {
    it('should handle oidc authn', async function () {
      sinon
        .stub(axios, 'get')
        .withArgs('https://local.invalid/discoveryUrl')
        .resolves({
          data: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            authorization_endpoint:
              'https://local.invalid/authorization_endpoint',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            jwks_uri: 'https://local.invalid/jwks_uri',
          },
        })
        .withArgs('https://local.invalid/jwks_uri')
        .resolves({
          data: {
            keys: [
              {kid: 'foo'},
              {
                kid: 'vBpvjTmhaRrkcdPFYK1qwhAi7Mv6os8msKIusqO5DhU',
                x5c: `MIIFCTCCAvGgAwIBAgIUJyw3mWnc3+ho9tLQYxnLhrC5H/wwDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwITm90aWZ5QkMwIBcNMjEwNDI1MjA1OTA4WhgPNDc1OTAz
MjIyMDU5MDhaMBMxETAPBgNVBAMMCE5vdGlmeUJDMIICIjANBgkqhkiG9w0BAQEF
AAOCAg8AMIICCgKCAgEAwQpkaBhSCSEe3sYJBrV/90BOhShGiqhYoOnjEd8MFle2
HFtx4QygiEqfxc8cJPdCPY2+Cqodo6iIRk2i0sny1JqIK+EJq4q0fWOs8o0BdAPF
0NOEVQ7G2kZodwBc6JDY774ptEHGujuHMAvx71qHX1IpVVlJf4K1u2WjlGs7JGdw
USzu6TaFBvWPbavrDXehNgqeMuHP1H68XYqjRcpOeC2bxxExzWRrH/hVwrXymZ8e
uh1vbxCNf3KyWK4jqB/EQXWSmFKcMoMtd8S7GbwBsk3tWWIZ0h/930e6q+r9KExo
71LdcQLaVVcZbmVe2mEVKlpePhTZ2scpJf8q/DxOa+z0W/17a7kvi+l2o6F3EwO8
u2OeVYFAK1s9OUJTcRK8ef+9303wCnV2cy/WuZKSK306SbpLfYmKqByog0Mw6pD9
++Mns+lfib1qh3w6gLxTmYvgsIwmwhSFyvNbcxibQi6bQesJBhWH2vV5IupqwWXT
UCu3t/Kbua5veEJPS+mqO+G3AkfjHP5prasKwJVf3mv4E0+qAvPUOBcP6HOAOsAN
+3M/HWK3SC7KWGcTDmCjTEojL0nIaUXB9qz7f4di21lyQu+mx54wrXiLNWZx9mNw
M4ZC3wFp9iGpwtAr8Wqyv2acdgCHfHoRllfy11IejXICTTIdatxwQgqIzne6pScC
AwEAAaNTMFEwHQYDVR0OBBYEFLBqDrV1aydbTVzk1TCF1KZihl/dMB8GA1UdIwQY
MBaAFLBqDrV1aydbTVzk1TCF1KZihl/dMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZI
hvcNAQELBQADggIBAA/yaeV44qOmW8LGvKn2hS2KPIOAhtVXuLDg+/RvePJ+zGmT
3+pkWuOPHuNWXBj2jHdde48pVyKOgat4yKMnHDVoIQmrOvYbEP5iVO8QEKrhTQvq
8/jEN3woGUp2UW/H5JeX9PvTi9YwtVXWlb+ZCQl7ERhj+QEtcKuipAaXz6rNJOd5
sI0qIQg7Fh61QWQjH6adRD0mL+Lsp6vWsuKxHgvVngxODGe3VDmLc/6WpJdjda+O
Y9y+My4PmFUSwdmS3zPTxynpeNu9LZLQ7xPNi9Lq/li5uniTv2tp3yVllxg744ex
qXqkZvjM3v0BYs5dU7d+oA6hRMy7URGU2qVOPkq3ENJx4Rfzy8dnUh7ePh+01F2a
qsKUgEZATtBa7t7pKxeBURfYtwgHIZHji01PIDnqiUP0Yhjffdf2ipMx+N3JYa0w
baiKfN0oY0EPEGEgj0Jhte5hlC/VtVrA0f2brb3Z9ifyeHMt0RLdxPeL83u1cq/W
7cST0aBbix1o/AcZYjF5mGPhkBodkMg6QpQl46mvuR2h1LdSUBbVo62N0CpabpDM
gFP0pwOGzVZKj8+wUBuBDwNuQnlo+FThxA9kO7v5VnAbLHiOzR02E0TOoggXtQPs
1bYAvnIYqWSYBwYWq98QZqiGlZ+RfsIki4IpyIoufEcVHR7O7hdBrG5IMYR7`,
              },
            ],
          },
        });

      const {client: thisClient} = await setupApplication({
        oidc: {
          discoveryUrl: 'https://invalid.local/discoveryUrl',
        },
      });
      const res = await thisClient
        .get('/api/administrators/whoami')
        .set(
          'authorization',
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InZCcHZqVG1oYVJya2NkUEZZSzFxd2hBaTdNdjZvczhtc0tJdXNxTzVEaFUifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImVtYWlsIjoiZm9vQGxvY2FsLmludmFsaWQiLCJpYXQiOjE1MTYyMzkwMjJ9.BenwDD1auGBY3o8KL7OIMc0tqna6YQwh2Et382uErrDEO0kD6mHMOf__eJulTJ77bg9QMg5pJaJT4ecYdZjO1qUBGm8J1HM-RATfqmW5ZEv5AA-bA-uL_xwKeA5SMd8iJMvleONF_suaRx3xgp0-YsVLtyMZDnajACcKFEPF81MghHjZeTVRXKSSgoOyqUBwoPw2elA-5byHU1CWQ0SVwdyuVFShmxyT9Dp5IlPDNd0jpEXtXf-jFLhVO-4o4jo359As6TTufIasaSJGMd3_Fkpp43EN5jzG8hy6IvvxacBO_OrsTngOC3cbiW1dNvYDpC6wWOyqVYCJG3mH2yuiuWv_aqg0DaeYgcYlLccgWHmaf80cNAxu-CY-TcWe26qZNWR0SV4kUMn1x-qeHGUsFM24Z_cWFYZ1eqpNnQ6msUFh52OYOA1sZoEs2fyKepOe9YLa3I7UkL6NWLroM7whNH2Z26SJ7f1-EBqbdSPXamE3If2N0pMG0kfLoBQvqRHavPpW6jfDkpoFHLpUNsYrR1ehO8LCNSU6PgmsrOPrncb7W_aYCJinsl9K5lkVLGV7roZCeKqwjdHAbiR0x8nz9oVulR-6AITvlm-RCckWq2F6FODJ6Rqi74fx7ocgAJbmuBvdcTCnnai_wrWuT7pFvG6MRHMqi3qluM6End7PV8E',
        );
      expect(res.status).equal(200);
      expect(res.body.email).equal('foo@local.invalid');
      expect(res.body.authnStrategy).equal('oidc');
    });
  });
});
