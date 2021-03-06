'use strict';

/**
* EnrolledSchool.js
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
    school: {
      model: 'School',
      required: true,
      index: true
    },

    /**
    * @Supervisor
    * @Student
    * @Administrator
    */
    state: {
      type: 'string',
      required: true,
      enum: ['supervisor', 'student', 'administrator']
    },

    identity: {
      type: 'string',
      required: true,
      defaultsTo: ''
    }

  }
};
