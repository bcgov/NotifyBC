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

import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {AnyObject, RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import fs from 'fs';
import * as _ from 'lodash';
import path from 'path';
import {
  AccessTokenAuthenticationStrategy,
  AnonymousAuthenticationStrategy,
  ClientCertificateAuthenticationStrategy,
  IpWhitelistAuthenticationStrategy,
  OidcAuthenticationStrategy,
  SiteMinderAuthenticationStrategy,
} from './authn-strategies';
import {MySequence} from './sequence';
import {SecuritySpecEnhancer} from './services';

export {ApplicationConfig};

export class NotifyBcApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  middlewareConfigs: AnyObject;
  constructor(options: ApplicationConfig = {}) {
    let configFiles = [
      'config.json',
      'config.js',
      'config.local.json',
      'config.local.js',
    ];
    let middlewareFiles = [
      'middleware.js',
      'middleware.json',
      'middleware.local.js',
      'middleware.local.json',
    ];
    if (process.env.NODE_ENV) {
      configFiles = configFiles.concat([
        `config.${process.env.NODE_ENV}.json`,
        `config.${process.env.NODE_ENV}.js`,
      ]);
      middlewareFiles = middlewareFiles.concat([
        `middleware.${process.env.NODE_ENV}.json`,
        `middleware.${process.env.NODE_ENV}.js`,
      ]);
    }
    const middlewareConfigs: AnyObject = {};
    for (const e of [
      {files: middlewareFiles, configs: middlewareConfigs},
      {files: configFiles, configs: options},
    ]) {
      for (const configFile of e.files) {
        const f = path.join(__dirname, configFile);
        if (fs.existsSync(f)) {
          _.mergeWith(e.configs, require(f), (t, s) => {
            if (_.isArray(t)) {
              return s;
            }
          });
        }
      }
    }

    options.rest = options.rest ?? {};
    if (options.rest.host === undefined) options.rest.host = options.host;
    if (options.rest.port === undefined) options.rest.port = options.port;
    //    options.rest.basePath = options.restApiRoot;
    super(options);
    this.middlewareConfigs = middlewareConfigs;

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    // const staticHomeRelPath =
    //   process.env.NODE_ENV === 'dev' ? '../client' : '../client/dist';
    // this.static('/', path.join(__dirname, staticHomeRelPath));

    // Customize @loopback/rest-explorer configuration here
    const explorerPath = '/explorer';
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: explorerPath,
    });
    this.component(RestExplorerComponent);
    this.static(
      explorerPath,
      path.join(__dirname, '../client/node_modules/iframe-resizer/js'),
    );

    let dsFiles = ['db.datasource.local.json', 'db.datasource.local.js'];
    if (process.env.NODE_ENV) {
      dsFiles = dsFiles.concat([
        `db.datasource.${process.env.NODE_ENV}.json`,
        `db.datasource.${process.env.NODE_ENV}.js`,
      ]);
    }
    for (const dsFile of dsFiles) {
      const f = path.join(__dirname, 'datasources', dsFile);
      if (fs.existsSync(f)) {
        this.bind('datasources.config.db').to(require(f));
      }
    }
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {};
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, AccessTokenAuthenticationStrategy);
    registerAuthenticationStrategy(this, IpWhitelistAuthenticationStrategy);
    registerAuthenticationStrategy(this, AnonymousAuthenticationStrategy);
    registerAuthenticationStrategy(this, SiteMinderAuthenticationStrategy);
    registerAuthenticationStrategy(this, OidcAuthenticationStrategy);
    registerAuthenticationStrategy(
      this,
      ClientCertificateAuthenticationStrategy,
    );
    this.add(createBindingFromClass(SecuritySpecEnhancer));

    const apiOnlyMiddlewareConfigs = middlewareConfigs.apiOnly;
    for (const middlewareFactoryNm in apiOnlyMiddlewareConfigs) {
      if (apiOnlyMiddlewareConfigs[middlewareFactoryNm].enabled === false)
        continue;
      this.expressMiddleware(
        `middleware.${middlewareFactoryNm}`,
        require(middlewareFactoryNm).apply(
          this,
          apiOnlyMiddlewareConfigs[middlewareFactoryNm].params,
        ),
      );
    }
  }
}
