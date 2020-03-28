class deposit {
  constructor (muta) {
    this.muta = muta;
  }

  parseTx (tx) {
    let outputs = tx.outputs;
    for (let output in outputs) {
      if (output.hash === 'type script hash') ;
    }
  }
}
