import { Injectable } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

@Injectable()
export class AppService {
  static app: NestExpressApplication;
}
