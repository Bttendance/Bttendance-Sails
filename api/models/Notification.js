'use strict';

/**
* Notification.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    seen: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

    //One-Way
    user: {
      model: 'User',
      required: true,
      index: true
    },

    //One-Way
    course: {
      model: 'Course',
      required: true,
      index: true
    },

    type: {
      type: 'string',
      required: true,
      enum: ['attendance', 'clicker', 'notice', 'curious', 'comment']
    },

    //One-Way
    attendance: {
      model: 'Attendance'
    },

    //One-Way
    clicker: {
      model: 'Clicker'
    },

    //One-Way
    notice: {
      model: 'Notice'
    },

    //One-Way
    curious: {
      model: 'Curious'
    },

    //One-Way
    comment: {
      model: 'Comment'
    },

  }
};
