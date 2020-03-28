const axios = require('axios');

async function get_tx_out_proof (tx0xHexString) {
  let body = {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_tx_out_proof',
    params: [
      [
        //"0x365698b50ca0da75dca2c87f9e7b563811d3b5813736b8cc62cc3b106faceb17"
        tx0xHexString
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

    console.log(JSON.stringify(res.data));

    return (res.data);
  } catch (e) {
    console.log(e);
  }
}

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
