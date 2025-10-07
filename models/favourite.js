const {ObjectId} = require('mongodb');
const {getDb} = require("../utils/databaseUtil");

module.exports = class Favourite{
  constructor(houseId, homeName, price, location, rating, imageUrl, description, _id) {
    this.houseId = houseId
  }

  save() {
    const db = getDb();
    return db.collection("favourites").insertOne(this);
  }

  static getFavourites(callback) {
    const db = getDb();
    return db.collection("favourites").find().toArray();
  }

  static deleteById(homeId) {
    const db = getDb();
    return db.collection("favourites").deleteOne({ houseId: homeId }); // <-- houseId is string
  }

}