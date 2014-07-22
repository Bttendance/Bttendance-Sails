/**
 * Schools
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

    // university, school, institute, army
    type: {
      type: 'string',
      required: true
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
      delete obj.courses;
      delete obj.students;
      delete obj.professors;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.courses_count = this.courses.length;
      obj.professors_count = this.professors.length;
      obj.students_count = this.students.length;
      return obj;
    } 
  }

};
