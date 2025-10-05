const fs = require('fs');
const path = require('path');

const favouriteDataPath = path.join(__dirname, "../" , 'data', 'favourite.json');

module.exports = class Favourite{

    // Favourite.js
  static addToFavourite(homeId, callback) {
    this.getFavourites((favourites) => {
      if (favourites.includes(homeId)) {
        console.log('Home is already marked');

        callback();
      }
      else{
        favourites.push(homeId);
        fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
      } 
    });
  }

  static getFavourites(callback) {
    fs.readFile(favouriteDataPath, (err, data) => {
      if(!err){
        callback(JSON.parse(data));
      }
      else{
        callback([]);
      }
    })
  }

  static deleteById(homeId, callback) {
      Favourite.getFavourites((homeIds) => {
        homeIds = homeIds.filter((h) => h.id !== homeId);
  
        fs.writeFile(favouriteDataPath, JSON.stringify(homeIds), callback); 
      })
  }
}