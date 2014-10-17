/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var PasswordHash = require('password-hash');

module.exports = {

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

    full_name: {
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
    supervising_courses: {
    	collection: 'Course',
    	via: 'managers',
    	dominant: true
    },

    // Many to Many
    attending_courses: {
    	collection: 'Course',
    	via: 'students',
    	dominant: true
    },

    // Many to Many
    employed_schools: {
      collection: 'School',
      via: 'professors',
      dominant: true
    },

    // Many to Many
    enrolled_schools: {
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
      delete obj.devices;
      delete obj.setting;
      delete obj.supervising_courses;
      delete obj.attending_courses;
      delete obj.employed_schools;
      delete obj.enrolled_schools;
      delete obj.identifications;
      delete obj.questions;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);

      obj.devices = new Array();
      for (var i = 0; i < this.devices.length; i++)
        obj.devices.push(this.devices[i].toSimpleJSON());
      
      if (this.setting)
        obj.setting = this.setting.toSimpleJSON();

      obj.supervising_courses = new Array();
      for (var i = 0; i < this.supervising_courses.length; i++)
        obj.supervising_courses.push(this.supervising_courses[i].toSimpleJSON());

      obj.attending_courses = new Array();
      for (var i = 0; i < this.attending_courses.length; i++)
        obj.attending_courses.push(this.attending_courses[i].toSimpleJSON());

      obj.employed_schools = new Array();
      for (var i = 0; i < this.employed_schools.length; i++)
        obj.employed_schools.push(this.employed_schools[i].toSimpleJSON());

      obj.enrolled_schools = new Array();
      for (var i = 0; i < this.enrolled_schools.length; i++)
        obj.enrolled_schools.push(this.enrolled_schools[i].toSimpleJSON());

      obj.identifications = new Array();
      for (var i = 0; i < this.identifications.length; i++)
        obj.identifications.push(this.identifications[i].toSimpleJSON());

      if (this.questions)
        obj.questionsCount = this.questions.length;

      return obj;
    }
    
  },

  beforeCreate: function(values, next) {
    values.password = PasswordHash.generate(values.password);
    values.email = values.email.toLowerCase();
    Setting
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
    Setting
    .update({id: values.setting}, {owner: values.id})
    .exec(function callback(err, setting) {
      if (err || !setting)
        next(err);
      else
        next();
    });
  }

};
