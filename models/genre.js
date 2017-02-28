'use strict';
module.exports = function(sequelize, DataTypes) {
  var Genre = sequelize.define('Genre', {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: false
  });
  return Genre;
};