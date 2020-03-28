async function job_relay () {

  const ckb = this.ckb;
  const dao = this.dao;
  console.log('block_header job starts');

  if (!await dao.lock_relay_scan()) {
    return;
  }

  try {

    let last_sync_ckb_height = await dao.get_last_ckb_scan();

    let last_relay_height = await dao.get_last_relay_scan();

    let blocks = await dao.get_ckb_blocks(last_relay_height + 1, last_sync_ckb_height);

    for (let i = 0; i < blocks.length; i++) {
      // scan if find target type script
    }

    //===================

  } catch (e) {
    console.log(e);
    return;
  }

}

module.exports = job_relay;
