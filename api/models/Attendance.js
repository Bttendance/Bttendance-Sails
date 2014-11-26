'use strict';

/**
 * Attendance.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var moment = require('moment');

module.exports = {

  attributes: {

    // One-Way
    course: {
      model: 'Course',
      index: true
    },

    // One-Way
    author: {
      model: 'User',
      required: true
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

    // One-to-many
    clusters: {
      collection: 'AttendanceCluster',
      via: 'attendance'
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
    var createdAt = moment(values.createdAt),
        diff = moment().diff(createdAt);

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
