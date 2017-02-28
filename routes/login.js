var express = require('express');
var router = express.Router();
var User = require('../models').User;

/** GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/** POST login form */
router.post('/', function(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  }).then(function(user) {
    if (user !== null) {
      /** Set cookie */
      res.cookie('libraryManager', 'adminIsLoggedIn');
      /** Reload the page */
      res.redirect('/books');
    }
    else {
      /** Render login page with error */
      res.locals.error = 'Username and Password are Incorrect';
      res.render('login');
    }
  }).catch(function(error) {
    var err = new Error('API error');
    err.status = 500;
    err.message = 'API Error Occurs, Please Try Again Later.';
    next(err);
  });
})

module.exports = router;
