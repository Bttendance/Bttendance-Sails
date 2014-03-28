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

    // has many Supervising Courses
    supervising_courses: {
      type: 'json'
    },

    // has many Attending Courses
    attending_courses: {
      type: 'json'
    },

    // has many Employed Schools (id, latest_serial)
    employed_schools: {
      type: 'json'
    },

    // has many Enrolled Schools (id, student_id or phone_number)
    enrolled_schools: {
      type: 'json'
    }
  },

  beforeCreate: function(values, next) {
    values.username = values.username.toLowerCase();
    values.password = passwordHash.generate(values.password);
    values.supervising_courses = new Array();
    values.attending_courses = new Array();
    values.employed_schools = new Array();
    values.enrolled_schools = new Array();
    next();
  }

};
