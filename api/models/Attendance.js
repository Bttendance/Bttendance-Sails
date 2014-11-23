/**
 * Attendance.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var Moment = require('moment');

module.exports = {

  attributes: {

    // One-to-one
    post: {
      model: 'Post',
      required: true,
      index: true
    },

    type: {
      type: 'string',
      required: true,
      enum: ['auto', 'alarm']
    },

    // One-to-many
    states: {
      collection: 'AttendanceState',
      via: 'attendance'
    },

    clusters: {
      type: 'json',
      defaultsTo: []
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.clusters;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.clusters = this.clusters;

      return obj;
    }
  },

  afterCreate: function (values, next) {
    for (var i =  1; i <= 60; i++) {
      setTimeout(function () {
        Attendance
        .findOneById(values.id)
        .populateAll()
        .exec(function (err, attendance) {
          if (attendance && attendance.post && attendance.post.course)
            sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
        });
      }, i * 1000);
    };

    next();
  },

  afterUpdate: function (values, next) {
    var createdAt = Moment(values.createdAt),
        diff = Moment().diff(createdAt);

    if (diff >= 60 * 1000)
      Attendance
      .findOneById(values.id)
      .populateAll()
      .exec(function (err, attendance) {
        if (attendance && attendance.post && attendance.post.course)
          sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
      });

    next();
  }

};
