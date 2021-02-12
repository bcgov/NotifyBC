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
  const queue = require('async/queue');
  const nodemailer = require('nodemailer');
  let successCnt = 0;
  const transporter = nodemailer.createTransport({
    host: process.argv[2] || 'localhost',
    secure: false,
    port: 25,
    pool: true,
    direct: false,
    maxMessages: process.argv[7] || 99999,
    maxConnections: process.argv[5] || 5,
  });

  const bodyUnit =
    'Lorem ipsum dolor sit amet, facete debitis dolores nam eu, nemore voluptatum interesset at mel. Duo et legimus vituperata, mei adipisci prodesset conclusionemque an. Mnesarchum adversarium eam eu, ad postea labore vituperatoribus eam. Dicam convenire vis ei, id vis quod luptatum. Expetenda consequat at quo, mel inermis volumus intellegam ut, mei vocibus inciderint ea. At error viris has.';
  const body = bodyUnit.repeat(parseInt(process.argv[8]) || 1);

  const q = queue(function (_task: any, cb: (arg0: any) => any) {
    const mailOptions = {
      from: 'noreply@invlid.local',
      to: process.argv[3] || 'test@invlid.local',
      subject: 'Despite unpopularity, Victoria fadsasdfasd',
      text: body,
    };
    transporter.sendMail(mailOptions, function (error: any, info: any) {
      try {
        if (!error && info.accepted.length < 1) {
          error = new Error('delivery failed');
        } else {
          successCnt++;
        }
      } catch (ex) {}
      cb?.(error);
    });
  }, process.argv[6] || 1000);
  q.drain = function () {
    console.log('successCnt=' + successCnt);
    process.exit(0);
  };

  const tasks = [];
  let i = 0;
  while (i < (process.argv[4] || 1000)) {
    tasks.push({});
    i++;
  }
  q.push(tasks, function (error: any) {
    error && console.error(error);
  });
})();
