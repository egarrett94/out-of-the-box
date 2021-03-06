'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email anddress format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 32],
          msg: 'Password must be between 6 and 32 characters long'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(pendingUser, options){
        if(pendingUser && pendingUser.password) {
          let hash = bcrypt.hashSync(pendingUser.password, 10); 
          pendingUser.password = hash; 
        }
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.comment);
        models.user.belongsToMany(models.post, {through: 'UserPost'});
      }
    }
  });

  user.prototype.isValidPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  }

  user.prototype.toJSON = function() {
    let user = this.get();
    delete user.password;
    return user;
  }


  return user;
};