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

    fullName: {
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
    setting: {
      model: 'Settings',
      required: true
    },

    // One-to-many
    supervisingCourses: {
      collection: 'SupervisingCourse',
      via: 'user'
    },

    // One-to-many
    attendingCourses: {
      collection: 'AttendingCourse',
      via: 'user'
    },

    // One-to-many
    employedSchools: {
      collection: 'EmployedSchool',
      via: 'user'
    },

    // One-to-many
    enrolledSchools: {
      collection: 'EnrolledSchool',
      via: 'user'
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.password;
      delete obj.locale;
      delete obj.device;
      delete obj.setting;
      delete obj.supervisingCourses;
      delete obj.attendingCourses;
      delete obj.employed_schools;
      delete obj.enrolled_schools;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.password = this.password;
      obj.locale = this.locale;
      obj.device = this.device;
      obj.setting = this.setting;
      obj.supervisingCourses = this.supervisingCourses;
      obj.attendingCourses = this.attendingCourses;
      obj.employed_schools = this.employed_schools;
      obj.enrolled_schools = this.enrolled_schools;

      return obj;
    }

  },

  beforeValidate: function (values, next) {
    if (values.email) {
      values.email = values.email.toLowerCase();
    }

    next();
  },

  beforeCreate: function (values, next) {
    values.password = PasswordHash.generate(values.password);
    Settings
      .create()
      .exec(function (err, setting) {
        if (err || !setting) {
          next(err);
        } else {
          values.setting = setting.id;
          next();
        }
      });
  },

  afterCreate: function (values, next) {
    Settings
      .update({ id: values.setting }, { owner: values.id })
      .exec(function (err, setting) {
        if (err || !setting) {
          next(err);
        } else {
          next();
        }
      });
  }
};
