/* eslint-disable mocha/handle-done-callback */
import {Client, expect} from '@loopback/testlab';
import {NotifyBcApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', function () {
  let app: NotifyBcApplication;
  let client: Client;

  before('setupApplication', async function () {
    ({app, client} = await setupApplication());
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/api/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
