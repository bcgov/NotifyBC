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

(function () {
  const axios = require('axios');
  const queue = require('async/queue');
  const getOpt = require('node-getopt')
    .create([
      [
        'a',
        'api-url-prefix=<string>',
        'api url prefix. default to http://localhost:3000/api',
      ],
      ['c', 'channel=<string>', 'channel. default to email'],
      ['s', 'service-name=<string>', 'service name. default to load'],
      [
        'n',
        'number-of-subscribers=<int>',
        'number of subscribers. positive integer. default to 1000',
      ],
      [
        'f',
        'broadcast-push-notification-filter=<string>',
        "broadcast push notification filter. default to \"contains_ci(title,'vancouver') || contains_ci(title,'victoria')\"",
      ],
      ['h', 'help', 'display this help'],
    ])
    .bindHelp(
      'Usage: node ' +
        process.argv[1] +
        ' [Options] <userChannleId> \n[Options]:\n[[OPTIONS]]',
    );
  const args = getOpt.parseSystem();
  if (args.argv.length !== 1) {
    console.error('invalid arguments');
    getOpt.showHelp();
    process.exit(1);
  }
  const apiUrlPrefix =
    args.options['api-url-prefix'] || 'http://localhost:3000/api';
  const serviceName = args.options['service-name'] || 'load';
  const numberOfSubscribers =
    parseInt(args.options['number-of-subscribers']) || 1000;
  const channel = args.options['channel'] || 'email';
  const broadcastPushNotificationFilter =
    args.options['broadcast-push-notification-filter'] ||
    "contains_ci(title,'vancouver') || contains_ci(title,'victoria')";
  const userChannelId = args.argv[0];
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
  let i = 0;
  /*jshint loopfunc:true */
  while (i < numberOfSubscribers) {
    q.push(i++);
  }

  q.drain(function () {
    console.log(`success count ${successCnt}`);
    process.exit(0);
  });
})();
