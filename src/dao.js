const MongoClient = require('mongodb').MongoClient;

class Dao {
  constructor (client) {

    let db = client.db('sccp');

    this.db = db;
    this.block_header_collection = db.collection('block_header');
    this.last_sync_collection = db.collection('last_sync');
    this.relay_collection = db.collection('relay');

  }
  async drop(){
    await this.block_header_collection.drop();
    await this.last_sync_collection.drop();
    await this.relay_collection.drop();
    console.log(`collection dropped`);

  }
  async start () {
    await this.block_header_collection.ensureIndex({'height': 1}, {unique: true});
    await this.last_sync_collection.ensureIndex({'class': 1}, {unique: true});
    await this.relay_collection.ensureIndex({'class': 1}, {unique: true});

    let record = await this.last_sync_collection.findOne({'class': 'last_sync'});

    if (record === null) {
      record = {
        class: 'last_sync',
        height: -1,
        running: false,
      };
      await this.last_sync_collection.insertOne(record);
    } else {
      await this.last_sync_collection.findOneAndUpdate(
        {class: 'last_sync'},
        {
          $set: {
            'running': false
          }
        },
        {upsert: true}
      );
    }

    record = await this.relay_collection.findOne({'class': 'relay'});

    if (record === null) {
      record = {
        class: 'relay',
        height: -1,
        running: false,
      };
      await this.relay_collection.insertOne(record);
    } else {
      await this.relay_collection.findOneAndUpdate(
        {class: 'relay'},
        {
          $set: {
            'running': false
          }
        },
        {upsert: true}
      );
    }
  }

  async lock_ckb_scan () {
    let record = await this.last_sync_collection.findOne({'class': 'last_sync'});
    if (record.running === true) {
      //console.log('block_header job is still running, exit');
      return false;
    }

    let originalOne = await this.last_sync_collection.findOneAndUpdate(
      {class: 'last_sync', running: false},
      {
        $set: {
          'running': true
        }
      },
      {upsert: false}
    );

    if (originalOne !== null) {
      return true;
    }
    return false;
  }

  async release_ckb_scan () {
    let originalOne = await this.last_sync_collection.findOneAndUpdate(
      {class: 'last_sync', running: true},
      {
        $set: {
          'running': false
        }
      },
      {upsert: false}
    );

    if (originalOne === null) {
      console.log('release_ckb_scan error');
    }
  }

  async get_last_ckb_scan () {
    let record = await this.last_sync_collection.findOne({'class': 'last_sync'});
    return record.height;

  }

  // i is number
  async update_last_ckb_scan (i) {
    await this.last_sync_collection.findOneAndUpdate(
      {class: 'last_sync'},
      {
        $set: {
          'height': i
        }
      },
      {upsert: false}
    );
  }

  //=======================ckb_block

  async insert_ckb_block (block) {

    let height = Number(block.header.number);
    block.height = height;
    await this.block_header_collection.findOneAndUpdate(
      {'header.number': block.header.number},
      {$set: block},
      {upsert: true}
    );
  }

  async get_ckb_blocks (from, to) {
    let cursor = await this.block_header_collection.find(
      {'height': {$gte: from, $lte: to}},
      {sort: {'height': 1}}
    );
    let data = await cursor.toArray();
    return data;
  };

  //=======================relay

  async lock_relay_scan () {
    let record = await this.relay_collection.findOne({'class': 'relay'});
    if (record.running === true) {
      //console.log('relay job is still running, exit');
      return false;
    }

    let originalOne = await this.relay_collection.findOneAndUpdate(
      {class: 'relay', running: false},
      {
        $set: {
          'running': true
        }
      },
      {upsert: false}
    );

    if (originalOne !== null) {
      return true;
    }
    return false;
  }

  async release_relay_scan () {
    let originalOne = await this.relay_collection.findOneAndUpdate(
      {class: 'relay', running: true},
      {
        $set: {
          'running': false
        }
      },
      {upsert: false}
    );

    if (originalOne === null) {
      console.log('release_relay_scan error');
    }
  }

  async get_last_relay_scan () {
    let record = await this.relay_collection.findOne({'class': 'relay'});
    return record.height;

  }

  // i is number
  async update_last_relay_scan (i) {
    await this.relay_collection.findOneAndUpdate(
      {class: 'relay'},
      {
        $set: {
          'height': i
        }
      },
      {upsert: false}
    );
  }

}

module.exports = Dao;
