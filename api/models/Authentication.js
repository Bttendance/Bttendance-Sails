'use strict';

/**
* Authentication.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    user: {
      model: 'User'
    },

    provider: {
      type: 'string',
      required: true,
      enum: ['facebook', 'twitter', 'google plus']
    },

    token: {
      type: 'string',
      required: true
    }
  }
};

