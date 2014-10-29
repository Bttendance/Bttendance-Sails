/**
* Notices.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

		seen_students: {
			type: 'json',
      defaultsTo: new Array()
		},

		post: {
			model: 'Posts'
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

