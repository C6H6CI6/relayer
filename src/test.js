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

  tx.outputs_data = ['0x' +
  '02' +
  'ff00000000000000' +
  '12d8baf8c4efb32a7983efac2d8535fe57deb756'
  ];

  let a = await mutaClient.create_asset(tx, proof.indices, proof.lemmas);

  console.log();
})();
