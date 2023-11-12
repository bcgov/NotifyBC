import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
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

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication<NestExpressApplication>();
  setupApp(app);
  app.enableShutdownHooks();
  await app.init();
  client = supertest(app.getHttpServer());
}, Number(process.env.notifyBcJestTestTimeout) || 99999);

afterEach(async () => {
  await app.close();
});
