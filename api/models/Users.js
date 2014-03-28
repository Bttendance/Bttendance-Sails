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
    device: {
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

    serials: {
      collection: 'Serials',
      via: 'owners',
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

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.username_lower;
      delete obj.password;
      delete obj.supervising_courses;
      delete obj.attending_courses;
      delete obj.employed_schools;
      delete obj.serials;
      delete obj.enrolled_schools;
      delete obj.identifications;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.username_lower = this.username_lower;
      obj.password = this.password;
      obj.supervising_courses = this.supervising_courses;
      obj.attending_courses = this.attending_courses;
      obj.employed_schools = this.employed_schools;
      obj.serials = this.serials;
      obj.enrolled_schools = this.enrolled_schools;
      obj.identifications = this.identifications;
      return obj;
    },

    toOldObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.username_lower = this.username_lower;
      obj.password = this.password;
      obj.supervising_courses = this.supervising_courses;
      obj.attending_courses = this.attending_courses;
      obj.employed_schools = this.employed_schools;
      obj.serials = this.serials;
      obj.enrolled_schools = this.enrolled_schools;
      obj.identifications = this.identifications;

      //device
      obj.device_uuid = obj.device.uuid;
      obj.device_type = obj.device.type;
      obj.notification_key = obj.device.notification_key;
      delete obj.device;

      //supervising_courses
      var supervising_courses = new Array();
      for (var i = 0; i < obj.supervising_courses.length; i++)
        supervising_courses.push(obj.supervising_courses[i].id);
      obj.supervising_courses = supervising_courses;

      //attending_courses
      var attending_courses = new Array();
      for (var i = 0; i < obj.attending_courses.length; i++)
        attending_courses.push(obj.attending_courses[i].id);
      obj.attending_courses = attending_courses;

      //employed_schools
      var employed_schools = new Array();
      for (var i = 0; i < obj.employed_schools.length; i++) {
        var object = {};
        object.id = obj.employed_schools[i].id;
        for (var j = 0; j < obj.serials.length; j++) {
          if (obj.serials[j].school == object.id) {
            object.key = obj.serials[j].key;
            break;
          }
        }
        employed_schools.push(object);
      }
      obj.employed_schools = employed_schools;
      delete obj.serials;

      //enrolled_schools
      var enrolled_schools = new Array();
      for (var i = 0; i < obj.enrolled_schools.length; i++) {
        var object = {};
        object.id = obj.enrolled_schools[i].id;
        for (var j = 0; j < obj.identifications.length; j++) {
          if (obj.identifications[j].school == object.id) {
            object.key = obj.identifications[j].identity;
            break;
          }
        }
        enrolled_schools.push(object);
      }
      obj.enrolled_schools = enrolled_schools;
      delete obj.identifications;

      //others
      delete obj.username_lower;

      return obj;
    }
    
  },

  beforeValidate: function(values, next) {
    if (values.username)
      values.username_lower = values.username.toLowerCase();
    if (values.email)
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
