/**
 * Posts
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // attendance, notice, clicker
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

    attendance: {
      model: 'Attendances'
    },

    clicker: {
      model: 'Clickers'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.attendance;
      delete obj.clicker;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attendance = this.attendance;
      obj.clicker = this.clicker;
      return obj;
    },

    toOldObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attendance = this.attendance;
      obj.clicker = this.clicker;

      obj.title = obj.course.name;
      obj.author_name = obj.author.full_name;
      obj.course_name = obj.course.name;
      obj.course_number = obj.course.name;

      obj.author = obj.author.id;
      obj.course = obj.course.id;

      if (obj.type == 'attendance') {
        obj.checks = obj.attendance.checked_students;
        obj.clusters = obj.attendance.clusters;
      } else {
        obj.checks = new Array();
        obj.clusters = new Array();
      }

      delete obj.attendance;
      delete obj.clicker;

      return obj;
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
    if (values.type == 'attendance') {
      values.message = 'Attendance';

      var checked_students = new Array();
      checked_students.push(values.author);

      var clusters = new Array();
      var prof = new Array();
      prof.push(values.author);
      clusters.push(prof);

      Attendances
      .create({
        checked_students: checked_students,
        clusters: clusters
      }).exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        values.attendance = attendance.id;
        next();
      });
    } else if (values.type == 'clicker') {
      Clickers
      .create({
        choice_count: Number(values.choice_count)
      }).exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        values.clicker = clicker.id;
        next();
      });
    } else
      next();
  },

  afterCreate: function(values, next) {
    if (values.type == 'attendance') {
      Attendances
      .update({id: values.attendance}, {post: values.id})
      .exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        next();
      });
    } else if (values.type == 'clicker') {
      Clickers
      .update({id: values.clicker}, {post: values.id})
      .exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        next();
      });
    } else
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
