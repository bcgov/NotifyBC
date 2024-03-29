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

import type { Config } from 'jest';
const config: Config = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePaths: ['<rootDir>'],
  rootDir: '..',
  testEnvironment: 'node',
  // testRegex: '.e2e-spec.ts$',
  testMatch: ['<rootDir>/test/**/*.e2e-spec.{ts,js}'],
  preset: 'ts-jest',
  testTimeout: Number(process.env.notifyBcJestTestTimeout) || 5000,
  restoreMocks: true,
  // cache: process.platform === 'win32' ? false : true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/utils/**',
    '!src/datasources/**',
    '!src/config*',
    '!src/middleware*',
    '!src/main.ts',
  ],
};
export default config;
