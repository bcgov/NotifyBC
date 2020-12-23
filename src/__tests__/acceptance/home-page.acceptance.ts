import {Client} from '@loopback/testlab';
import {NotifyBcApplication} from '../..';
import {setupApplication} from './test-helper';

describe('HomePage', function () {
  let app: NotifyBcApplication;
  let client: Client;

  before('setupApplication', async function () {
    ({app, client} = await setupApplication());
    return;
  });

  after(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    await client
      .get('/notifications')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  it('exposes self-hosted explorer', async () => {
    await client
      .get('/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
