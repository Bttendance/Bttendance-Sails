/**
* Curiouses.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title: {
      type: 'string'
    },

    message: {
      type: 'string'
    },

  	liked_users: {
  		type: 'json',
      defaultsTo: new Array()
  	},

  	followers: {
  		type: 'json',
      defaultsTo: new Array()
  	},

    post: {
      model: 'Posts',
      index: true
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

