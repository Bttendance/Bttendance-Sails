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
    	type: 'string'
    },

    //iPhone, Android, Window, Blackberry, etc
    device_type: {
      type: 'string',
      required: true
    },

    // UUID
    device_uuid: {
      type: 'uuid',
      required: true,
      unique: true
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
    values.password = passwordHash.generate(values.password);
    values.type = null;
    values.courses = new Array();
    values.memberships = new Array();
    values.schools = new Array();
    next();
  }

};
