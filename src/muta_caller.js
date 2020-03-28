let Muta = require('muta-sdk').Muta;
let snakeCaseKeys = require('snakecase-keys');

class MutaCaller {
  constructor () {
    let muta = new Muta({
      chainId:
        '0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036',
      endpoint: 'http://47.56.237.128:4321/graphql',
      timeoutGap: 5,
    });
    this.client = muta.client();

    //0x12d8baf8c4efb32a7983efac2d8535fe57deb756
    let account = Muta.accountFromPrivateKey('0x592d6f62cd5c3464d4956ea585ec7007bcf5217eb89cc50bf14eea95f3b09706');
    this.account = account;
  }

  //this is a test for connexion
  async get_latest_block_height () {
    let height = await this.client.getLatestBlockHeight();
    console.log(`MutaCaller test ${height}`);
  }

  async get_lasted_ckb_header_height () {
    const servicePayload = {
      caller: this.account.address,
      method: 'get_ckb_status',
      payload: '',
      serviceName: 'mulimuli',
    };

    const res = await this.client.queryServiceDyn(servicePayload);

    if (res.isError === true) {
      console.log(`get_ckb_status error: ${JSON.stringify(res)}`);
    }

    return res.ret.height === null ? -1 : res.ret.height;
  }

  async commit_ckb_header (headers) {

    for (let i = 0; i < headers.length; i++) {
      delete headers[i].hash;

      try {
        let payload = {headers: [headers[i]]};
        payload = JSON.stringify(snakeCaseKeys(payload), null, 2);
        //console.log(payload)

        const tx = await this.client.composeTransaction({
          method: 'update_ckb',
          payload,
          serviceName: 'mulimuli',
        });

        let signedTx = this.account.signTransaction(tx);

        const txHash = await this.client.sendTransaction(signedTx);

        const receipt = await this.client.getReceipt(this.toHex(txHash));

        console.log(`committed ${headers[i].number} to Muta`);

        if (receipt.response.isError) {
          console.log('update_ckb error \n' + JSON.stringify(receipt, null, 2));
        }

      } catch (e) {
        console.log('error !!! \n' + JSON.stringify(e,null,2));
      }
    }
  }

  async deposit(tx,merkle_path){
    let payload = {
      tx: tx,
      merkle_path : merkle_path
    };

    const servicePayload = {
      caller: this.account.address,
      method: 'deposit_ckb',
      payload: JSON.stringify(snakeCaseKeys(payload),null,2),
      serviceName: 'mulimuli',
    };

    const res = await this.client.queryServiceDyn(servicePayload);

    if (res.isError === true) {
      console.log(`deposit error: ${JSON.stringify(res)}`);
    }
  }

  async refund(tx,merkle_path){
    let payload = {
      tx: tx,
      merkle_path : merkle_path
    };

    const servicePayload = {
      caller: this.account.address,
      method: 'refund_ckb',
      payload: JSON.stringify(snakeCaseKeys(payload),null,2),
      serviceName: 'mulimuli',
    };

    const res = await this.client.queryServiceDyn(servicePayload);

    if (res.isError === true) {
      console.log(`refund error: ${JSON.stringify(res)}`);
    }
  }

  async create_asset(tx,indices,lemmas){
    let payload = {
      indices: indices,
      lemmas : lemmas
    };

    const servicePayload = {
      caller: this.account.address,
      method: 'create_asset',
      payload: JSON.stringify(snakeCaseKeys(payload),null,2),
      serviceName: 'mulimuli',
    };

    const res = await this.client.queryServiceDyn(servicePayload);

    if (res.isError === true) {
      console.log(`create_asset error: ${JSON.stringify(res)}`);
    }
  }

  async burn_asset(tx,indices,lemmas){
    let payload = {
      indices: indices,
      lemmas : lemmas
    };

    const servicePayload = {
      caller: this.account.address,
      method: 'burn_asset',
      payload: JSON.stringify(snakeCaseKeys(payload),null,2),
      serviceName: 'mulimuli',
    };

    const res = await this.client.queryServiceDyn(servicePayload);

    if (res.isError === true) {
      console.log(`burn_asset error: ${JSON.stringify(res)}`);
    }
  }

  toHex (x) {
    if (typeof x === 'string') {
      if (x.startsWith('0x')) {
        return x;
      }
      return '0x' + x;
    }
    if (typeof x === 'number') {
      const hex = Number(x).toString(16);
      return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
    }
    return '0x' + x.toString('hex');
  }
}

module.exports = MutaCaller;
