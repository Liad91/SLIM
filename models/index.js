'use strict';

var fs        = require('fs');
var path      = require('path');
var sqlite    = require('sqlite3');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';

var db = {};
var dbPath = path.join(__dirname, '..', 'config', 'database.sqlite');

var database = new sqlite.Database(dbPath);
var sequelize = new Sequelize('main', null, null, {
  dialect: 'sqlite',
  storage: dbPath
});

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
