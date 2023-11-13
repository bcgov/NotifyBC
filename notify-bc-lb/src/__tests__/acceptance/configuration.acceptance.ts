// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Client, expect} from '@loopback/testlab';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {BaseCrudRepository} from '../../repositories/baseCrudRepository';
import {ConfigurationRepository} from '../../repositories/configuration.repository';
import {setupApplication} from './test-helper';

// file ported
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
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client.get('/api/configurations');
    expect(res.status).equal(200);
  });
});
