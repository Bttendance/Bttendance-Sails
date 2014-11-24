'use strict';

/**
* AttendanceState.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    attendance: {
      model: 'Attendance',
      required: true,
      index: true
    },

    // One-Way
    student: {
      model: 'User',
      required: true
    },

    state: {
      type: 'string',
      required: true,
      enum: ['attended', 'tardy', 'abscent', 'claimed'],
      defaultsTo: 'abscent'
    }

  }
};
