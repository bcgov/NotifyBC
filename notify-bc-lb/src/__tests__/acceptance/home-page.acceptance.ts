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

// file ported
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
