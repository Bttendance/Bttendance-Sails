/**
 * Course
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

  	name: {
  		type: 'string',
  		required: true
  	},

  	section: {
  		type: 'string'
  	},

  	onGoing: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	},

    // has one School
    school: {
      type: 'integer',
      required: true
    },

    // has one Professor
    professor: {
      type: 'string',
      required: true
    },
    
    // has many Students
    students: {
      type: 'array'
    },

    // has many Posts
    posts: {
      type: 'array'
    }
    
  },

  beforeValidation: function(values, next) {
    if (values.username)
      values.professor = values.username;
    if (values.school_id)
      values.school = values.school_id;
    next();
  },

  beforeCreate: function(values, next) {
    values.posts = new Array();
    values.students = new Array();
    next();
  },

  afterCreate: function(values, next) {
    // add new courses to user
    User.findOne({
      username: values.professor
    }).done(function(err, user) {
      // return err
      if (err) return next(err);
      // make new array
      if (!user.courses) user.courses = new Array();
      // add course to user who created this course
      if (user.courses.indexOf(values.id) == -1)
        user.courses.push(values.id);
      // save new values
      user.save(function(err) {
        if (err) return next(err);
      });
    });
    // add new courses to school
    School.findOne(values.school).done(function(err, school) {
      // return err
      if (err) return next(err);
      // make new array
      if (!school.courses) school.courses = new Array();

      if (school.courses.indexOf(school) == -1)
        school.courses.push(values.id);
      // save new values
      school.save(function(err) {
        if (err) return next(err);
      });
    });

    next();
  }
};
