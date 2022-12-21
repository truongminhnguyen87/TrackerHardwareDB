const mongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb://127.0.0.1:27017/TrackerQC";
let mongodb;

function connect(callback){
  mongoClient.connect(dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
    mongodb = db;
    callback();
  });
}
function get(){
  return mongodb;
}

function close(){
  mongodb.close();
}

module.exports = {
  connect,
  get,
  close
};
