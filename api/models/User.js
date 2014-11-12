/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
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

    name: {
      type: 'string',
      required: true
    },

    locale: {
      type: 'string',
      required: true,
      defaultsTo: 'en'
    },

    // One to Many
    devices: {
      collection: 'Device',
      via: 'owner',
    },

    // One Way
    setting: {
      model: 'Setting',
      required: true
    },

    // One to Many
    supervisingCourses: {
      collection: 'SupervisingCourse',
      via: 'user'
    },

    // One to Many
    attendingCourses: {
      collection: 'AttendingCourse',
      via: 'user'
    },

    // One to Many
    employedSchools: {
      collection: 'EmployedSchool',
      via: 'user'
    },

    // One to Many
    enrolledSchools: {
      collection: 'EnrolledSchool',
      via: 'user'
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
      return obj;
    }
    
  },

  beforeValidate: function(values, next) {
    if (values.email)
      values.email = values.email.toLowerCase();
    next();
  },

  beforeCreate: function(values, next) {
    values.password = PasswordHash.generate(values.password);
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