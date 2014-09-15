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

    professorName: {
      type: 'string',
      required: true
    },

    // One to Many
    school: {
    	model: 'School',
      required: true
    },

    // Many to Many
    managers: {
    	collection: 'User',
    	via: 'supervisingCourses'
    },
    
    // Many to Many
    students: {
    	collection: 'User',
    	via: 'attendingCourses'
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

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.managers;
      delete obj.students;
      delete obj.posts;
      return obj;
    },

    toWholeJSON: function() {
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
    
  }

};
