/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var passwordHash = require('password-hash');

module.exports = {

  attributes: {

    _id: {
      type: 'string'
    },

    username: {
      type: 'string',
      required: true,
      unique: true,
      maxLength: 20,
      minLength: 5
    },

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true,
      minLength: '6',
      columnName: 'encrypted_password'
    },

    // Prof, TA, Std, Admin
    userType: {
      type: 'string'
    },

    bttendanceToken: {
      type: 'string'
    },

    facebookToken: {
      type: 'string'
    },

    facebookTokenExpire: {
      type: 'date'
    },

    googleplusToken: {
      type: 'string'
    },

    toJSON: function() {
      var obj = this.toObject();
      // delete obj.password;
      // delete obj.bttendanceToken;
      // delete obj.email;
      return obj;
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.password = User.hashPass(values.password);
    User.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
      if (err) return next(err);

      var seqNo;
      if (collections.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(collections[0].id)+ 1;
      values._id = seqNo.toString();

      next();
    });
  }

};

module.exports.hashPass = function(pass)
{
  return passwordHash.generate(pass);
}

module.exports.checkPass = function(pass, stored)
{
  return passwordHash.verify(pass, stored);
}
