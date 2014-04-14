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

    number: {
      type: 'string'
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
      delete obj.managers;
      delete obj.students;
      delete obj.posts;
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
      obj.managers = this.managers;
      obj.students = this.students;
      obj.posts = this.posts;
      obj.attdCheckedAt = this.attdCheckedAt;

      obj.number = obj.number;
      obj.school_name = obj.school.name;
      obj.school = obj.school.id;

      //attd_check_count
      var checks = new Array();
      var attd_check_count = 0;
      for (var j = 0; j < obj.posts.length; j++)
        if (obj.posts[j].type == "attendance")
          attd_check_count++;
      obj.attd_check_count = attd_check_count;

      obj.managers = getIds(obj.managers);
      obj.students = getIds(obj.students);
      obj.posts = getIds(obj.posts);

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

var getIds = function(jsonArray) {
  if (!jsonArray)
    return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
    ids.push(jsonArray[i].id);
  return ids;
}
