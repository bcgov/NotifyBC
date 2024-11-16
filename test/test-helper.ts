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

import { DEFAULT_DB_CONNECTION } from '@nestjs/mongoose/dist/mongoose.constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { merge } from 'lodash';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { CommonService } from 'src/common/common.service';
import { AppConfigService } from 'src/config/app-config.service';
import { setupApp } from 'src/main';
import supertest from 'supertest';
import { promisify } from 'util';

let app: NestExpressApplication, client: supertest.SuperTest<supertest.Test>;
export function getAppAndClient() {
  return { app, client };
}

export async function runAsSuperAdmin(f) {
  const appConfig = app.get<AppConfigService>(AppConfigService).get();
  const origAdminIPs = appConfig.adminIps;
  appConfig.adminIps = ['127.0.0.1'];
  await f();
  appConfig.adminIps = origAdminIPs;
}

export async function setupApplication(extraConfigs?) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  const appConfig = app.get<AppConfigService>(AppConfigService).get();
  merge(appConfig, extraConfigs);
  await setupApp(app);
  app.enableShutdownHooks();
  await app.init();
  const client = supertest(app.getHttpServer());
  return { app, client };
}

export const wait = promisify(setTimeout);

beforeAll(async () => {
  ({ app, client } = await setupApplication());
}, Number(process.env.notifyBcJestTestTimeout) || 99999);

afterAll(async () => {
  await app.close();
});

beforeEach(function () {
  jest.spyOn(CommonService.prototype, 'sendEmail').mockResolvedValue({});
  jest.spyOn(CommonService.prototype, 'sendSMS').mockResolvedValue({});
});

afterEach(async () => {
  const connection: Connection = app.get(DEFAULT_DB_CONNECTION);
  await connection.dropDatabase();
  await connection.syncIndexes();
});
