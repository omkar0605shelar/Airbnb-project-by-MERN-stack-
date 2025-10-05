const {MongoClient} = require("mongodb");

const url = "mongodb+srv://shelaromkar313_db_user:Shelar321@clustertest.0zmobsm.mongodb.net/";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(url)
  .then((client) =>{
    console.log("Connected to mongoDB");
    _db = client.db("airbnb");
    callback(client);
  })
  .catch((err) => {
    console.log(err, " Error occurs");
  })
}

const getDb = () =>{
  if(_db){
    return _db;
  }

  throw "No database Found";
}
module.exports = {mongoConnect, getDb};