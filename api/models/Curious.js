/**
* Curious.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    liked_users: {
      type: 'array',
      required: true,
      defaultsTo: new Array()
    },

    post: {
      model: 'Post'
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      if (this.post)
        obj.post = this.post.id;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      if (this.post)
        obj.post = this.post.toSimpleJSON();
      return obj;
    }
  },

  afterUpdate: function(values, next) {
    
    Curious
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, curious) {
      if (curious && curious.post && curious.post.course) 
        sails.sockets.broadcast('Course#' + curious.post.course, 'curious', curious.toWholeJSON());
    });

    next();
  }
};

