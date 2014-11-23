/**
* PostSeen.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    post: {
      model: 'Post',
      required: true,
      index: true
    },

    // One-to-one
    user: {
      model: 'User',
      required: true
    }

  }
};
