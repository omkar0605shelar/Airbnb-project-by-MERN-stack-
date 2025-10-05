//core module
const path = require('path');

//External module
const express = require('express');
const hostRouter = express.Router();

//local module
const rootDir = require('../utils/pathUtil');
const hostController = require('../controllers/hostController');

hostRouter.use(express.static(path.join(__dirname, '../', 'public')));

hostRouter.get('/add-home', hostController.getAddHome);

hostRouter.post('/add-home', hostController.postAddHome);

hostRouter.get('/host-home-list', hostController.getHostHomes);

hostRouter.get('/edit-home/:homeId', hostController.getEditHome);

hostRouter.post('/edit-home', hostController.postEditHome);

hostRouter.post('/delete-home/:homeId', hostController.postDeleteHome);

module.exports = hostRouter;