var express = require('express');
var router = express.Router();
var gulp = require('../gulpfile');
var path = require('path');
var fs = require('fs');

router.post('/css', function(req, res, next) {
  var configFile = path.join(__dirname, '../src/scss/_configs.scss');
  var data = req.body.colors.join(' ');

  gulp.task('compile', ['dist-css'], function () {
    res.end();
    fs.writeFile(configFile, '');
  });
  fs.writeFile(configFile, data, function() {
    gulp.start('compile');
  });
});

module.exports = router;