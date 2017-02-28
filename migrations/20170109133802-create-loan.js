'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      patron_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      loaned_on: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      return_by: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      returned_on: {
        type: Sequelize.DATEONLY
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Loans');
  }
};