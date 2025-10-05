const Home  = require('../models/home');
const Favourite = require('../models/favourite');

// Get all homes
exports.getHomes = (req, res, next) => {
  Home.fetchAll().then(([registerHomes]) => 
    res.render('store/home-list', {
      registerHomes : registerHomes,
      pageTitle : 'Homes list',
      currentPage : 'home'
    })
  )}

exports.getIndex = (req, res, next) => {
  Home.fetchAll().then(([registerHomes]) => 
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
  Favourite.getFavourites((favourites) => {
    Home.fetchAll().then(([registerHomes]) => {
      const favouriteHomes = registerHomes.filter(home => 
        favourites.includes(home.id));
        res.render("store/favourite-list", {
          favouriteHomes: favouriteHomes,
          pageTitle:"My favourites", 
          currentPage:"Favourites"
        })
      });
  })
}

exports.getHomeDetail = (req, res, next) => {
  const homeId = req.params.homeId;
  
  Home.findById(homeId).then(([rows]) => {
      const home = rows[0];
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
  console.log("Came to add to favourite ");
  Favourite.addToFavourite(req.body.id, error =>{
    if(error) {
      console.log("Error while marking favourite");
    }
    res.redirect('/store/favourite-list')
  }) 
}

exports.postRemoveToFavourites = (req, res, next) => {
  const homeId = req.params.id;

  console.log("Came to delete to favourite ");
  Favourite.deleteById(homeId, error =>{
    if(error) {
      console.log("Error while marking favourite");
    }
    res.redirect('/store/favourite-list')
  }) 
}