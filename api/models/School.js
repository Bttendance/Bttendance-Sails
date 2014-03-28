/**
 * School
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

    name: {
    	type: 'string',
    	required: true
    },

    logo_image: {
    	type: 'url'
    },

    website: {
    	type: 'url',
      required: true
    },

    // public, private
    type: {
      type: 'string',
      required: true
    },

    // has many Courses
    courses: {
      type: 'json'
    },

    // has many Professors
    professors: {
      type: 'json'
    },

    // has many Students
    students: {
      type: 'json'
    },

    // has many Serials
    serials: {
      type: 'json'
    }
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.courses = new Array();
    values.serials = new Array();
    values.professors = new Array();
    values.students = new Array();
    next();
  }

};
