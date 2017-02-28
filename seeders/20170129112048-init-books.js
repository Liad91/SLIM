'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Books', [
      {
        title: 'The Martian',
        author_id: 1,
        genre_id: 4,
        first_published: 2014,
        quantity: 16,
        available: 16
      },
      {
        title: 'Ready Player One',
        author_id: 2,
        genre_id: 4,
        first_published: 2011,
        quantity: 6,
        available: 6
      },
      {
        title: 'Armada',
        author_id: 2,
        genre_id: 4,
        first_published: 2015,
        quantity: 3,
        available: 2
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author_id: 3,
        genre_id: 1,
        first_published: 1997,
        quantity: 15,
        available: 15
      },
      {
        title: 'Harry Potter and the Chamber of Secrets',
        author_id: 3,
        genre_id: 1,
        first_published: 1998,
        quantity: 20,
        available: 19
      },
      {
        title: 'Harry Potter and the Prisoner of Azkaban',
        author_id: 3,
        genre_id: 1,
        first_published: 1999,
        quantity: 18,
        available: 18
      },
      {
        title: 'Harry Potter and the Goblet of Fire',
        author_id: 3,
        genre_id: 1,
        first_published: 2000,
        quantity: 20,
        available: 20
      },
      {
        title: 'Harry Potter and the Order of the Phoenix',
        author_id: 3,
        genre_id: 1,
        first_published: 2003,
        quantity: 23,
        available: 23
      },
      {
        title: 'Harry Potter and the Half-Blood Prince',
        author_id: 3,
        genre_id: 1,
        first_published: 2005,
        quantity: 21,
        available: 21
      },
      {
        title: 'Harry Potter and the Deathly Hallows',
        author_id: 3,
        genre_id: 1,
        first_published: 2007,
        quantity: 25,
        available: 25
      },
      {
        title: 'Pride and Prejudice',
        author_id: 4,
        genre_id: 5,
        first_published: 1813,
        quantity: 1,
        available: 0
      },
      {
        title: 'Emma',
        author_id: 4,
        genre_id: 5,
        first_published: 1815,
        quantity: 3,
        available: 3
      },
      {
        title: 'Frankenstein',
        author_id: 5,
        genre_id: 3,
        first_published: 1818,
        quantity: 3,
        available: 3
      },
      {
        title: 'The Girl on the Train',
        author_id: 6,
        genre_id: 5,
        first_published: 2015,
        quantity: 15,
        available: 14
      },
      {
        title: 'A Brief History of Time',
        author_id: 7,
        genre_id: 2,
        first_published: 1988,
        quantity: 6,
        available: 6
      },
      {
        title: 'The Universe in a Nutshell',
        author_id: 7,
        genre_id: 2,
        first_published: 2001,
        quantity: 8,
        available: 8
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Books', null, {});
  }
};
