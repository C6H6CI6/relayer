async function job_scan_block () {

  const ckb = this.ckb;
  const dao = this.dao;

  try {

    if (!await dao.lock_ckb_scan()) {
      return;
    }

    let last_sync_ckb_height = BigInt(await dao.get_last_ckb_scan());

    let current_block_number = BigInt(await ckb.rpc.getTipBlockNumber());

    console.log(`job_scan_block ${last_sync_ckb_height} -->  ${current_block_number}`);


    for (let i = last_sync_ckb_height + BigInt(1); i <= current_block_number; i++) {
      let block = await ckb.rpc.getBlockByNumber(i);

      //console.log(`Get Block ${i.toString()}`);

      //save header and send to Muta
      await dao.insert_ckb_block(block);

      await dao.update_last_ckb_scan(Number(i));
    }

    //===================

  } catch (e) {
    console.log(e);
  }
  await dao.release_ckb_scan();

}

module.exports = job_scan_block;
