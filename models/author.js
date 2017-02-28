'use strict';
module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define('Author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: false
  });
  return Author;
};