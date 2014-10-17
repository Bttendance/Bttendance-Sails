/**
 * Attendance.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

    // auto, manual
    type: {
      type: 'string',
      enum: ['auto', 'manual'],
      required: true
    },

    checked_students: {
      type: 'array',
      required: true,
      defaultsTo: new Array()
    },

    late_students: {
      type: 'array',
      required: true,
      defaultsTo: new Array()
    },

		clusters: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		post: {
			model: 'Post'
		},

    toSimpleJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.clusters;
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
    
    Attendance
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, attendance) {
      if (attendance && attendance.post && attendance.post.course) 
        sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeJSON());
    });
    
    next();
  }

};
