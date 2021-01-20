const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models');

// CURRENT ROUTE - /users

///////////////////////////////////////////////////////
// SHOWS THE SIGNUP FORM
router.get('/signup', (req, res) => {
  res.render('users/signup');
});


///////////////////////////////////////////////////////
// HANDLES SUBMIT OF SIGNUP FORM
router.post('/', (req, res) => {
  console.log(req.body);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return console.log(err);

    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      }
    
      db.User.create(newUser, (err, createdUser) => {
        if (err) return console.log(err);
    
        res.redirect('/users/login');
      })
    })
  })
});


///////////////////////////////////////////////////////
// SHOWS THE LOGIN FORM
router.get('/login', (req, res) => {
  res.render('users/login');
});


///////////////////////////////////////////////////////
// HANDLES SUBMIT OF LOGIN FORM
router.post('/login', (req, res) => {
  db.User.findOne({ username: req.body.username }, (err, foundUser) => {
    console.log(req.body);
    console.log(foundUser);

    if (!foundUser) {
      return res.redirect('/users/login');
    }

    bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
      if (err) return console.log(err);

      if (result) {
        // console.log('Password matched!');
        req.session.currentUser = foundUser;
        res.redirect('/users/account-page');
      } else {
        res.redirect('/users/login');
      }
    })

    // if (req.body.password === foundUser.password) {
    //   // console.log(req.session);

    //   req.session.currentUser = foundUser;

    //   // console.log(req.session);

    //   res.redirect('/users/account-page');
    // } else {
    //   res.redirect('/users/login');
    // }
  })
});


///////////////////////////////////////////////////////
// HANDLES LOGGING OUT
router.get('/logout', (req, res) => {
  console.log('hit /logout route');

  req.session.destroy((err) => {
    if (err) return console.log(err);
    
    res.redirect('/');
  })
});


///////////////////////////////////////////////////////
// SHOWS USER'S ACCOUNT PAGE
router.get('/account-page', (req, res) => {

  if (!req.session.currentUser) {
    return res.redirect('/users/login');
  }

  db.User.findById(req.session.currentUser._id, (err, foundUser) => {
    if (err) return console.log(err);

    // console.log(req.session);

    const context = {
      currentUser: foundUser,
      loggedInUser: req.session.currentUser
    }
  
    res.render('users/accountPage', context);
  });
});

module.exports = router;
