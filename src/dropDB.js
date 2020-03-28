const MongoClient = require('mongodb').MongoClient;
const Dao = require('./dao');

let mongoUri = 'mongodb://localhost:27017';

async function main () {
  let mongoClient = await MongoClient.connect(mongoUri,
    {
      useUnifiedTopology: true,
      j: true,
      w: 1
    });
  const dao = new Dao(mongoClient);
  await dao.drop();
}

main()
