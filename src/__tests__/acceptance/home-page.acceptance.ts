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

  it('exposes self-hosted explorer', async () => {
    await client
      .get('/api/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
