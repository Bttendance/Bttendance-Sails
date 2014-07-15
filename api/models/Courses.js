/**
 * Courses
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var Random = require('../utils/random');

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

    code: {
      type: 'string',
      required: true,
      unique:true
    },

    opened: {
      type: 'boolean',
      required: true
    },

    students_count: {
      type: 'integer',
      defaultsTo: 0
    },

    attdCheckedAt: 'string',

    clicker_usage: {
      type: 'integer',
      defaultsTo: 0
    },

    notice_usage: {
      type: 'integer',
      defaultsTo: 0
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.managers;
      delete obj.students;
      delete obj.posts;
      delete obj.code;
      delete obj.opened;
      delete obj.attdCheckedAt;
      delete obj.clicker_usage;
      delete obj.notice_usage;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.code = this.code;
      obj.opened = this.opened;
      obj.attdCheckedAt = this.attdCheckedAt;
      obj.clicker_usage = this.clicker_usage;
      obj.notice_usage = this.notice_usage;
      return obj;
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
    values.students_count = 0;
    values.opened = true;
    values.code = Random.string(4);
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
