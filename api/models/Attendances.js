/**
 * Attendances.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var Moment = require('moment');

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
    if (!values.checked_students)
      values.checked_students = new Array();
    if (!values.late_students)
      values.late_students = new Array();
    if (!values.clusters)
      values.clusters = new Array();
    next();
  },

  afterCreate: function(values, next) {

    for (var i =  1; i <= 60; i++) {
      setTimeout(function() { 
    
        Attendances
        .findOneById(values.id)
        .populateAll()
        .exec(function callback(err, attendance) {
          if (attendance && attendance.post && attendance.post.course) {
            sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
          }
        });

      }, i * 1000);
    };

    next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    
    var createdAt = Moment(values.createdAt);
    var diff = Moment().diff(createdAt);
    if (diff >= 60 * 1000)
      Attendances
      .findOneById(values.id)
      .populateAll()
      .exec(function callback(err, attendance) {
        if (attendance && attendance.post && attendance.post.course) {
          sails.sockets.broadcast('Course#' + attendance.post.course, 'attendance', attendance.toWholeObject());
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
