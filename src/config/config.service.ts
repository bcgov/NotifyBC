import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

@Injectable()
export class ConfigService {
  private readonly appConfig;
  private readonly middlewareConfig;
  private readonly dbConfig;

  constructor() {
    let configFiles = ['config.json', 'config.js'];
    let middlewareFiles = ['middleware.js', 'middleware.json'];
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
    if (process.env.NODE_ENV !== 'test') {
      configFiles = configFiles.concat([
        `config.local.json`,
        `config.local.js`,
      ]);
      middlewareFiles = middlewareFiles.concat([
        `middleware.local.json`,
        `middleware.local.js`,
      ]);
    }
    const options: Record<string, any> = {};
    const middlewareConfigs: Record<string, any> = {};
    for (const e of [
      { files: middlewareFiles, configs: middlewareConfigs },
      { files: configFiles, configs: options },
    ]) {
      for (const configFile of e.files) {
        const f = path.join(__dirname, '..', configFile);
        if (fs.existsSync(f)) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    this.appConfig = options;
    this.middlewareConfig = middlewareConfigs;

    let dsFiles: string[] = ['db.datasource.js'];
    if (process.env.NODE_ENV) {
      dsFiles = [
        `db.datasource.${process.env.NODE_ENV}.json`,
        `db.datasource.${process.env.NODE_ENV}.js`,
      ];
    }
    if (process.env.NODE_ENV !== 'test') {
      dsFiles = dsFiles.concat([
        'db.datasource.local.json',
        'db.datasource.local.js',
      ]);
    }
    let dbFileSelected: string;
    for (const dsFile of dsFiles) {
      const f = path.join(__dirname, '..', 'datasources', dsFile);
      if (fs.existsSync(f)) {
        dbFileSelected = f;
      }
    }
    this.dbConfig = require(dbFileSelected);
  }
}
