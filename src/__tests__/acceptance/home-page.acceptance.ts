import {Client} from '@loopback/testlab';
import {setupApplication} from './test-helper';

describe('HomePage', function () {
  let client: Client;

  before('setupApplication', async function () {
    ({client} = await setupApplication());
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
