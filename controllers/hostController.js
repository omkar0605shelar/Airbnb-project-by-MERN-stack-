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

  //registerHomes.push(req.body);
  home.save();
  
  // Home.fetchAll((registerHomes) => {
  //   res.render('host/home-added', {
  //     registerHomes : registerHomes,
  //     lastHome : registerHomes[registerHomes.length-1],
  //     pageTitle:'Register Home',
  //     currentPage : 'homeRegister'
  //   });
  // });

  res.redirect('/host/host-home-list');
}

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll().then(([registerHomes]) => 
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

  Home.findById(homeId, home => {
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
  home.id = id;
  home.save();
  
  res.redirect('/host/host-home-list', );
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delet homeId");

  Home.deleteById(homeId, err => {
    if(err){
      console.log("Errror white deleting", err);
    }

    res.redirect('/host/host-home-list');
  })
}