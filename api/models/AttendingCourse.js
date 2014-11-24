'use strict';

/**
* AttendingCourse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    user: {
      model: 'User',
      required: true,
      index: true
    },

    // One-to-many
    course: {
      model: 'Course',
      required: true,
      index: true
    },

    state: {
      type: 'string',
      required: true,
      enum: ['attending', 'droped', 'removed']
    }

  }
};
