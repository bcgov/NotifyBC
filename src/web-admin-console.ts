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

import {CoreBindings} from '@loopback/core';
import express, {Request, Response} from 'express';
import {ExpressServer} from './server';
import path = require('path');
export default (server: ExpressServer) => {
  const app = server.app;
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  const viewRelDir = '../client/dist';
  app.use(require('connect-history-api-fallback')());
  app.set('views', path.join(__dirname, viewRelDir));
  app.use(/^\/(index\.html)?$/, (request: Request, response: Response) => {
    const appConfig = server.lbApp.getSync(CoreBindings.APPLICATION_CONFIG);
    response.render('index.html', {
      htmlWebpackPlugin: {options: {apiUrlPrefix: appConfig.restApiRoot}},
      ApiUrlPrefix: appConfig.restApiRoot,
      ApiExplorerUrlPrefix: `${appConfig.restApiRoot}/explorer`,
    });
  });
  // Serve static files in the client folder
  app.use(express.static(path.join(__dirname, viewRelDir)));
  app.use(
    express.static(path.join(__dirname, '../node_modules/swagger-ui-dist')),
  );
};
