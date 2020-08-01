import {Client, expect} from '@loopback/testlab';
import {NotifyBcApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: NotifyBcApplication;
  let client: Client;

  before('setupApplication', async function (this: Mocha.Context) {
    this.timeout(10000);
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
