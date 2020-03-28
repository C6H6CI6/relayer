class Composer {
  constructor () {}

  charge (outputdata,capacity,input_index,input_tx_hash) {
    return {
      'cell_deps': [
        { //secp 的代码
          'dep_type': 'dep_group',
          'out_point': {
            'index': '0x0',
            'tx_hash': '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708'
          }
        },
        {
          'dep_type': 'code',
          'out_point': {
            'index': '0x0',
            'tx_hash': '0xf7010c6447f6d560ad05a797cc3547a4084ebb6bb89ac7f2fdd6330ebfb602a2'
          }
        }
      ],
      'header_deps': [],
      'inputs': [
        {
          'previous_output': {
            'index': '0x'+input_index.toString(16),
            'tx_hash': input_tx_hash
          },
          'since': '0x0'
        }
      ],
      'outputs': [
        {
          'capacity': capacity,
          'lock': {
            'args': '0x0000000000000000000000000000000000000000',
            'code_hash': '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5',
            'hash_type': 'type'
          },
          'type': {
            'args': '0x6666666666666666666666666666666666666666',
            'code_hash': '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5',
            'hash_type': 'data'
          }
        }
      ],
      'outputs_data':[outputdata],
      //  [
        //"0x7b22616d6f756e74223a20333030302c20226d7574615f61646472657373223a2022307866383338396437373461666461643837353565663865363239653561313534666464633633323561227d"
      //],
      'version': '0x0',
      'witnesses': [
        this.genHexString(170)
        //"0x5500000010000000550000005500000041000000f01a210517cf762df9afd853d311acb79e8d0f20af4e2452c3df127955d62a16712031548c2b4de1c3fab3a387cb899b41548f3817f4e70d45c6fc09e12fa7f400"
      ]
    };
  }


  withdraw (outputdata,capacity,input_index,input_tx_hash,lock_args) {
    return {
      'cell_deps': [
        { //secp 的代码
          'dep_type': 'dep_group',
          'out_point': {
            'index': '0x0',
            'tx_hash': '0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708'
          }
        },
        {
          'dep_type': 'code',
          'out_point': {
            'index': '0x0',
            'tx_hash': '0xf7010c6447f6d560ad05a797cc3547a4084ebb6bb89ac7f2fdd6330ebfb602a2'
          }
        }
      ],
      'header_deps': [],
      'inputs': [
        {
          'previous_output': {
            'index': '0x'+input_index.toString(16),
            'tx_hash': input_tx_hash
          },
          'since': '0x0'
        }
      ],
      'outputs': [
        {
          'capacity': capacity,
          'lock': {
            'args': lock_args,
            'code_hash': '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5',
            'hash_type': 'type'
          },
          'type': {
            'args': '0x6666666666666666666666666666666666666666',
            'code_hash': '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5',
            'hash_type': 'data'
          }
        }
      ],
      'outputs_data':[outputdata],
      //  [
      //"0x7b22616d6f756e74223a20333030302c20226d7574615f61646472657373223a2022307866383338396437373461666461643837353565663865363239653561313534666464633633323561227d"
      //],
      'version': '0x0',
      'witnesses': [
        this.genHexString(170)
        //"0x5500000010000000550000005500000041000000f01a210517cf762df9afd853d311acb79e8d0f20af4e2452c3df127955d62a16712031548c2b4de1c3fab3a387cb899b41548f3817f4e70d45c6fc09e12fa7f400"
      ]
    };
  }

  genHexString (len) {
    let output = '';
    for (let i = 0; i < len; ++i) {
      output += (Math.floor(Math.random() * 16)).toString(16);
    }
    return '0x'+output;
  }

}

module.exports = Composer;
