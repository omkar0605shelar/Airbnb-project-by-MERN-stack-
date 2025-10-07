const { ObjectId } = require('mongodb');
const { getDb } = require("../utils/databaseUtil");

module.exports = class Favourite {
  constructor(houseId) {
    // Always save ID as string for consistent comparison
    this.houseId = houseId.toString();
  }

  async save() {
    const db = getDb();

    const existing = await db.collection("favourites").findOne({ houseId: this.houseId });

    if (existing) {
      console.log("Favourite already exists:", this.houseId);
      return; 
    }

    return db.collection("favourites").insertOne(this);
  }


  static getFavourites() {
    const db = getDb();
    return db.collection("favourites").find().toArray();
  }

  static deleteById(homeId) {
    const db = getDb();
    // Convert to string before deletion for consistency
    return db.collection("favourites").deleteOne({ houseId: homeId.toString() });
  }
};
