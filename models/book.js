'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_published: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    available: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
        Book.hasMany(models.Loan, {constraints: true, onDelete: 'cascade'});
        Book.belongsTo(models.Author);
        Book.belongsTo(models.Genre);
      }
    },
    getterMethods: {
      loaned: function() {
        return this.quantity - this.available;
      }
    },
    hooks: {
      beforeBulkCreate: books => {
        books.forEach(book =>{
          book.available = book.quantity;
        });
      }
    }
  });
  return Book;
};