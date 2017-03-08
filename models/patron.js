'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true
    },
    library_id: {
      type: DataTypes.STRING,
      unique: true
    },
    zip_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true,
    classMethods: {
      associate: function(models) {
        Patron.hasMany(models.Loan, {constraints: true, onDelete: 'cascade', hooks: true});
      }
    },
    getterMethods: {
      full_name: function() {
        return this.first_name + ' ' + this.last_name;
      }
    },
    hooks: {
      afterCreate: function(patron) {
        var library_id = 'MCL' + (1000 + patron.id);
        return patron.update({
          library_id: library_id 
        });
      }
    }
  });
  return Patron;
};