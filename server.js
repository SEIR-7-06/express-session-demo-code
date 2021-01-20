const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 4000;
const usersController = require('./controllers/usersController');


////////////////////////////////////////////////////////
// Configuration / Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'milo the barking dog',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // valid for 2 weeks
  }
}));

/////////////////////////////////////////////////////////
// Controller
app.use('/users', usersController);


/////////////////////////////////////////////////////////
// ROUTES
app.get('/items', (req, res) => {
  res.render('items/browseItems');
})


app.get('/', (req, res) => {
  // If user is logged in take them to account page
  if (req.session.currentUser) {
    res.redirect('/users/account-page');
  } else {
    res.render('home');
  }
  // If not logged take them to home page

});


/////////////////////////////////////////////////////////
// START THE SERVER
app.listen(PORT, () => {
  console.log(`Your app is listening on PORT: ${PORT}`);
});
