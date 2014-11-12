/**
* Notices.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One Way
    post: {
      model: 'Post',
      required: true,
      index: true
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

    // One to Many
    targets: {
      collection: 'NoticeTarget',
      via: 'notice'
    },

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      return obj;
    }
  },
  
  afterUpdate: function(values, next) {
    
    Notices
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, notice) {
      if (notice && notice.post && notice.post.course) 
        sails.sockets.broadcast('Course#' + notice.post.course, 'notice', notice.toWholeObject());
    });

    next();
  }

};

