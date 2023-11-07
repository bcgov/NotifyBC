import { queue } from 'async';
import { Command } from 'commander';
import csv from 'csvtojson';

(function () {
  const program = new Command();
  program
    .name(`node ${process.argv[1]}`)
    .argument('<string>', 'csv file path')
    .option(
      '-a, --api-url-prefix <string>',
      'api url prefix',
      'http://127.0.0.1:3000/api',
    )
    .option(
      '-c, --concurrency <int>',
      'post request concurrency. positive integer.',
      '10',
    )
    .showHelpAfterError();
  program.parse();
  const opts = program.opts();

  if (
    opts.concurrency &&
    (isNaN(parseInt(opts.concurrency)) || parseInt(opts.concurrency) <= 0)
  ) {
    console.log('Error: invalid concurrency');
    program.help();
  }

  let done = false,
    successCnt = 0;

  const q = queue(function (
    task: { jsonObj: any; rowIdx: string },
    cb: Function,
  ) {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task.jsonObj),
    };
    fetch(opts.apiUrlPrefix + '/subscriptions', options)
      .then((data: { status: number }) => {
        if (data.status !== 200) {
          throw data.status;
        }
        successCnt++;
        cb();
      })
      .catch((err: any) => {
        console.error('error for row #' + task.rowIdx + ': ' + err);
        cb(err);
      });
  },
  parseInt(opts.concurrency));
  q.drain(function () {
    if (done) {
      console.log('success row count = ' + successCnt);
      process.exit(0);
    }
  });

  csv({
    colParser: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
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
    .fromFile(program.args[0])
    .subscribe(
      (jsonObj, rowIdx) => {
        q.push({
          jsonObj,
          rowIdx,
        });
      },
      (error) => {
        console.error(error);
      },
      () => (done = true),
    );
})();
