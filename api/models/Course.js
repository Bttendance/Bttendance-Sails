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
    	model: 'School'
    },

    // Many to Many
    managers: {
    	collection: 'User',
    	via: 'supervising_courses'
    },
    
    // Many to Many
    students: {
    	collection: 'User',
    	via: 'attending_courses'
    },

    // One to Many
    posts: {
    	collection: 'Post',
    	via: 'course'
    },

    code: {
      type: 'string',
      required: true,
      unique:true
    },

    opened: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.managers;
      delete obj.students;
      delete obj.posts;
      delete obj.code;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.managers = this.managers;
      obj.students_count = this.students.length;
      obj.posts_count = this.posts.length;
      obj.code = this.code;
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

  afterDestroy: function(values, next) {
    next();
  }

};
