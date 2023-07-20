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

import {Command} from 'commander';
(function () {
  const axios = require('axios');
  const queue = require('async/queue');
  const program = new Command();
  program
    .name(`node ${process.argv[1]}`)
    .argument('<string>', 'userChannelId')
    .option(
      '-a, --api-url-prefix <string>',
      'api url prefix',
      'http://127.0.0.1:3000/api',
    )
    .option('-c, --channel <string>', 'channel', 'email')
    .option('-s, --service-name <string>', 'service name', 'load')
    .option(
      '-n, --number-of-subscribers <int>',
      'number of subscribers. positive integer.',
      '1000',
    )
    .option(
      '-f, --broadcast-push-notification-filter <string>',
      'broadcast push notification filter',
      "contains_ci(title,'vancouver') || contains_ci(title,'victoria')",
    )
    .showHelpAfterError();
  program.parse();
  const opts = program.opts();
  const apiUrlPrefix = opts.apiUrlPrefix;
  const serviceName = opts.serviceName;
  const numberOfSubscribers = parseInt(opts.numberOfSubscribers);
  const channel = opts.channel;
  const broadcastPushNotificationFilter = opts.broadcastPushNotificationFilter;
  const userChannelId = program.args[0];
  let successCnt = 0;
  const q = queue(function (index: any, cb: () => void) {
    const options = {
      method: 'post',
      url: apiUrlPrefix + '/subscriptions',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        serviceName: serviceName,
        channel: channel,
        state: 'confirmed',
        index: index,
        confirmationRequest: {
          sendRequest: false,
        },
        userChannelId: userChannelId,
        broadcastPushNotificationFilter: broadcastPushNotificationFilter,
      },
    };
    axios
      .request(options)
      .then((data: {data: {index: any}}) => {
        console.log(data.data.index);
        successCnt++;
        cb();
      })
      .catch(function (error: any) {
        console.error(error);
        cb();
      });
  }, 100);
  q.drain(function () {
    console.log(`success count ${successCnt}`);
    process.exit(0);
  });
  let i = 0;
  /*jshint loopfunc:true */
  while (i < numberOfSubscribers) {
    q.push(i++);
  }
})();
