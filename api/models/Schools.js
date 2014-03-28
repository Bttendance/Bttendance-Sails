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
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      return obj;
    },

    toOldObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;

      //serials
      var serials = new Array();
      for (var i = 0; i < obj.serials.length; i++)
        serials.push(obj.serials[i].id);
      obj.serials = serials;

      //courses
      var courses = new Array();
      for (var i = 0; i < obj.courses.length; i++)
        courses.push(obj.courses[i].id);
      obj.courses = courses;

      //professors
      var professors = new Array();
      for (var i = 0; i < obj.professors.length; i++)
        professors.push(obj.professors[i].id);
      obj.professors = professors;
      
      //students
      var students = new Array();
      for (var i = 0; i < obj.students.length; i++)
        students.push(obj.students[i].id);
      obj.students = students;

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
