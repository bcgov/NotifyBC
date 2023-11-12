import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { setupApp } from 'src/main';
import supertest from 'supertest';

let app: NestExpressApplication, client: supertest.SuperTest<supertest.Test>;
export function getAppAndClient() {
  return { app, client };
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
}, parseInt(process.env.notifyBcJestTestTimeout) || 99999);

afterEach(async () => {
  await app.close();
});
