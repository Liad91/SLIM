'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Authors', [
      {name: 'Andy Weir'},
      {name: 'Ernest Cline'},
      {name: 'J.K. Rowling'},
      {name: 'Jane Austen'},
      {name: 'Mary Shelley'},
      {name: 'Paula Hawkins'},
      {name: 'Stephen Hawking'}
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Authors', null, {});
  }
};
