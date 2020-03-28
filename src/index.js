const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const CronJob = require('cron').CronJob;
const MongoClient = require('mongodb').MongoClient;
const MutaCaller = require('./muta_caller');
const Dao = require('./dao');

const job_scan_block = require('./job_scan_block');
const job_sync_block_to_muta = require('./job_sync_block_to_muta');
let mongoUri = 'mongodb://localhost:27017';

const nodeUrl = 'http://localhost:8114';

//const nodeUrl = 'http://47.56.237.128:4114'

async function main () {
  let mongoClient = await MongoClient.connect(mongoUri,
    {
      useUnifiedTopology: true,
      j: true,
      w: 1
    });

  const dao = new Dao(mongoClient);
  await dao.start();
  const ckb = new CKB(nodeUrl);

  const mutaClient = new MutaCaller();

  let context = {
    ckb: ckb,
    dao: dao,
    mutaClient: mutaClient
  };

  job_scan_block.apply(context);

  job_sync_block_to_muta.apply(context);

  /*let job = new CronJob(
    '0/5 * * * * *',
    block_header_job,
    null,
    null,
    null,
    context
  );
  job.start();*/

}

main();
