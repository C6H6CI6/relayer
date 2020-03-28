const MutaCaller = require('./muta_caller');
const mutaClient = new MutaCaller();
const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const ckbUrl = 'http://47.56.237.128:4114';
const ckb = new CKB(ckbUrl);

const get_tx_out_proof = require('./get_tx_out_proof');
const Composer = require('./ckb_tx_composer');
const Action = require('./action');
let snakeCaseKeys = require('snakecase-keys');
let camel = require('camelcase-keys')

const fs = require('fs');

(async function f () {
  let composer = new Composer();
  const action = new Action(ckb, mutaClient);

  let block = await ckb.rpc.getBlock('0x65a43af2aea451f6cae553802561293b8feb47ac1950eb519baab273fcadd0af');
  block = snakeCaseKeys(block);

  for (let j = 0; j < block.transactions.length; j++) {
    let tx = block.transactions[j];

    for (let k = 0; k < tx.outputs.length; k++) {

      let output = tx.outputs[k];
      if (output.hasOwnProperty('type') && output.type !== null
        && output.type.hasOwnProperty('code_hash') && output.type.hasOwnProperty('args')
        && output.type.code_hash === '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5'
        && output.type.args === '0x6666666666666666666666666666666666666666') {

        //tx = camel(tx,{deep:true});

        console.log(`find type code_hash in tx ${tx.hash}`);

        await action.judge(tx, k);

        break;
      }
    }
  }

})();
