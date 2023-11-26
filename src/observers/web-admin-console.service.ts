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

import { Injectable, OnModuleInit } from '@nestjs/common';
import express, { Response } from 'express';
import { join } from 'path';
import { AppService } from '../app.service';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class WebAdminConsoleService implements OnModuleInit {
  readonly appConfig;
  constructor(private readonly appConfigService: AppConfigService) {
    this.appConfig = appConfigService.get();
  }
  onModuleInit() {
    AppService.app.engine('html', require('ejs').renderFile);
    AppService.app.setViewEngine('html');
    const viewRelDir = '../../client/dist';
    AppService.app.set('views', join(__dirname, viewRelDir));

    const indexRenderer = (_request: Request, response: Response) => {
      response.render('index.html', {
        apiUrlPrefix: this.appConfig.restApiRoot,
        oidcAuthority: this.appConfig.oidc?.discoveryUrl?.split(
          /\/\.well-known\/openid-configuration$/,
        )[0],
        oidcClientId: this.appConfig.oidc?.clientId,
      });
    };
    AppService.app.use(/^\/(index\.html)?$/, indexRenderer);
    // Serve static files in the client folder
    AppService.app.use(express.static(join(__dirname, viewRelDir)));
    AppService.app.use(
      express.static(
        join(__dirname, viewRelDir, '../node_modules/iframe-resizer/js'),
      ),
    );

    // fallback to index for all non restApiRoot requests
    AppService.app.use(
      new RegExp(`^(?!${this.appConfig.restApiRoot}\/)`),
      indexRenderer,
    );
  }
}
