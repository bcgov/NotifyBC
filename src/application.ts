import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as _ from 'lodash';
import path from 'path';
import {
  AccessTokenAuthenticationStrategy,
  AnonymousAuthenticationStrategy,
  IpWhitelistAuthenticationStrategy,
  SiteMinderAuthenticationStrategy,
} from './authn-strategies';
import {MySequence} from './sequence';
import {SecuritySpecEnhancer} from './services';
import fs = require('fs');

export {ApplicationConfig};

export class NotifyBcApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    let configFiles = [
      'config.json',
      'config.js',
      'config.local.json',
      'config.local.js',
    ];
    if (process.env.NODE_ENV) {
      configFiles = configFiles.concat([
        `config.${process.env.NODE_ENV}.json`,
        `config.${process.env.NODE_ENV}.js`,
      ]);
    }
    for (const configFile of configFiles) {
      const f = path.join(__dirname, configFile);
      if (fs.existsSync(f)) {
        _.mergeWith(options, require(f), (t, s) => {
          if (_.isArray(t)) {
            return s;
          }
        });
      }
    }
    options.rest = options.rest ?? {};
    if (options.rest.host === undefined) options.rest.host = options.host;
    if (options.rest.port === undefined) options.rest.port = options.port;
    //    options.rest.basePath = options.restApiRoot;
    super(options);

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
    this.add(createBindingFromClass(SecuritySpecEnhancer));
  }
}
