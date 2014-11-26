'use strict';

/**
* Settings.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    attendance: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    clicker: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    notice: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    curiousCreated: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    curiousFollowing: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }

  }
};
