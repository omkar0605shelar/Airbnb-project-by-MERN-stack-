// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

const {MongoClient} = require("mongodb");

const url = "mongodb+srv://shelaromkar313_db_user:Shelar321@clustertest.0zmobsm.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest";

let _db;

const mongoConnect = (callback) => {  // Creates new Promise((resolve, reject) => { 
   MongoClient.connect(url)  // Resolve process of promieses
  .then((client) =>{
    console.log("Connected to mongoDB");
    _db = client.db("airbnb");
    callback();
  })
  .catch((err) => {
    console.log(err, " Error occurs");
  })
}

const getDb = () =>{
  if(_db){
    return _db;
  }

  throw new Error("No database Found");
}
module.exports = {mongoConnect, getDb};