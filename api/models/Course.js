/**
 * Course
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

  	section: {
  		type: 'string'
  	},

  	onGoing: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	},

    // has one School
    school: {
      type: 'integer',
      required: true
    },

    // has one Professor
    professor: {
      type: 'string',
      required: true
    },
    
    // has many Students
    students: {
      type: 'array'
    },

    // has many Posts
    posts: {
      type: 'array'
    }
    
  },

  beforeValidation: function(values, next) {
    values.professor = values.username;
    values.school = values.school_id;
    next();
  },

  beforeCreate: function(values, next) {
    values.posts = new Array();
    values.students = new Array();
    next();
  }

};
