var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var login = require('./routes/login');
var templates = require('./routes/templates');
var api = require('./routes/api');
var compiler = require('./routes/compiler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /src
//app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// serve bower_components
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/login', login);
app.use('/templates', templates);
app.use('/api', api);
app.use('/compile', compiler);

/** GET * and forward to login page or angular application (check by cookie) */
app.get('*', function (req, res) {
  if (req.cookies.libraryManager) {
    res.render('index');
  }
  else {
    res.redirect('/login');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error.status = err.status || 500;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
