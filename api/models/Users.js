/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var PasswordHash = require('password-hash');

module.exports = {

  attributes: {

    username: {
      type: 'string',
      required: false,
      unique: true
    },

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    full_name: {
      type: 'string',
      required: true
    },

    locale: {
      type: 'string',
      defaultsTo: 'en'
    },

    // One to One
    device: {
      model: 'Devices'
    },

    // One to One
    setting: {
      model: 'Settings'
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

    identifications: {
      collection: 'Identifications',
      via: 'owner'
    },

    questions: {
      collection: 'Questions',
      via: 'owner'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.password;
      delete obj.locale;
      delete obj.device;
      delete obj.setting;
      delete obj.supervising_courses;
      delete obj.attending_courses;
      delete obj.employed_schools;
      delete obj.enrolled_schools;
      delete obj.identifications;
      delete obj.questions;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.password = this.password;
      obj.locale = this.locale;
      obj.device = this.device;
      obj.setting = this.setting;
      obj.supervising_courses = this.supervising_courses;
      obj.attending_courses = this.attending_courses;
      obj.employed_schools = this.employed_schools;
      obj.enrolled_schools = this.enrolled_schools;
      obj.identifications = this.identifications;
      obj.questions_count = this.questions.length;
      return obj;
    }
    
  },

  beforeValidate: function(values, next) {
    if (values.email)
      values.email = values.email.toLowerCase();
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    values.password = PasswordHash.generate(values.password);
    Settings
    .create({})
    .exec(function callback(err, setting) {
      sails.log.error(err);
      sails.log.error(setting);
      if (err || !setting)
        next(err);
      else {
        sails.log.error(setting);
        values.setting = setting.id;
        next();
      }
    });
  },

  afterCreate: function(values, next) {
    Settings
    .update({id: values.setting}, {owner: values.id})
    .exec(function callback(err, setting) {
      if (err || !setting)
        next(err);
      else
        next();
    });
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

  afterDestroy: function(values, next) {
    next();
  }

};
