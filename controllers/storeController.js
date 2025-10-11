const Home  = require('../models/home');
const User = require('../models/user');

// Get all homes
exports.getHomes = (req, res, next) => {
  Home.find().then((registerHomes) => 
    res.render('store/home-list', {
      registerHomes : registerHomes,
      pageTitle : 'Homes list',
      currentPage : 'home',
      isLoggedIn : req.session.isLoggedIn,
      user:req.session.user
    })
  )}

exports.getIndex = (req, res, next) => {
  Home.find().then((registerHomes) => 
    res.render('store/index', {
      registerHomes : registerHomes,
      pageTitle : 'Index Page',
      currentPage : 'home',
      isLoggedIn : req.session.isLoggedIn,
      user:req.session.user
    })
  );
}
 

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', {
    pageTitle : 'Bookings page',
    currentPage : 'bookings',
    isLoggedIn : req.session.isLoggedIn,
    user:req.session.user
  })
}

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  console.log('User : ', user);

  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "Favourites",
    isLoggedIn : req.session.isLoggedIn,
    user: req.session.user
  });
};

exports.getHomeDetail = (req, res, next) => {
  const homeId = req.params.homeId;
  
  Home.findById(homeId).then((home) => {
      if (!home) {
        console.log("home not found");
        return res.redirect("/store/homes");
      }

      console.log("Home details found", home);
      res.render("store/home-detail", {  
        home: home,
        pageTitle: home.name,
        currentPage: "home",
        isLoggedIn : req.session.isLoggedIn,
        user:req.session.user
      });
    }).catch((err) => {
      console.log(err);
    })
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
  }

  res.redirect('/store/favourite-list');
};

exports.postRemoveToFavourites = async (req, res, next) => {
  const homeId = req.params.homeId; 
  console.log("Came to delete favourite homeId:", homeId);

  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if(user.favourites.includes(homeId)){
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }

  res.redirect('/store/favourite-list');
};
