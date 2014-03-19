/**
 * Schools
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
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

    // One to Many
    serials: {
    	collection: 'Serials',
    	via: 'school'
    },

    // One to Many
    courses: {
    	collection: 'Courses',
    	via: 'school'
    },

    // Many to Many
    professors: {
    	collection: 'Users',
    	via: 'employed_schools'
    },

    // Many to Many
    students: {
    	collection: 'Users',
    	via: 'enrolled_schools'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.logo_image;
      delete obj.type;
      delete obj.serials;
      delete obj.students;
      return obj;
    },

    toWholeJSON: function() {
      var obj = this.toObject();
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
    next();
  },

  afterCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    next();
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(next) {
    next();
  }

};
