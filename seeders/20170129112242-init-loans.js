'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Loans', [
      {
        book_id: 3,
        patron_id: 2,
        loaned_on: '2015-11-10',
        return_by: '2016-01-10',
        returned_on: '2015-12-19'
      },
      {
        book_id: 5,
        patron_id: 1,
        loaned_on: '2017-01-01',
        return_by: '2017-03-01'
      },
      {
        book_id: 11,
        patron_id: 4,
        loaned_on: '2016-08-21',
        return_by: '2016-11-21'
      },
      {
        book_id: 14,
        patron_id: 3,
        loaned_on: '2016-12-14',
        return_by: '2017-01-14'
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Loans', null, {});
  }
};
