const { check, validationResult } = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login page',
    isLoggedIn : false,
    errors:[],
    oldInput:{
      email:''
    },
    user:{}
  });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  })
}

exports.getSignup = (req, res, next) =>{
  res.render("auth/signup", {
    pageTitle:"Signup",
    isLoggedIn:false,
    errors:[],
    oldInput:{
      firstname:"",
      lastname:"",
      email:"",
      userType:""
    },
    user:{}
  });
}

exports.postSignup = [
  check('firstname')
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({min : 2})
    .withMessage("First name must be greater than 2 characters long")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("First name should contains only alphabets"),
 
  check('lastname')
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("First name should contains only alphabets"),

  check('email')
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

  check('password')
    .isLength({min : 8})
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one digit")
    .matches(/[!@#$%^&*(),.{}|<>]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),

  check('confirmPassword')
    .trim()
    .custom((value, {req}) => {
      if(value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['guest', 'host']).withMessage('Invalid user type'),

  check('terms')
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, {req})=>{
      if(value!=='on'){
        throw new Error("Please accept therms and conditions")
      }

      return true;
    }),

  //final handler middleware
  (req, res, next) => {
    const {firstname, lastname, email, password, userType} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup', {
        isLoggedIn:false,
        pageTitle:"Sign up",
        errors: errors.array().map(error => error.msg),
        oldInput:{
          firstname, lastname, email, password, userType
        },
        user:{}
      })
    }

    bcrypt.hash(password, 12).then(hashedPassword => {
      const user = new User({firstname, lastname, email, password:hashedPassword, userType});

      return user.save();
    }).then(() => {
      res.redirect('/login');
    }).catch((error)=>{
        return res.status(422).render('auth/signup', {
          isLoggedIn:false,
          pageTitle:"Sign up",
          errors: [error.message],
          oldInput:{
            firstname, lastname, email, userType
          },
          user:{}
      });
    })
    
  }
];


exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if(!user){
    return res.render('auth/login', {
      pageTitle:"Login page", 
      isLoggedIn:false,
      errors:["User does not exist"],
      oldInput:{
        email:email
      },
      user:{}
    })
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(422).render('auth/login', {
      isLoggedIn:false,
      pageTitle:"Login page", 
      errors:["Invalid password"],
      oldInput:{
        email
      },
      user:{}
    })
  }
  req.session.isLoggedIn = true;
  req.session.user = user;

  await req.session.save();
  res.redirect('/');  
}