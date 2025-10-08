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
const {default: mongoose} = require('mongoose');

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

const db_path = "mongodb+srv://shelaromkar313_db_user:Shelar321@clustertest.0zmobsm.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ClusterTest"
mongoose.connect(db_path)
.then(() => {
  console.log("Mongodb connected");
  app.listen(3000, ()=>{
    console.log("Server started");
  })
})
.catch(error => {
  console.log("Error occured while app listen")
})