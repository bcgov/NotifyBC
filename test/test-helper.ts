import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { setupApp } from 'src/main';
import supertest from 'supertest';

export interface AppWithClient {
  app: NestExpressApplication;
  client: supertest.SuperTest<supertest.Test>;
}
let app: NestExpressApplication;
export async function setupApplication(): Promise<AppWithClient> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication<NestExpressApplication>();
  setupApp(app);
  app.enableShutdownHooks();
  await app.init();
  const client = supertest(app.getHttpServer());
  return { app, client };
}
afterAll(async () => {
  await app.close();
});
