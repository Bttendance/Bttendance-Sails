/**
 * Posts
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // attendance, notice, poll
    type: {
      type: 'string',
      required: true
    },

  	message: {
  		type: 'string'
  	},

    // One Way
    author: {
    	model: 'Users'
    },

    // One to Many
    course: {
    	model: 'Courses'
    },

    // has many students (checked)
    checks: {
      type: 'array'
    },

    clusters: {
      type: 'array'
    },

    grade: 'integer',

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.checks;
      delete obj.clusters;
      delete obj.grade;
      return obj;
    },

    toWholeJSON: function() {
      var result = {};
      for(var key in this) {
        if (key != 'toJSON')
          result[key] = this[key];
      }
      return result;
    }
    
  },

  beforeValidate: function(values, next) {
    if (values.course_id)
      values.course = values.course_id;

    if (values.username) {
      Users.findOne({
        username: values.username
      }).done(function(err, user) {
        if (user)
          values.author = user.id;
        next();
      });
    } else
      next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {

    if (values.type == 'attendance' && !values.checks) {
      var checks = new Array();
      checks.push(values.author);
      values.checks = checks;
    }

    if (values.type == 'attendance' && !values.clusters) {
      var clusters = new Array();
      var prof = new Array();
      prof.push(values.author);
      clusters.push(prof);
      values.clusters = clusters;
    }

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
