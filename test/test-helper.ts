import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { merge } from 'lodash';
import { BaseController } from 'src/api/common/base.controller';
import { AppModule } from 'src/app.module';
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
  setupApp(app);
  app.enableShutdownHooks();
  await app.init();
  const client = supertest(app.getHttpServer());
  return { app, client };
}

export const wait = promisify(setTimeout);

beforeEach(async () => {
  ({ app, client } = await setupApplication());
}, Number(process.env.notifyBcJestTestTimeout) || 99999);

beforeEach(function () {
  async function fakeSendEmail(_mailOptions: any) {
    console.log('faking sendEmail');
  }

  async function fakeSendSMS(_to: string, _textBody: string, _data: any) {
    console.log('faking sendSMS');
  }

  jest
    .spyOn(BaseController.prototype, 'sendEmail')
    .mockImplementation(fakeSendEmail);
  jest
    .spyOn(BaseController.prototype, 'sendSMS')
    .mockImplementation(fakeSendSMS);
});

afterEach(async () => {
  await app.close();
});
