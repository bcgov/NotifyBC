(function () {
  const request = require('axios');
  const csv = require('csvtojson');
  const queue = require('async/queue');
  const getOpt = require('node-getopt')
    .create([
      [
        'a',
        'api-url-prefix=<string>',
        'api url prefix. default to http://localhost:3000/api',
      ],
      [
        'c',
        'concurrency=<int>',
        'post request concurrency. positive integer. default to 10',
      ],
      ['h', 'help', 'display this help'],
    ])
    .bindHelp(
      'Usage: node ' +
        process.argv[1] +
        ' [Options] <csv-file-path>\n[Options]:\n[[OPTIONS]]',
    );
  const args = getOpt.parseSystem();
  if (args.argv.length !== 1) {
    console.error('invalid arguments');
    getOpt.showHelp();
    process.exit(1);
  }
  if (
    args.options.concurrency &&
    (isNaN(parseInt(args.options.concurrency)) ||
      parseInt(args.options.concurrency) <= 0)
  ) {
    console.error('invalid option concurrency');
    getOpt.showHelp();
    process.exit(1);
  }

  let done = false,
    successCnt = 0;
  const q = queue(function (
    task: {jsonObj: any; rowIdx: string},
    cb: Function,
  ) {
    const options = {
      method: 'post',
      url:
        (args.options['api-url-prefix'] || 'http://localhost:3000/api') +
        '/subscriptions',
      headers: {
        'Content-Type': 'application/json',
      },
      data: task.jsonObj,
    };
    request
      .request(options)
      .then((data: {statusCode: number}) => {
        if (data.statusCode !== 200) {
          throw data.statusCode;
        }
        successCnt++;
        cb();
      })
      .catch((err: any) => {
        console.error('error for row #' + task.rowIdx + ': ' + err);
        cb(err);
      });
  },
  parseInt(args.options.concurrency) || 10);
  q.drain = function () {
    if (done) {
      console.log('success row count = ' + successCnt);
      process.exit(0);
    }
  };

  csv({
    colParser: {
      'confirmationRequest.sendRequest': (
        item: string,
        head: any,
        resultRow: any,
        row: any,
        colIdx: any,
      ) => {
        try {
          return item.toLowerCase() === 'true';
        } catch (ex) {
          return item;
        }
      },
    },
  })
    .fromFile(args.argv[0])
    .on('json', (jsonObj: any, rowIdx: any) => {
      q.push({
        jsonObj: jsonObj,
        rowIdx: rowIdx,
      });
    })
    .on('done', (error: any) => {
      error && console.error(error);
      done = true;
    });
})();
