/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

  	title: {
  		type: 'string',
  		required: true
  	},

  	message: {
  		type: 'string',
  		required: true
  	},

  	on_going: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	},

    // has one author
    author: {
      type: 'string',
      required: true
    },

    // has one Course
    course: {
      type: 'integer',
      required: true
    },

    // has one studentCheck = 1 Student + 1 Check
    student_check: {
      type: 'array'
    }

  },

  beforeValidation: function(values, next) {
    if (values.username)
      values.author = values.username;
    if (values.course_id)
      values.course = values.course_id;
    next();
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.student_check = new Array();
    next();
  }

};
