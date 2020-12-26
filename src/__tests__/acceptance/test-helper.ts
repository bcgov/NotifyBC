import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {NotifyBcApplication} from '../..';

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
