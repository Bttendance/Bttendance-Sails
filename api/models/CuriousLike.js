/**
* CuriousLike.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    curious: {
      model: 'Curious',
      required: true,
      index: true
    },

    // One-Way
    like: {
      model: 'User',
      required: true
    }

  }
};
