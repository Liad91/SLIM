'use strict';

module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patron_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    return_by: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    returned_on: DataTypes.DATEONLY
  }, {
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
        Loan.belongsTo(models.Patron, {onDelete: 'cascade'});
        Loan.belongsTo(models.Book, {onDelete: 'cascade'});
      }
    },
    instanceMethods: {
      borrowBook: borrowBook,
      returnBook: returnBook
    },
    hooks: {
      afterCreate: borrowBook,
      afterBulkCreate: loans => {
        loans.forEach(loan => borrowBook(loan));
      },
      afterDestroy: function(loan) {
        if (!loan.returned_on) {
          returnBook(loan);
        }
      } 
    }
  });
  return Loan;

  function borrowBook(loan) {
    sequelize.models.Book.findById(loan.book_id)
      .then(function(book) {
        return book.decrement('available', {by: 1});
      })
      .catch(function(err) {
        throw new Error(err);
      });
  }

  function returnBook(loan) {    
    sequelize.models.Book.findById(loan.book_id)
      .then(function(book) {
        return book.increment('available', {by: 1});
      })
      .catch(function(error) {
        throw new Error(err);
      });
  }
};