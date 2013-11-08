/**
 * Professor
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

    id_: {
      type: 'string',
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
    // Instantly add or modify attributes
    values.fullName = values.firstName + " " + values.lastName;
    values.courses = new Array();
    values.memberships = new Array();

    // Dealing with 'id_'
    Professor.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
      if (err) return next(err);

      var seqNo;
      if (collections.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(collections[0].id_)+ 1;
      values.id_ = seqNo.toString();

      next();
    });
  }
};
