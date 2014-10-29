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
      required: true
    },

    checked_students: {
      type: 'json',
      required: true
    },

    late_students: {
      type: 'json',
      required: true
    },

		clusters: {
			type: 'json',
      required: true
		},

		post: {
			model: 'Posts'
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

  beforeValidate: function(values, next) {
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    values.checked_students = new Array();
    values.late_students = new Array();
    values.clusters = new Array();
    next();
  },

  afterCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
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
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(values, next) {
    next();
  }

};
