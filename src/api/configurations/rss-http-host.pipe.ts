import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable({ scope: Scope.REQUEST })
export class RssHttpHostPipe implements PipeTransform {
  readonly appConfig;
  constructor(
    @Inject(REQUEST) private request: Request,
    readonly appConfigService: AppConfigService,
  ) {
    this.appConfig = appConfigService.get();
  }

  transform(value: any) {
    if (
      value.name === 'notification' &&
      value.value &&
      value.value.rss &&
      !value.value.httpHost &&
      !this.appConfig.httpHost
    ) {
      value.value.httpHost =
        this.request.protocol + '://' + this.request.get('host');
    }
    return value;
  }
}
