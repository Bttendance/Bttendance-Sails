'use strict';

/**
* AttendanceAlarm.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    course: {
      model: 'Course',
      index: true
    },

    // One-to-many
    schedule: {
      model: 'Schedule',
      index: true
    },

    // One-Way
    author: {
      model: 'User'
    },

    type: {
      type: 'string',
      enum: ['schedule', 'manual'],
      required: true
    },

    scheduledAt: {
      type: 'date',
      required: true
    },

    on: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }
  }
};
