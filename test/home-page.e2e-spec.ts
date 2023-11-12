import supertest from 'supertest';
import { getAppAndClient } from './test-helper';

let client: supertest.SuperTest<supertest.Test>;

beforeEach(() => {
  ({ client } = getAppAndClient());
});

describe('HomePage', () => {
  it('exposes self-hosted explorer', async () => {
    await client
      .get('/api/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>Swagger UI<\/title>/);
  });
});
