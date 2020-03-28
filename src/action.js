const Composer = require('./ckb_tx_composer');
const get_tx_out_proof = require('./get_tx_out_proof');
const camel = require('camelcase-keys');

class Action {
  constructor (ckb, mutaClient) {
    this.composer = new Composer();
    this.ckb = ckb;
    this.mutaClient = mutaClient;
  }

  async judge (tx, index) {
    if (tx.outputs_data.length === 1 && tx.outputs_data[0].startsWith('0x02')) {
      await this.charge(tx, index);
    } else if (
      tx.outputs_data.length === 2 && (
      (tx.outputs_data[0].startsWith('0x08') && tx.outputs_data[1].startsWith('0x04')) ||
      (tx.outputs_data[0].startsWith('0x04') && tx.outputs_data[1].startsWith('0x08')))
    ) {
      await this.withdraw(tx);
    }
  }

  async charge (tx, index) {
    //info muta
    let proof = await get_tx_out_proof(tx.hash);
    //let proof_hex = await this.mutaClient.create_asset(tx, proof.indices, proof.lemmas);
    //compose ctx_tx

    let outputdata = '0x04' + tx.outputs_data[0].substring(4);
    let capacity = tx.outputs[index].capacity;
    let ckb_tx = this.composer.charge(outputdata, capacity, index, tx.hash);

    //console.log(JSON.stringify(ckb_tx, null, 2));

    ckb_tx = camel(ckb_tx, {deep: true});
    for (let i = 0; i < ckb_tx.cellDeps.length; i++) {
      if (ckb_tx.cellDeps[i].depType === 'dep_group') {
        ckb_tx.cellDeps[i].depType = 'depGroup';
      }
    }

    let hash = this.ckb.utils.rawTransactionToHash(ckb_tx);
    // ckb_tx.hash=hash;
    let res = await this.ckb.rpc.sendTransaction(ckb_tx);
    //console.log(`charge res : \n${JSON.stringify(res, null, 2)}`);
  }

  async withdraw (tx) {
    let proof = await get_tx_out_proof(tx.hash);
    let proof_hex = await this.mutaClient.burn_asset(tx, proof.indices, proof.lemmas);

    //compose ctx_tx
    let index = null;
    if (tx.outputs_data[0].startsWith('0x08')) {
      index = 0;
    } else if (tx.outputs_data[1].startsWith('0x08')) {
      index = 1;
    } else {
      console.log(`withdraw output state error`);
    }
    let outputdata = '0x01' + tx.outputs_data[index].substring(4);
    let capacity = tx.outputs[index].capacity;
    let lock_args = tx.outputs[index].lock.args;
    let ckb_tx = this.composer.withdraw(outputdata, capacity, index, tx.hash,lock_args);

    //console.log(JSON.stringify(ckb_tx, null, 2));

    ckb_tx = camel(ckb_tx, {deep: true});
    for (let i = 0; i < ckb_tx.cellDeps.length; i++) {
      if (ckb_tx.cellDeps[i].depType === 'dep_group') {
        ckb_tx.cellDeps[i].depType = 'depGroup';
      }
    }

    let hash = this.ckb.utils.rawTransactionToHash(ckb_tx);
    // ckb_tx.hash=hash;
    let res = await this.ckb.rpc.sendTransaction(ckb_tx);
    //console.log(`withdraw res : \n${JSON.stringify(res, null, 2)}`);
  }
}

module.exports = Action;
