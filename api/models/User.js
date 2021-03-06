'use strict';

/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var PasswordHash = require('password-hash');

module.exports = {

  // User is a reserved word in Postgres
  // "User" is a workaround but needs to be used for every column reference, too
  // e.g. "user".name, etc, not possible w/ abstractions like Waterline
  tableName: 'users',

  attributes: {

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    locale: {
      type: 'string',
      required: true,
      defaultsTo: 'en'
    },

    // One-to-many
    devices: {
      collection: 'Device',
      via: 'owner',
    },

    // One-to-one
    settings: {
      model: 'Settings',
      required: true
    },

    // One-to-many
    courses: {
      collection: 'UserCourse',
      via: 'user'
    },

    // One-to-many
    schools: {
      collection: 'UserSchool',
      via: 'user'
    },

    // One-to-many
    authentications: {
      collection: 'Authentication',
      via: 'user'
    },

    /**
     * Sign Up
     * @param  {Object}   options
     *            => email {String} email of user
     *            => password {String} un-hashed password of user
     *            => name {String}  of user
     *            => locale {String} i18n of user
     * @param  {Function} cb
     */
    signUp: function (options, cb) {
      User.create({
          email: options.email,
          password: options.password,
          name: options.name,
          locale: options.locale
        }).exec(function (err, user) {
          if (err) return cb(err);
          if (!user) return cb(new Error('No User Created.'));

          return cb(user);
        });
    },

    /**
     * Log In
     * @param  {Object}   options
     *            => email {String} email of user
     *            => password {String} hashed password of user
     * @param  {Function} cb
     */
    logIn: function (options, cb) {
      User.findOneByEmail(options.email)
        .exec(function (err, user) {
          if (err) return cb(err);
          if (!user) return cb(new Error('No User Found.'));

          return cb(user);
        });
    }

  },

  beforeValidate: function (values, next) {
    if (values.email)
      values.email = values.email.toLowerCase();
    next();
  },

  beforeCreate: function (values, next) {
    values.password = PasswordHash.generate(values.password);
    Settings
      .create()
      .exec(function (err, settings) {
        if (err) return next(err);
        if (!settings) return next(new Error('No Settings Created.'));
        values.setting = setting.id;
        return next();
      });
  }

};
