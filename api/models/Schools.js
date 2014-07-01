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
      delete obj.serials;
      delete obj.students;
      delete obj.professors;
      delete obj.courses;
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
      obj.serials = this.serials;
      obj.students = this.students;
      obj.professors = this.professors;
      obj.courses = this.courses;

      //Parsing
      obj.serials = getIds(obj.serials);
      obj.courses = getIds(obj.courses);
      obj.professors = getIds(obj.professors);
      obj.students = getIds(obj.students);
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

var getIds = function(jsonArray) {
  if (!jsonArray)
    return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
    ids.push(jsonArray[i].id);
  return ids;
}
