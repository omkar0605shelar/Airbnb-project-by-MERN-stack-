const path = require('path');

const express = require('express');
const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
 
const storeRouter = require('./routes/storeRouter'); 
const hostRouter = require('./routes/hostRouter'); 
const authRouter = require('./routes/authRouter'); 
const rootDir = require("./utils/pathUtil");
const errorController = require("./controllers/error");
const {default: mongoose} = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

const store = new MongoDBStore({
  uri: "mongodb+srv://shelaromkar313_db_user:Shelar321@clustertest.0zmobsm.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ClusterTest",
  collection:'sessions'
});

app.use(session({
  // secret key used to sign the session ID cookie and encrypt session data
  secret : 'Airbnb Project',

  resave: false,

  saveUninitialized : true,

  store:store
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
  console.log("Cookie check middleware", req.get('Cookie'));
  req.session.isLoggedIn = req.session.isLoggedIn; 
  next();
})

app.use("/", storeRouter);

app.use('/host', (req, res, next) => {
  if(req.session.isLoggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
});
app.use("/host", hostRouter);

app.use("/", authRouter);

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