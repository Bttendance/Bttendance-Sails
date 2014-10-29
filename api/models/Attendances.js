/**
 * Attendances.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

    type: {
      type: 'string',
      enum: ['auto', 'manual', 'alarm'],
      required: true,
      index: true
    },

    checked_students: {
      type: 'json',
      defaultsTo: new Array()
    },

    late_students: {
      type: 'json',
      defaultsTo: new Array()
    },

		clusters: {
			type: 'json',
      defaultsTo: new Array()
		},

		post: {
			model: 'Posts',
      index: true
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.clusters;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.clusters = this.clusters;
      return obj;
    }
	},

  afterUpdate: function(values, next) {
    
    Attendances
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, attendance) {
      if (attendance && attendance.post && attendance.post.course) 
        sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
    });
    
    next();
  }

};
