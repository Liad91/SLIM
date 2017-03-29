const express = require('express');
const router = express.Router();
const User = require('../models').User;

/** GET login page. */
router.get('/', (req, res, next) => {
  res.render('login');
});

/** POST login form */
router.post('/', (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  })
    .then(user => {
      if (user !== null) {
        /** Set cookie */
        res.cookie('slimAdministrator', req.body.username);
        /** Reload the page */
        res.redirect('/books');
      }
      else {
        /** Render login page with error */
        res.locals.error = 'Username and Password are Incorrect';
        res.render('login');
      }
    })
    .catch(error => {
      var err = new Error('API error', error);
      err.status = 500;
      err.message = 'API Error Occurs, Please Try Again Later.';
      next(err);
    });
})

module.exports = router;
