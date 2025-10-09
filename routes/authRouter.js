const path = require('path');
const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

// serve static files
authRouter.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);
authRouter.post('/logout', authController.postLogout);

module.exports = authRouter;