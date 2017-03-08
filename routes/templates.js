const express = require('express');
const router = express.Router();

/** GET angular tamplates */
router.get('/pages/:name', (req, res, next) => {
  res.render('pages/' + req.params.name);
});

router.get('/partials/:name', (req, res, next) => {
  res.render('partials/' + req.params.name);
});

module.exports = router;