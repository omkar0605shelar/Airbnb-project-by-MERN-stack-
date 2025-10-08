const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema(
  {
    homeId:{
      required:true,
      unique:true,
      type:mongoose.Schema.Types.ObjectId,
      ref:'Home'
    }
  }
);

module.exports = mongoose.model("Favourite", favouriteSchema)