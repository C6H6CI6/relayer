const get_tx_out_proof = require('./get_tx_out_proof');
const Action = require('./action');

async function job_relay () {

  const ckb = this.ckb;
  const dao = this.dao;
  const mutaCaller = this.mutaClient;
  const action = new Action(ckb,mutaCaller);

  console.log('relay job starts');

  try {

    if (!await dao.lock_relay_scan()) {
      return;
    }

    console.log(`job_relay starts`);

    let last_sync_ckb_height = await dao.get_last_ckb_scan();

    let last_relay_height = await dao.get_last_relay_scan();

    console.log(`job_relay ${last_relay_height} -->  ${last_sync_ckb_height}`);

    for (let i = last_relay_height + 1; i <= last_sync_ckb_height; i++) {
      let block = (await dao.get_ckb_blocks(i, i))[0];
      for (let j = 0; j < block.transactions.length; j++) {
        let tx = block.transactions[j];

        for (let k = 0; k < tx.outputs.length; k++) {

          let output = tx.outputs[k];
          if (output.hasOwnProperty('type') && output.type !== null
            && output.type.hasOwnProperty('code_hash') && output.type.hasOwnProperty('args')
            && output.type.code_hash === '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5'
            && output.type.args === '0x6666666666666666666666666666666666666666') {

            console.log(`find type code_hash in tx ${tx.hash}`);

            await action.judge(tx,k);

            break;
          }
        }
      }

      await dao.update_last_relay_scan(i);
    }

    //===================

  } catch (e) {
    console.log(e);
  }
  await dao.release_relay_scan();

}

module.exports = job_relay;
