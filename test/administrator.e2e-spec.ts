import supertest from 'supertest';
import { setupApplication } from './test-helper';

describe('AppController (e2e)', () => {
  let client: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    ({ client } = await setupApplication());
  }, 99999);

  it('/ (GET)', () => {
    return client.get('/api/administrators/whoami').expect(200);
  });
});
