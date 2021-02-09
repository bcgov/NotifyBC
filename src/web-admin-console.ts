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
};
