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

import { NestExpressApplication } from '@nestjs/platform-express';
import express, { Response } from 'express';
import { join } from 'path';

export default (app: NestExpressApplication, appConfig) => {
  app.engine('html', require('ejs').renderFile);
  app.setViewEngine('html');
  const viewRelDir = '../client/dist';
  app.set('views', join(__dirname, viewRelDir));

  const indexRenderer = (_request: Request, response: Response) => {
    response.render('index.html', {
      apiUrlPrefix: appConfig.restApiRoot,
      oidcAuthority: appConfig.oidc?.discoveryUrl?.split(
        /\/\.well-known\/openid-configuration$/,
      )[0],
      oidcClientId: appConfig.oidc?.clientId,
    });
  };
  app.use(/^\/(index\.html)?$/, indexRenderer);
  // Serve static files in the client folder
  app.use(express.static(join(__dirname, viewRelDir)));

  // fallback to index for all non restApiRoot requests
  app.use(new RegExp(`^(?!${appConfig.restApiRoot}\/)`), indexRenderer);
};
