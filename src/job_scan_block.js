async function job_scan_block () {

  const ckb = this.ckb;
  const dao = this.dao;
  console.log('block_header job starts');

  if (!await dao.lock_ckb_scan()) {
    return;
  }

  try {

    let last_sync_ckb_height = BigInt(await dao.get_last_ckb_scan());

    let current_block_number = BigInt(await ckb.rpc.getTipBlockNumber());

    for (let i = last_sync_ckb_height + BigInt(1); i <= current_block_number; i++) {
      let block = await ckb.rpc.getBlockByNumber(i);

      console.log(`Get Block ${i.toString()}`);

      //save header and send to Muta
      await dao.insert_ckb_block(block);

      await dao.update_last_ckb_scan(Number(i));
    }

    //===================

  } catch (e) {
    console.log(e);
    return;
  }

}

module.exports = job_scan_block;
