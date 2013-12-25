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

    number: {
      type: 'string',
      required: true
    },

    // whether this course is onGoing
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
      type: 'integer',
      required: true
    },
    
    // has many Students
    students: {
      type: 'array'
    },

    // has many Posts
    posts: {
      type: 'array'
    },

    professor_name: 'string',
    school_name: 'string',
    attdCheckedAt: 'string'
    
  },

  beforeValidation: function(values, next) {
    if (values.school_id) {
      values.school = values.school_id;
    }

    if (values.username) {
      User.findOne({
        username: values.username
      }).done(function(err, user) {
        if (!err && user) {
          values.professor = user.id;
          values.professor_name = user.full_name;
          next();
        } else
          return next(err);
      });
    } else
      next();
  },

  beforeCreate: function(values, next) {
    values.posts = new Array();
    values.students = new Array();

    School.findOne(values.school).done(function(err, school) {
      if (!err && school) {
        values.school_name = school.name;
        next();
      } else
        return next(err);
    });
  },

  afterCreate: function(values, next) {
    // add new course to user
    User.findOne(values.professor).done(function(err, user) {
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

    // add new course to school
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
