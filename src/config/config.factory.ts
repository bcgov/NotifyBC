import * as path from 'path';
import * as fs from 'fs';
import {ConfigType} from './constants';
import {isArray, mergeWith} from 'lodash';

const config: Record<ConfigType, any> = {
  [ConfigType.AppConfig]: undefined,
  [ConfigType.MiddlewareConfig]: undefined,
  [ConfigType.DbConfig]: undefined,
};
function init() {
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
    configFiles = configFiles.concat([`config.local.json`, `config.local.js`]);
    middlewareFiles = middlewareFiles.concat([
      `middleware.local.json`,
      `middleware.local.js`,
    ]);
  }
  const options: Record<string, any> = {};
  const middlewareConfigs: Record<string, any> = {};
  for (const e of [
    {files: middlewareFiles, configs: middlewareConfigs},
    {files: configFiles, configs: options},
  ]) {
    for (const configFile of e.files) {
      const f = path.join(__dirname, '..', configFile);
      if (fs.existsSync(f)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        mergeWith(e.configs, require(f), (t, s) => {
          if (isArray(t)) {
            return s;
          }
        });
      }
    }
  }

  options.rest = options.rest ?? {};
  if (options.rest.host === undefined) options.rest.host = options.host;
  if (options.rest.port === undefined) options.rest.port = options.port;
  config[ConfigType.AppConfig] = options;
  config[ConfigType.MiddlewareConfig] = middlewareConfigs;

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
  config[ConfigType.DbConfig] = require(dbFileSelected);
}

export function configFactory(token: ConfigType) {
  if (!config[token]) init();
  return {
    provide: token,
    useFactory: () => {
      return config[token];
    },
  };
}
