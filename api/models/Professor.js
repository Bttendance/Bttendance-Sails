/**
 * Professor
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

    userId: {
      type: 'integer',
      unique: true
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

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {

    User.create({
      username: values.username,
      email:    values.email,
      password: values.password
    }, function (err, user) {

      // An database error occurred
      if (err) { return next(err); }

      // Use wasn't created for some weird reason
      if (!user) { return next({ error: "User creation Error"}); }

      // Instantly add or modify attributes
      values.username = undefined;
      values.email = undefined;
      values.password = undefined;
      values.userId = user.id_;
      values.fullName = values.firstName + " " + values.lastName;
      values.courses = new Array();
      values.memberships = new Array();
      next();
    });
  }
};
