const Home  = require('../models/home');

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
  const {homeName, price, location, rating, imageUrl, description} = req.body;

  const home = new Home({homeName, price, location, rating, imageUrl, description});

  home.save().then(() => {
    console.log("home saved successfully");
  })

  res.redirect('/host/host-home-list');
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
  const {id, homeName, price, location, rating, imageUrl, description} = req.body;

  const home = new Home({homeName, price, location, rating, imageUrl, description, id});

  Home.findById(id).then((home) => {
    home.homeName = homeName;
    home.imageUrl = imageUrl;
    home.rating = rating;
    home.description = description;
    home.price = price;
    home.location = location;
    home.save().then((result) => {
      console.log("Result : ", result);
    })
    .catch(error => {
      console.log(err, " Error occured")
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
