'use strict';

/**
* SeenUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    //One-to-Many
    seen: {
      model: 'Seen',
      required: true
    },

    //One-Way
    user: {
      model: 'User',
      required: true
    }

  }
};
