import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { smtpServer } from './smtp-server';
@Injectable()
export class SmtpService implements OnApplicationBootstrap {
  readonly appConfig;
  constructor(private readonly appConfigService: AppConfigService) {
    this.appConfig = appConfigService.get();
  }

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const smtpSvr = this.appConfig.email.inboundSmtpServer;
    if (!smtpSvr.enabled) {
      return;
    }
    await smtpServer(this.appConfig);
  }
}
