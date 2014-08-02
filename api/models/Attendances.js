/**
 * Attendances.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

    // auto, manual
    type: {
      type: 'string',
      required: true
    },

    checked_students: {
      type: 'json'
    },

    late_students: {
      type: 'json'
    },

		clusters: {
			type: 'json'
		},

		post: {
			model: 'Posts'
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.clusters;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
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
    if (!values.checked_students)
      values.checked_students = new Array();
    if (!values.late_students)
      values.late_students = new Array();
    if (!values.clusters)
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
      if (attendance && attendance.post && attendance.post.course) {
        var data = {};
        data.data = attendance.toWholeObject();
        sails.sockets.broadcast('Course#' + attendance.post.course, 'attendances', data);
      }
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
