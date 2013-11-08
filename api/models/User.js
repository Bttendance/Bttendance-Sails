/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var passwordHash = require('password-hash');

module.exports = {

  attributes: {

    id_: {
      type: 'string',
      unique: true
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

    accessToken: {
      type: 'string'
    },

    facebookToken: {
      type: 'string'
    },

    facebookTokenExpire: {
      type: 'date'
    },

    twitterToken: {
    	type: 'string'
    },

    googleplusToken: {
      type: 'string'
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    // Instantly add or modify attributes
    values.password = passwordHash.generate(values.password);

    // Dealing with 'id_'
    User.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
      if (err) return next(err);

      var seqNo;
      if (collections.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(collections[0].id_)+ 1;
      values.id_ = seqNo.toString();

      next();
    });
  }

};
