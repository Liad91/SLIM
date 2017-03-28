const express = require('express');
const router = express.Router();
const gulp = require('../gulpfile');
const path = require('path');
const fs = require('fs');

router.post('/css', (req, res, next) => {
  const configFile = path.join(__dirname, '../src/scss/settings/_user.scss');
  const data = req.body.join(' ');

  gulp.task('compile', ['dist-css'], () => {
    res.end();
    fs.writeFile(configFile, '');
  });
  fs.writeFile(configFile, data, () => {
    gulp.start('compile');
  });
});

module.exports = router;