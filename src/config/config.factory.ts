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

import fs from 'fs';
import { isArray, mergeWith } from 'lodash';
import path from 'path';
import { ConfigType } from './constants';

const config: Record<ConfigType, any> = {
  [ConfigType.AppConfig]: undefined,
  [ConfigType.MiddlewareConfig]: undefined,
  [ConfigType.DbConfig]: undefined,
};
function init() {
  let configFiles = ['config.json', 'config.js', 'config.ts'];
  let middlewareFiles = ['middleware.js', 'middleware.ts', 'middleware.json'];
  if (process.env.NODE_ENV) {
    configFiles = configFiles.concat([
      `config.${process.env.NODE_ENV}.json`,
      `config.${process.env.NODE_ENV}.js`,
      `config.${process.env.NODE_ENV}.ts`,
    ]);
    middlewareFiles = middlewareFiles.concat([
      `middleware.${process.env.NODE_ENV}.json`,
      `middleware.${process.env.NODE_ENV}.js`,
      `middleware.${process.env.NODE_ENV}.ts`,
    ]);
  }
  if (process.env.NODE_ENV !== 'test') {
    configFiles = configFiles.concat([
      `config.local.json`,
      `config.local.js`,
      `config.local.ts`,
    ]);
    middlewareFiles = middlewareFiles.concat([
      `middleware.local.json`,
      `middleware.local.js`,
      `middleware.local.ts`,
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

  let dsFiles: string[] = [
    'db.datasource.json',
    'db.datasource.js',
    'db.datasource.ts',
  ];
  if (process.env.NODE_ENV) {
    dsFiles = dsFiles.concat([
      `db.datasource.${process.env.NODE_ENV}.json`,
      `db.datasource.${process.env.NODE_ENV}.js`,
      `db.datasource.${process.env.NODE_ENV}.ts`,
    ]);
  }
  if (process.env.NODE_ENV !== 'test') {
    dsFiles = dsFiles.concat([
      'db.datasource.local.json',
      'db.datasource.local.js',
      'db.datasource.local.ts',
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
