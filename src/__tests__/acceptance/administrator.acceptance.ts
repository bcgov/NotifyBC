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
});
