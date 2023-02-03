const mongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb://127.0.0.1:27017/TrackerQC";
let mongodb;
let psqldb;
const { Client } = require("pg");

const connectDb = async () => {
    try {
        const client = new Client({
            user: "anon",
            host: "127.0.0.1",
            database: "",
            password: "",
            port: 5432
        })
        await client.connect()
	psqldb = client;
        const res = await client.query('SELECT * FROM panels WHERE id=181;')
        console.log(res.rows)
//        await client.end()
    } catch (error) {
        console.log(error)
    }
}

function connect(callback){
  mongoClient.connect(dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
    mongodb = db;
    callback();
  });
}
function get(){
    //  return mongodb;
    return psqldb;
}

function close(){
    //  mongodb.close();
    psqldb.end()
}

module.exports = {
  connect,
  get,
    close,
    connectDb
};
