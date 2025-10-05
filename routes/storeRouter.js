const path = require('path');
const express = require('express');
const storeRouter = express.Router();
const storeController = require('../controllers/storeController');

// serve static files
storeRouter.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
storeRouter.get("/", storeController.getIndex);
storeRouter.get("/store/bookings", storeController.getBookings);
storeRouter.get("/store/favourite-list", storeController.getFavouriteList);
storeRouter.get("/store/home-list", storeController.getHomes);
storeRouter.get("/store/homes/:homeId", storeController.getHomeDetail);
storeRouter.post("/store/favourite-list", storeController.postAddToFavourite);

storeRouter.post("/store/favourite-list/delete/:homeId", storeController.postRemoveToFavourites);

module.exports = storeRouter;   