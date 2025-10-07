const {mongoConnect, getDb} = require('../utils/databaseUtil');
const {ObjectId} = require('mongodb');

module.exports = class Home {
  constructor(homeName, price, location, rating, imageUrl, description, _id) {
    this.homeName = homeName;
    this.price = price;
    this.location = location;
    this.rating = rating; 
    this.imageUrl = imageUrl;
    this.description = description; 
    if(_id){
      this._id = _id;
    }
  }

  save() {
    const db = getDb();
    if(this._id){ // update

      const updateFields = {homeName : this.homeName,
        price : this.price,
        location : this.location,
        rating : this.rating, 
        imageUrl : this.imageUrl,
        description : this.description
      }

      return db.collection("homes").updateOne({_id : new ObjectId(String(this._id))}, { $set: updateFields});
    }
    else{  // insert
      return db.collection("homes").insertOne(this).then((result) => {
        console.log(result);
      })
    }
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("homes").find().toArray();
  }

  static findById(homeId) {
    console.log(homeId);
    const db = getDb();
    return db.collection("homes").find({_id : new ObjectId(String(homeId)) })
    .next();
  }

  static deleteById(homeId) {
    const db = getDb();

    return db.collection("homes").deleteOne({_id : new ObjectId(String(homeId))});
  }
}