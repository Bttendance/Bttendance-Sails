/**
 * Users
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
      required: true
    },

    // to handle unique validation for username
    username_lower: {
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
      minLength: 6
    },

    full_name: {
      type: 'string',
      required: true
    },

    profile_image: {
      type: 'url'
    },

    // One to One
    deivce: {
    	model: 'Devices'
    },

    // Many to Many
    supervising_courses: {
    	collection: 'Courses',
    	via: 'managers',
    	dominant: true
    },

    // Many to Many
    attending_courses: {
    	collection: 'Courses',
    	via: 'students',
    	dominant: true
    },

    // Many to Many
    employed_schools: {
      collection: 'Schools',
      via: 'professors',
      dominant: true
    },

    // Many to Many
    enrolled_schools: {
      collection: 'Schools',
      via: 'students',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.username_lower;
      delete obj.password;
      delete obj.profile_image;
      delete obj.device;
      delete obj.supervising_courses;
      delete obj.attending_courses;
      delete obj.employed_schools;
      delete obj.enrolled_schools;
      return obj;
    },

    toWholeJSON: function() {
      var obj = this.toObject();
      return obj;
    }
    
  },

  beforeValidate: function(values, next) {
    values.username_lower = values.username.toLowerCase();
    values.email = values.email.toLowerCase();
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    values.password = passwordHash.generate(values.password);
    next();
  },

  afterCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    next();
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(next) {
    next();
  }

};
