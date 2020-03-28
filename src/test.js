const MutaCaller = require('./muta_caller');
const mutaClient = new MutaCaller();
const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const nodeUrl = 'http://47.56.237.128:4114';
const ckb = new CKB(nodeUrl);

const get_tx_out_proof = require('./get_tx_out_proof');

(async function f () {
  let res = await ckb.rpc.getTransaction('0x86e0268d09c861cc3054c72bf97bd676061311d78b14fee0959d93492ea1bbbf');
  let tx = res.transaction;
  let proof = await get_tx_out_proof(tx.hash);

  //fake outputs

  //little endian
  let temp_outputs_data= '02' + //state
    'ff00000000000000' + //amount little endian
    '12d8baf8c4efb32a7983efac2d8535fe57deb101' //address


 // temp_outputs_data = Uint8Array.from(Buffer.from(temp_outputs_data, 'hex'));
 // temp_outputs_data.reverse();
 // temp_outputs_data = '0x' + Buffer.from(temp_outputs_data).toString('hex');
  tx.outputsData = ['0x'+ temp_outputs_data];

  //不使用返回的output_data 因为数据不对
  let r = await mutaClient.create_asset(tx, proof.indices, proof.lemmas);
  console.log(JSON.stringify(r, null, 2));
  //acef83792ab3efc4f8bad81200000000000000ff02

})();
