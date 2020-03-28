async function job_sync_block_to_muta () {
  const mutaCaller = this.mutaClient;
  const dao = this.dao;

  let last_committed = await mutaCaller.get_lasted_ckb_header_height();
  console.log(`last_committed ${last_committed}`);

  let last_synced = await dao.get_last_ckb_scan();
  console.log(`last_synced ${last_synced}`);
  let headers = null;

  if (last_committed >= last_synced) {
    console.log(`job_sync_block_to_muta, last_committed ${last_committed}, ${last_synced}, nothing to do`);
    return;
  }

  let blocks = await dao.get_ckb_blocks(last_committed + 1, last_synced);
  headers = blocks.map((block) => block.header);
  console.log(`job_sync_block_to_muta, commit [${last_committed + 1},${last_synced}] to Muta`);
  mutaCaller.commit_ckb_header(headers);
}

async function submit_ckb_block () {

}

module.exports = job_sync_block_to_muta;