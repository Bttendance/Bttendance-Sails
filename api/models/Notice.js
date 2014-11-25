'use strict';

/**
* Notice.js
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

    type: {
      type: 'string',
      required: true,
      enum: ['all', 'target'],
      defaultsTo: 'all'
    },

    message: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

    // One-to-many
    targets: {
      collection: 'NoticeTarget',
      via: 'notice'
    },

    toJSON: function () {
      var obj = this.toObject();

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      return obj;
    }
  },

  afterUpdate: function (values, next) {
    Notice
      .findOneById(values.id)
      .populateAll()
      .exec(function (err, notice) {
        if (notice && notice.post && notice.post.course) {
          sails.sockets.broadcast('Course#' + notice.post.course, 'notice', notice.toWholeObject());
        }
      });

    next();
  }

};
