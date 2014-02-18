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

    // has many Courses
    courses: {
      type: 'array'
    },

    // has many Serials
    serials: {
      type: 'array'
    }
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.courses = new Array();
    values.serials = new Array();
    next();
  }

};
