'use strict';

/**
* Curious.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-Way
    course: {
      model: 'Course',
      index: true
    },

    // One-Way
    author: {
      model: 'User',
      required: true
    },

    title: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

    message: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

    // One-to-many
    likes: {
      collection: 'CuriousLike',
      via: 'curious'
    },

    // One-to-many
    followers: {
      collection: 'CuriousFollower',
      via: 'curious'
    },

    // One-to-many
    comments: {
      collection: 'Comment',
      via: 'curious'
    }
  },

  afterUpdate: function (values, next) {
    Curious
    .findOneById(values.id)
    .populateAll()
    .exec(function (err, curious) {
      if (curious && curious.post && curious.post.course) {
        sails.sockets.broadcast('Course#' + curious.post.course, 'curious', curious.toWholeObject());
      }
    });

    next();
  }

};
