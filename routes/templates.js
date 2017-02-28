var express = require('express');
var router = express.Router();

/** GET angular tamplates */
router.get('/pages/:name', function(req, res, next) {
  res.render('pages/' + req.params.name);
});

router.get('/partials/:name', function(req, res, next) {
  res.render('partials/' + req.params.name);
});

module.exports = router;