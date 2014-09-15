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

    fullName: {
      type: 'string',
      required: true
    },

    // Many to One
    devices: {
      collection: 'Device',
      via: 'owner'
    },

    // One to One
    setting: {
      model: 'Setting',
      required: true
    },

    // Many to Many
    supervisingCourses: {
    	collection: 'Course',
    	via: 'managers',
    	dominant: true
    },

    // Many to Many
    attendingCourses: {
    	collection: 'Course',
    	via: 'students',
    	dominant: true
    },

    // Many to Many
    employedSchools: {
      collection: 'School',
      via: 'professors',
      dominant: true
    },

    // Many to Many
    enrolledSchools: {
      collection: 'School',
      via: 'students',
      dominant: true
    },

    // Many to One
    identifications: {
      collection: 'Identification',
      via: 'owner'
    },

    // Many to One
    questions: {
      collection: 'Question',
      via: 'owner'
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.password;
      delete obj.device;
      delete obj.setting;
      delete obj.supervisingCourses;
      delete obj.attendingCourses;
      delete obj.employedSchools;
      delete obj.enrolledSchools;
      delete obj.identifications;
      delete obj.questions;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.password = this.password;
      obj.device = this.device;
      obj.setting = this.setting;
      obj.supervisingCourses = this.supervisingCourses;
      obj.attendingCourses = this.attendingCourses;
      obj.employedSchools = this.employedSchools;
      obj.enrolledSchools = this.enrolledSchools;
      obj.identifications = new Array();
      for (var i = 0; i < this.identifications.length; i++)
        obj.identifications.push(this.identifications[i].toSimpleJSON());
      obj.questionsCount = this.questions.length;
      return obj;
    }
    
  },

  beforeCreate: function(values, next) {
    values.password = PasswordHash.generate(values.password);
    values.email = values.email.toLowerCase();
    Settings
    .create({})
    .exec(function callback(err, setting) {
      if (err || !setting)
        next(err);
      else {
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
  }

};
