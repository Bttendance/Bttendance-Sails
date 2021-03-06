'use strict';

/**
* NoticeTarget.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    notice: {
      model: 'Notice',
      required: true,
      index: true
    },

    // One-Way
    student: {
      model: 'User',
      required: true
    }

  }
};
