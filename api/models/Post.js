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

    // has one Course
    course: {
      type: 'json',
      required: true
    },

    // has one studentCheck = 1 Student + 1 Check
    student_check: {
      type: 'array'
    }

  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.course = '';
    next();
  }

};
