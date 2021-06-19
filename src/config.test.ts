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

import _ from 'lodash';
module.exports = {
  rest: {
    basePath: '/api',
    port: 0,
  },
  adminIps: [],
  httpHost: '',
  internalHttpHost: '',
  smtp: {
    host: 'invalid.local',
    port: 465,
  },
  smsServiceProvider: 'swift',
  sms: {
    swift: {
      accountKey: '123',
    },
  },
  subscription: {
    detectDuplicatedSubscription: false,
  },
  notification: {
    handleBounce: true,
    broadcastCustomFilterFunctions: {
      // eslint-disable-next-line  @typescript-eslint/naming-convention
      contains_ci: {
        _func: async function (resolvedArgs: (string | undefined)[]) {
          if (!resolvedArgs[0] || !resolvedArgs[1]) {
            return false;
          }
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(
                _.toLower(resolvedArgs[0]).indexOf(
                  _.toLower(resolvedArgs[1]),
                ) >= 0,
              );
            }, 1000);
          });
        },
        _signature: [
          {
            types: [2],
          },
          {
            types: [2],
          },
        ],
      },
    },
  },
  inboundSmtpServer: {
    enabled: true,
    domain: 'invalid.local',
    listeningSmtpPort: 0,
    apiUrlPrefix: null,
    bounce: {
      unsubThreshold: 2,
      subjectRegex: '^Returned mail: see transcript for details',
      failedRecipientRegex:
        '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])',
    },
    options: {
      secure: true,
    },
  },
};
