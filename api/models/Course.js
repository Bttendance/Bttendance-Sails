/**
 * Course
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
      if (this.school)
        obj.school = this.school.id;
      delete obj.managers;
      delete obj.students;
      delete obj.posts;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);

      obj.managers = new Array();
      for (var i = 0; i < this.managers.length; i++)
        obj.managers.push(this.managers[i].toSimpleJSON());

      delete obj.students;
      if (this.students)
        obj.studentsCount = this.students.length;

      delete obj.posts;
      if (this.posts)
        obj.postsCount = this.posts.length;

      return obj;
    }
    
  }

};
