const axios = require('axios');

async function get_tx_out_proof (tx0xHexString) {
  console.log('get_tx_out_proof fake data!!');
  
  let body = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_tx_out_proof',
    params: [
      [
        '0x4abc7eccea8e3b86610aad709ed0aa757d954bd02575b7b1edb085f2d8b39cf0'
        // tx0xHexString
      ]
    ]
  };

  try {

    let res = await axios({
      method: 'post',
      url: 'http://47.56.237.128:4114',
      headers: {'content-type': 'application/json'},
      data: body
    });

    //console.log(JSON.stringify(res.data));
    if (res.data.hasOwnProperty('error')) {
      console.log('get_tx_out_proof error');
      return null;
    }

    return (res.data.result);

  } catch (e) {
    console.log(e);
  }
}

module.exports=get_tx_out_proof;

get_tx_out_proof();

/*

```bash
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_tx_out_proof",
    "params": [
        [
            "0x365698b50ca0da75dca2c87f9e7b563811d3b5813736b8cc62cc3b106faceb17"
        ]
    ]
}' \
| tr -d '\n' \
| curl -H 'content-type: application/json' -d @- \
http://localhost:8114
```

```json
{
    "id": 2,
    "jsonrpc": "2.0",
    "result": {
        "indices": [
            0
        ],
        "lemmas": [
            "0x365698b50ca0da75dca2c87f9e7b563811d3b5813736b8cc62cc3b106faceb17"
        ]
    }
}
```

 */
