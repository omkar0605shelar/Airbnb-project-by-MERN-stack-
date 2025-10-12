const Home  = require('../models/home');
const fs = require('fs');
const path = require('path');

// Add new home
exports.getAddHome = (req, res, next) => {
  res.render('host/edit-Home', {
    pageTitle: 'Register Homes', 
    currentPage : 'addHome',
    editing: false,
    isLoggedIn : req.session.isLoggedIn, 
    user:req.session.user
  });
}

exports.postAddHome = (req, res, next) => {
  const {homeName, price, location, rating, description} = req.body;

  console.log(homeName, price, location, rating, description);
  console.log(req.file);

  if(!req.files || !req.files.image || !req.files.rulesFile){
    console.log("No image provided");
    return res.status(422).send("No image provided and pdf are not provided");
  }

  const image = req.files.image[0].path;
  const rulesFileTempPath = req.files.rulesFile[0].path;

  const home = new Home({homeName, price, location, rating, image, description});

  console.log("Image path:", image);

  if (rulesFileTempPath) {
    const newFileName = `${home._id}.pdf`;
    const newFilePath = path.join('rules-files', newFileName);

    fs.renameSync(rulesFileTempPath, newFilePath); 

    home.rulesFile = newFilePath;
  }

  home.save().then(() => {
    console.log("home saved successfully");
    res.redirect('/host/host-home-list');
  })
  .catch((error) => {
    console.log("Failed to save home ", error);
  })
}

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registerHomes) => 
    res.render('host/host-home-list', {
      registerHomes : registerHomes,
      pageTitle : 'Host Homes list',
      currentPage : 'host-homes',
      isLoggedIn : req.session.isLoggedIn,
      user:req.session.user
    })
  );
}

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then((home) => {
    if(!home) {
      console.log("Home not found for editing.");
      return res.redirect('/host/host-home-list');
    }

    console.log(homeId, editing, home);
    res.render('host/edit-Home', {
      home:home,
      pageTitle: 'Register Homes', 
      currentPage : 'host-homes',
      editing : editing,
      isLoggedIn : req.session.isLoggedIn,
      user:req.session.user
    });
  })  
}

exports.postEditHome = (req, res, next) => {
  const {id, homeName, price, location, rating, description} = req.body;

  Home.findById(id).then((home) => {
    home.homeName = homeName;
    if(req.files){
      if(req.files.image && req.files.image[0]){
        fs.unlink(home.image, (err) => {
          if(err){
            console.log("Error while deleting image", err);
          }
        })
        home.image = req.files.image.path;
      }
      if(req.files.rulesFile && req.files.rulesFile[0]){
        fs.unlink(home.rulesFile, (err) => {
          if(err) {
            console.log("Error while deleting rulesFile", err);
          }
        })
        home.rulesFile = req.files.rulesFile.path;
        const rulesFileTempPath = req.files.rulesFile[0].path;

        if (rulesFileTempPath) {
          const newFileName = `${home._id}.pdf`;
          const newFilePath = path.join('rules-files', newFileName);

          fs.renameSync(rulesFileTempPath, newFilePath); 

          home.rulesFile = newFilePath;
        }
      }
    }
    home.rating = rating;
    home.description = description;
    home.price = price;
    home.location = location;
    
    home.save().then((result) => {
      console.log("Result : ", result);
    })
    .catch(error => {
      console.log(err, " Error occured while saving home")
    })
    res.redirect('/host/host-home-list');
  }).catch(error => {
    console.log("Error while finding home", error);
  })
}

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete homeId:", homeId);

  Home.findByIdAndDelete(homeId)
    .then(() => {
      console.log("Successfully deleted");
      res.redirect('/host/host-home-list');
    })
    .catch(err => {
      console.log("Error while deleting:", err);
      res.redirect('/host/host-home-list');
    });
};
