const Home  = require('../models/home');
const Favourite = require('../models/favourite');

// Get all homes
exports.getHomes = (req, res, next) => {
  Home.fetchAll().then((registerHomes) => 
    res.render('store/home-list', {
      registerHomes : registerHomes,
      pageTitle : 'Homes list',
      currentPage : 'home'
    })
  )}

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then((registerHomes) => 
    res.render('store/index', {
      registerHomes : registerHomes,
      pageTitle : 'Index Page',
      currentPage : 'home'
    })
  );
}
 

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', {
    pageTitle : 'Bookings page',
    currentPage : 'bookings'
  })
}

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites()
    .then(favourites => {
      const favouriteIds = favourites.map(fav => fav.houseId.toString());

      return Home.fetchAll().then(registerHomes => {
        const favouriteHomes = registerHomes.filter(home =>
          favouriteIds.includes(home._id.toString())
        );

        res.render("store/favourite-list", {
          registerHomes: favouriteHomes,
          pageTitle: "My favourites",
          currentPage: "Favourites"
        });
      });
    })
    .catch(err => {
      console.error("Error fetching favourite homes:", err);
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
      });
    }).catch((err) => {
      console.log(err);
    })
};

exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;
  const fav = new Favourite(homeId);

  fav.save().then((result) => {
    console.log("Fav added : ", result);
  })
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    res.redirect("/store/favourite-list");
  })
}
exports.postRemoveToFavourites = (req, res, next) => {
  const homeId = req.params.homeId;  // ✅ matches router param
  console.log("Came to delete favourite homeId:", homeId);

  Favourite.deleteById(homeId)
    .then(() => console.log("Favourite removed:", homeId))
    .catch(err => console.error("Error deleting favourite:", err))
    .finally(() => res.redirect('/store/favourite-list'));
};
