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

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.attdCheckedAt;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attdCheckedAt = this.attdCheckedAt;
      return obj;
    },

    toOldObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attdCheckedAt = this.attdCheckedAt;

      obj.number = obj.name;
      obj.school_name = obj.school.name;
      obj.school = obj.school.id;

      //attd_check_count
      var checks = new Array();
      var attd_check_count = 0;
      for (var j = 0; j < obj.posts.length; j++)
        if (obj.posts[j].type == "attendance")
          attd_check_count++;
      obj.attd_check_count = attd_check_count;

      //managers
      var managers = new Array();
      for (index in obj.managers)
        managers.push(obj.managers[index].id);
      obj.managers = managers;

      //students
      var students = new Array();
      for (index in obj.students)
        students.push(obj.students[index].id);
      obj.students = students;

      //posts
      var posts = new Array();
      for (index in obj.posts)
        posts.push(obj.posts[index].id);
      obj.posts = posts;

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
