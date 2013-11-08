/**
 * Student
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var passwordHash = require('password-hash');

module.exports = {

  attributes: {

    id_: {
      type: 'string',
      unique: true
    },

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
      minLength: '6',
      columnName: 'encrypted_password'
    },

    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true
    },

    fullName: {
      type: 'string'
    },

    profileImage: {
      type: 'url'
    },

    // iPhone, Android, Window, Blackberry
    deviceType: {
    	type: 'string',
    	required: true
    },

    // UUID
    deviceUUID: {
    	type: 'uuid',
    	required: true,
    },

    // has many Courses
    courses: {
      type: 'array'
    },

    // has many memberships = 1 School + n Departments
    memberships: {
      type: 'array'
    },

    bttendanceToken: {
      type: 'string'
    },

    facebookToken: {
      type: 'string'
    },

    facebookTokenExpire: {
      type: 'date'
    },

    googleplusToken: {
      type: 'string'
    },

    toJSON: function() {
      var obj = this.toObject();
      // delete obj.password;
      return obj;
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, callback) {
    // Instantly add or modify attributes
    values.password = passwordHash.generate(values.password);
    values.fullName = values.firstName + " " + values.lastName;
    values.courses = new Array();
    values.memberships = new Array();

    // Dealing with 'id_'
    Student.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
      if (err) return callback(err);

      var seqNo;
      if (collections.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(collections[0].id_)+ 1;
      values.id_ = seqNo.toString();

      callback();
    });
  }
};
