// core modules
const path = require('path');

// External module
const express = require('express');
const bodyParser = require('body-parser');
 
// local modules
const storeRouter = require('./routes/storeRouter'); // ✅ should not use
const hostRouter = require('./routes/hostRouter');   // ✅ same here
const rootDir = require("./utils/pathUtil");
const errorController = require("./controllers/error");
const {mongoConnect, getDb} = require("./utils/databaseUtil");

const app = express();

// ejs install
app.set('view engine', 'ejs');
app.set('views', 'views');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// css files import
app.use(express.static(path.join(__dirname, 'public')));

// home page
app.use("/", storeRouter);

// add home
app.use("/host", hostRouter);

// Error handling
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log(`Server started at http://localhost:3000`);
  });
})