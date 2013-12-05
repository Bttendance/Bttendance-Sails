/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

  	title: {
  		type: 'string',
  		required: true
  	},

  	message: {
  		type: 'string',
  		required: true
  	},

  	on_going: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	},

    // has one author
    author: {
      type: 'integer',
      required: true
    },

    // has one Course
    course: {
      type: 'integer',
      required: true
    },

    // has many students (checked)
    checks: {
      type: 'array'
    },

    author_name: 'string',
    course_name: 'string',
    course_number: 'string',
    school_name: 'string'

  },

  beforeValidation: function(values, next) {

    if (values.course_id)
        values.course = values.course_id;

    if (values.username) {
      User.findOne({
        username: values.username
      }).done(function(err, user) {
        if (!err && user) {
          values.author = user.id;
          values.author_name = user.full_name;
          next();
        } else
          return next(err);
      });
    } else
      next();
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.checks = new Array();
    Course.findOne(values.course).done(function(err, course) {
      if (!err && course) {
        values.course_name = course.name;
        values.course_number = course.number;

        School.findOne(course.school).done(function(err, school) {
          if (!err && school) {
            values.school_name = school.name;
            next();
          } else
            return next(err);
        });
      } else
        return next(err);
    });
  },

  // Lifecycle Callbacks
  afterCreate: function(values, next) {
    // add new post to course
    Course.findOne(values.course).done(function(err, course) {
      // return err
      if (err) return next(err);
      // make new array
      if (!course.posts) course.posts = new Array();

      if (course.posts.indexOf(course) == -1) 
        course.posts.push(values.id);

      // save new values
      course.save(function(err) {
        if (err) return next(err);
      });
    });
    
    next();
  }

};
