/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var passwordHash = require('password-hash');
var passport = require('passport');

module.exports = {

  attributes: {

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
      minLength: 6,
      columnName: 'encrypted_password'
    },

    //professor, student, assistant
    type: {
      type: 'string',
      required: true
    },

    //iphone, android, window, blackberry, etc
    device_type: {
      type: 'string',
      required: true
    },

    // uuid
    device_uuid: {
      type: 'string', // Android UUID doesn't satisify uuid validation
      required: true,
      unique: true
    },

    notification_key: {
      type: 'string'
    },

    full_name: {
      type: 'string',
      required: true
    },

    profile_image: {
      type: 'url'
    },

    // has many Courses
    courses: {
      type: 'array'
    },

    // has many Schools
    schools: {
      type: 'array'
    },

    toJSON: function() {
      var obj = this.toObject();
      // delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    values.username = values.username.toLowerCase();
    values.password = passwordHash.generate(values.password);
    values.courses = new Array();
    values.memberships = new Array();
    values.schools = new Array();
    next();
  }

};
