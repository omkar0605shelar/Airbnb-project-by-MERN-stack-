const Home  = require('../models/home');
const Favourite = require('../models/favourite');

// Get all homes
exports.getHomes = (req, res, next) => {
  Home.find().then((registerHomes) => 
    res.render('store/home-list', {
      registerHomes : registerHomes,
      pageTitle : 'Homes list',
      currentPage : 'home',
      isLoggedIn : req.session.isLoggedIn
    })
  )}

exports.getIndex = (req, res, next) => {
  Home.find().then((registerHomes) => 
    res.render('store/index', {
      registerHomes : registerHomes,
      pageTitle : 'Index Page',
      currentPage : 'home',
      isLoggedIn : req.session.isLoggedIn
    })
  );
}
 

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', {
    pageTitle : 'Bookings page',
    currentPage : 'bookings',
    isLoggedIn : req.session.isLoggedIn
  })
}

exports.getFavouriteList = (req, res, next) => {
  Favourite.find()
  .populate("homeId")
  .then((favouriteIds) => {
    const favouriteHomes = favouriteIds.map((fav) => fav.homeId)
    res.render("store/favourite-list", {
      favouriteHomes: favouriteHomes,
      pageTitle: "Favourites",
      isLoggedIn : req.session.isLoggedIn
    });
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
        isLoggedIn : req.session.isLoggedIn
      });
    }).catch((err) => {
      console.log(err);
    })
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;
  Favourite.findOne({ homeId: homeId })
    .then(existingFav => {
      if (existingFav) {
        console.log("Already marked as favourites");
      }
      else{
        existingFav = new Favourite({ homeId : homeId});
        existingFav.save().then((result) => {
          console.log("Fav added:", result);
        })
      }
      res.redirect("/store/favourite-list");
    })
    .catch((error) => {
      console.log("Error while adding to favourites", error);
    });
};

exports.postRemoveToFavourites = (req, res, next) => {
  const homeId = req.params.homeId; 
  console.log("Came to delete favourite homeId:", homeId);

  Favourite.findOneAndDelete({homeId})
    .then(() => console.log("Favourite removed:", homeId))
    .catch(err => console.error("Error deleting favourite:", err))
    .finally(() => res.redirect('/store/favourite-list'));
};
