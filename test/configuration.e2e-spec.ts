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

import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import supertest from 'supertest';
import { getAppAndClient, runAsSuperAdmin } from './test-helper';
describe('GET /configuration', () => {
  let client: supertest.SuperTest<supertest.Test>;
  let app: NestExpressApplication;
  let configurationsService: ConfigurationsService;

  beforeEach(() => {
    ({ app, client } = getAppAndClient());
    configurationsService = app.get<ConfigurationsService>(
      ConfigurationsService,
    );
  });

  beforeEach(async function () {
    await configurationsService.create({
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
    expect(res.status).toEqual(403);
  });
  it('should be allowed by admin user', async function () {
    await runAsSuperAdmin(async () => {
      const res = await client.get('/api/configurations');
      expect(res.status).toEqual(200);
    });
  });
});
