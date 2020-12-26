import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {BaseController} from '../../controllers/base.controller';

process.env['NODE_ENV'] = 'test';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new NotifyBcApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  beforeEach(async () => {
    await app.migrateSchema({existingSchema: 'drop'});
  });

  return {app, client};
}

export interface AppWithClient {
  app: NotifyBcApplication;
  client: Client;
}

before(function () {
  async function fakeSendEmail(_mailOptions: any, cb?: Function) {
    console.log('faking sendEmail');
    cb?.(null, null);
  }

  async function fakeSendSMS(
    _to: string,
    _textBody: string,
    _data: any,
    cb?: Function,
  ) {
    console.log('faking sendSMS');
    cb?.(null, null);
  }

  sinon.stub(BaseController.prototype, 'sendEmail').callsFake(fakeSendEmail);
  sinon.stub(BaseController.prototype, 'sendSMS').callsFake(fakeSendSMS);
});
