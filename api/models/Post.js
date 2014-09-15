/**
 * Post
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
  		type: 'string',
      required: true
  	},

    // One Way
    author: {
    	model: 'User',
      required: true
    },

    // One to Many
    course: {
    	model: 'Course'
    },

    // One to One
    attendance: {
      model: 'Attendance'
    },

    // One to One
    clicker: {
      model: 'Clicker'
    },

    // One to One
    notice: {
      model: 'Notice'
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.attendance;
      delete obj.clicker;
      delete obj.notice;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attendance = this.attendance;
      obj.clicker = this.clicker;
      obj.notice = this.notice;
      return obj;
    }
  },

  beforeValidate: function(values, next) {
    if (values.course_id)
      values.course = values.course_id;

    if (values.username) {
      User.findOne({
        username: values.username
      }).done(function(err, user) {
        if (user)
          values.author = user.id;
        else
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

      var clusters = new Array();
      var prof = new Array();
      prof.push(values.author);
      clusters.push(prof);

      Attendance
      .create({
        clusters: clusters,
        type: values.attendance_type
      }).exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        else {
          values.attendance = attendance.id;
          next();
        }
      });
    } else if (values.type == 'clicker') {
      Clicker
      .create({
        choice_count: Number(values.choice_count)
      }).exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        else {
          values.clicker = clicker.id;
          next();
        }
      });
    } else if (values.type == 'notice') {
      Notice
      .create({
      }).exec(function callback(err, notice) {
        if (err || !notice)
          next(err);
        else {
          values.notice = notice.id;
          next();
        }
      });
    } else
      next();
  },

  afterCreate: function(values, next) {
    if (values.type == 'attendance') {
      Attendance
      .update({id: values.attendance}, {post: values.id})
      .exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        else
          next();
      });
    } else if (values.type == 'clicker') {
      Clicker
      .update({id: values.clicker}, {post: values.id})
      .exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        else
          next();
      });
    } else if (values.type == 'notice') {
      Notice
      .update({id: values.notice}, {post: values.id})
      .exec(function callback(err, notice) {
        if (err || !notice)
          next(err);
        else
          next();
      });
    } else
      next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    
    Post
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, post) {
      if (post && post.course) 
        sails.sockets.broadcast('Course#' + post.course.id, 'post', post.toWholeObject());
    });

    next();
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(values, next) {
    next();
  }

};
