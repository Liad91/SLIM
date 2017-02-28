'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Genres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Genres');
  }
};