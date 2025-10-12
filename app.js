const path = require('path');

const express = require('express');
const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);
 
const storeRouter = require('./routes/storeRouter'); 
const hostRouter = require('./routes/hostRouter'); 
const authRouter = require('./routes/authRouter'); 
const rootDir = require("./utils/pathUtil");
const errorController = require("./controllers/error");
const {default: mongoose} = require('mongoose');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  let result = '';
  for(let i=0;i<length;i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    if(file.fieldname === 'image'){
      cb(null, 'uploads/');
    }
    else if(file.fieldname === 'rulesFile'){
      cb(null, 'rules-files/');
    }
    else{
      cb(new Error("Error while destination of file"))
    }
  },
  filename:(req, file, cb)=> {
    cb(null, randomString(10) + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.fieldname === 'image' && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)){
    cb(null, true);
  }
  else if(file.fieldname === 'rulesFile' && ['application/pdf'].includes(file.mimetype)) {
    cb(null, true);
  }
  else{
    cb(null, false);
  }
};

const multerOptions = {
  storage, fileFilter
}

app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).fields([
  {
    name:'image', maxCount:1,
  },
  {
    name:'rulesFile', maxCount:1
  }
]));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads/')));
app.use('/host/uploads',express.static(path.join(__dirname, 'uploads/')));
app.use('/store/uploads',express.static(path.join(__dirname, 'uploads/')));
app.use('/store/homes/uploads',express.static(path.join(__dirname, 'uploads/')));



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