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
  const request = require('axios');
  if (process.argv.length < 2) {
    process.exit(1);
  }

  const options = {
    method: 'post',
    url: process.argv[2] + '/notifications',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      serviceName: process.argv[3] || 'load10',
      message: {
        from: process.argv[4] || 'no_reply@invlid.local',
        subject: '{title}',
        textBody: '{description}',
        htmlBody:
          "{description}<p><a href='{link}'>link</a><a href='{unsubscription_url}'>nsubscription</a></p>",
      },
      channel: 'email',
      isBroadcast: true,
      data: {
        title: 'Despite unpopularity, Victoria fadsasdfasd',
        description:
          'Lorem ipsum dolor sit amet, facete debitis dolores nam eu, nemore voluptatum interesset at mel. Duo et legimus vituperata, mei adipisci prodesset conclusionemque an. Mnesarchum adversarium eam eu, ad postea labore vituperatoribus eam. Dicam convenire vis ei, id vis quod luptatum. Expetenda consequat at quo, mel inermis volumus intellegam ut, mei vocibus inciderint ea. At error viris has.',
        pubDate: '2017-07-20T16:18:04.000Z',
        link: 'http://foo.com',
        guid: '12356',
      },
    },
  };
  request
    .request(options)
    .then((response: {statusCode: string; data: any}) => {
      console.log('response.statusCode=' + response.statusCode);
      console.log(response.data);
      process.exit(0);
    })
    .catch((err: any) => {
      console.error(err);
    });
})();
