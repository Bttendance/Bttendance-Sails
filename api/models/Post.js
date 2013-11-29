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
    }

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
    next();
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
