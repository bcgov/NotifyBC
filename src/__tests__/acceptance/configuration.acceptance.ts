import {Client, expect} from '@loopback/testlab';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {ConfigurationRepository} from '../../repositories/configuration.repository';
import {setupApplication} from './test-helper';

describe('GET /configuration', function () {
  let app: NotifyBcApplication;
  let client: Client;
  let configurationRepository: ConfigurationRepository;

  before('setupApplication', async function () {
    ({app, client} = await setupApplication());
    configurationRepository = await app.get(
      'repositories.ConfigurationRepository',
    );
    return;
  });

  beforeEach(async function () {
    await configurationRepository.create({
      name: 'subscription',
      serviceName: 'myService',
      value: {
        confirmationRequest: {
          sms: {
            textBody: 'enter {confirmation_code}!',
          },
          email: {
            textBody: 'enter {confirmation_code} in email!',
          },
        },
        anonymousUndoUnsubscription: {
          successMessage: 'You have been re-subscribed.',
          failureMessage: 'Error happened while re-subscribing.',
        },
      },
    });
  });
  it('should be forbidden by anonymous user', async function () {
    const res = await client.get('/api/configurations');
    expect(res.status).equal(401);
  });
  it('should be allowed by admin user', async function () {
    sinon
      .stub(ConfigurationRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client.get('/api/configurations');
    expect(res.status).equal(200);
  });
});
