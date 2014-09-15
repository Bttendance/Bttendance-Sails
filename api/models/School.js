/**
 * School
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // this has to be ENGLISH
    name: {
    	type: 'string',
    	required: true
    },

    // university, school, institute, etc
    type: {
      type: 'string',
      required: true
    },

    // One to Many
    courses: {
    	collection: 'Course',
    	via: 'school'
    },

    // Many to Many
    professors: {
    	collection: 'User',
    	via: 'employedSchools'
    },

    // Many to Many
    students: {
    	collection: 'User',
    	via: 'enrolledSchools'
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.courses;
      delete obj.students;
      delete obj.professors;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.coursesCount = this.courses.length;
      obj.professorsCount = this.professors.length;
      obj.studentsCount = this.students.length;
      return obj;
    } 
  }

};
