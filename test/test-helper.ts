import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { merge } from 'lodash';
import { AppModule } from 'src/app.module';
import { AppConfigService } from 'src/config/app-config.service';
import { setupApp } from 'src/main';
import supertest from 'supertest';

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

beforeEach(async () => {
  const res = await setupApplication();
  app = res.app;
  client = res.client;
}, Number(process.env.notifyBcJestTestTimeout) || 99999);

afterEach(async () => {
  await app.close();
});
