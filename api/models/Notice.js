/**
* Notice.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

		seen_students: {
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
    
    Notice
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, notice) {
      if (notice && notice.post && notice.post.course) 
        sails.sockets.broadcast('Course#' + notice.post.course, 'notice', notice.toWholeJSON());
    });

    next();
  }
};

