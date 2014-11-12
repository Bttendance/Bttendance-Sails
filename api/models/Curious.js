/**
* Curiouses.js
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

    // One to Many
  	likes: {
      collection: 'CuriousLike',
      via: 'curious'
  	},

    // One to Many
  	followers: {
      collection: 'CuriousFollower',
      via: 'curious'
  	},

    // One to Many
    comments: {
      collection: 'Comment',
      via: 'curious'
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
    
    Curiouses
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, curious) {
      if (curious && curious.post && curious.post.course) {
        sails.sockets.broadcast('Course#' + curious.post.course, 'curious', curious.toWholeObject());       
      }
    });

    next();
  }
  
};

