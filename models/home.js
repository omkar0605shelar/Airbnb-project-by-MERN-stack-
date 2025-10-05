const db = require('../utils/databaseUtil');

module.exports = class Home {
  constructor(homeName, price, location, rating, imageUrl, description, id) {
    this.homeName = homeName
    this.price = price,
    this.location = location,
    this.rating = rating, 
    this.imageUrl = imageUrl,
    this.description = description, 
    this.id = id
  }

  save() {
    
  }

  static fetchAll() {
    
  }

  static findById(homeId) {
    
  }

  static deleteById(homeId) {
    
  }
}