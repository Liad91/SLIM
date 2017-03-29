'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Genres', [
      {genre: 'Fantasy'},
      {genre: 'Non Fiction'},
      {genre: 'Horror'},
      {genre: 'Science Fiction'},
      {genre: 'Classic'}
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Genres', null, {});
  }
};
