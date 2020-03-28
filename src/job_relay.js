const get_tx_out_proof = require('./get_tx_out_proof');

async function job_relay () {

  const ckb = this.ckb;
  const dao = this.dao;
  const mutaCaller = this.mutaClient;

  console.log('block_header job starts');

  if (!await dao.lock_relay_scan()) {
    return;
  }

  try {

    let last_sync_ckb_height = await dao.get_last_ckb_scan();

    let last_relay_height = await dao.get_last_relay_scan();

    for (let i = last_relay_height + 1; i < last_sync_ckb_height; i++) {
      let block = await dao.get_ckb_blocks(i, i);
      for (let tx in block.transactions) {
        for (output in tx.outputs) {
          if (output.hasOwnProperty('type') && output.type.code_hash === '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5') {
            console.log(`find type code_hash in tx ${tx.hash}`);

            let proof = await get_tx_out_proof(tx.hash);

            let a = await mutaCaller.deposit(tx,proof.indices,proof.lemmas)
          }
        }
      }
    }

    //===================

  } catch (e) {
    console.log(e);
    return;
  }

}

module.exports = job_relay;
