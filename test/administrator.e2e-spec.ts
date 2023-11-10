import supertest from 'supertest';
import { setupApplication } from './test-helper';

let client: supertest.SuperTest<supertest.Test>;
beforeAll(async () => {
  ({ client } = await setupApplication());
}, 99999);

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return client.get('/api/administrators/whoami').expect(200);
  });
});
