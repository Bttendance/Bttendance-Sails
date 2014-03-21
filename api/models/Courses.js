/**
 * Courses
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

    professor_name: {
      type: 'string',
      required: true
    },

    // One to Many
    school: {
    	model: 'Schools'
    },

    // Many to Many
    managers: {
    	collection: 'Users',
    	via: 'supervising_courses'
    },
    
    // Many to Many
    students: {
    	collection: 'Users',
    	via: 'attending_courses'
    },

    // One to Many
    posts: {
    	collection: 'Posts',
    	via: 'course'
    },

    attdCheckedAt: 'string',

    grade: 'integer',

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.students;
      delete obj.posts;
      delete obj.attdCheckedAt;
      delete obj.grade;
      return obj;
    },

    toWholeJSON: function() {
      var result = {};
      for(var key in this) {
        if (key != 'toJSON')
          result[key] = this[key];
      }
      return result;
    }
    
  },

  beforeValidate: function(values, next) {
    if (values.school_id)
      values.school = values.school_id;
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
