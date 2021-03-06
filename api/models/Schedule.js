'use strict';

/**
* Schedules.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    course: {
      model: 'Course',
      index: true
    },

    weekday: {
      type: 'string',
      required: true,
      enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },

    time: {
      type: 'string',
      required: true
    },

    timezone: {
      type: 'string',
      required: true
    },

    alarms: {
      collection: 'AttendanceAlarm',
      via: 'schedule'
    }
  }
};
