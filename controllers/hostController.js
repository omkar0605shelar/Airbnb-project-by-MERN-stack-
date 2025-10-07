const Home  = require('../models/home');

// Add new home
exports.getAddHome = (req, res, next) => {
  res.render('host/edit-Home', {
    pageTitle: 'Register Homes', 
    currentPage : 'addHome',
    editing: false
  });
}

// Registered home show
exports.postAddHome = (req, res, next) => {
  // console.log('first house:' , req.body, req.body.homeName);
  const {homeName, price, location, rating, imageUrl, description} = req.body;

  const home = new Home(homeName, price, location, rating, imageUrl, description);

  home.save().then(() => {
    console.log("home saved successfully");
  })

  res.redirect('/host/host-home-list');
}

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll().then((registerHomes) => 
    res.render('host/host-home-list', {
      registerHomes : registerHomes,
      pageTitle : 'Host Homes list',
      currentPage : 'host-homes'
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
    });
  })  
}

exports.postEditHome = (req, res, next) => {
  const {id, homeName, price, location, rating, imageUrl, description} = req.body;

  const home = new Home(homeName, price, location, rating, imageUrl, description, id);

  //registerHomes.push(req.body);
  home._id = id;
  home.save().then((result) => {
    console.log("Result : ", result);
  })
  
  res.redirect('/host/host-home-list', );
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete homeId:", homeId);

  Home.deleteById(homeId)
    .then(() => {
      res.redirect('/host/host-home-list');
    })
    .catch(err => {
      console.log("Error while deleting:", err);
      res.redirect('/host/host-home-list');
    });
};
