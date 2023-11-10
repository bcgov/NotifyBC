import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import supertest from 'supertest';

export interface AppWithClient {
  app: NestExpressApplication;
  client: supertest.SuperTest<supertest.Test>;
}
let app;
export async function setupApplication(): Promise<AppWithClient> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication<NestExpressApplication>();
  AppService.app = app;
  app.enableShutdownHooks();
  await app.init();
  const client = supertest(app.getHttpServer());
  return { app, client };
}
afterAll(async () => {
  await app.close();
});
