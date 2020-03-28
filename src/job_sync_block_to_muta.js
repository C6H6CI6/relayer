async function job_sync_block_to_muta () {
  const mutaCaller = this.mutaClient;
  const dao = this.dao;

  try {
    if (this.sync_block_to_muta_lock === false) {
      this.sync_block_to_muta_lock = true;
    } else {
      return;
    }

    let last_committed = await mutaCaller.get_lasted_ckb_header_height();

    let last_synced = await dao.get_last_ckb_scan();

    //console.log(`job_sync_block_to_muta ${last_committed} --> ${last_synced}`);

    let headers = null;

    if (last_committed >= last_synced) {
      //console.log(`job_sync_block_to_muta, last_committed ${last_committed}, ${last_synced}, nothing to do`);
      this.sync_block_to_muta_lock = false;
      return;
    }

    let blocks = await dao.get_ckb_blocks(last_committed + 1, last_synced);
    headers = blocks.map((block) => block.header);
    //console.log(`job_sync_block_to_muta, commit [${last_committed + 1},${last_synced}] to Muta`);
    mutaCaller.commit_ckb_header(headers);
  }catch (e) {
    this.sync_block_to_muta_lock = false;
  }

  this.sync_block_to_muta_lock = false;
}

async function submit_ckb_block () {

}

module.exports = job_sync_block_to_muta;
