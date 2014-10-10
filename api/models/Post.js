/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // attendance, notice, clicker, curious
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

    // One to One
    curious: {
      model: 'Curious'
    },

    // Many to One
    comments: {
      collection: 'Comment',
      via: 'post'
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      if (this.author)
        obj.author = this.author.id;
      if (this.course)
        obj.course = this.course.id;
      delete obj.attendance;
      delete obj.clicker;
      delete obj.notice;
      delete obj.curious;
      delete obj.comments;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);

      if (this.author)
        obj.author = this.author.toSimpleJSON();

      if (this.course)
        obj.course = this.course.toSimpleJSON();

      if (this.attendance)
        obj.attendance = this.attendance.toSimpleJSON();

      if (this.clicker)
        obj.clicker = this.clicker.toSimpleJSON();

      if (this.notice)
        obj.notice = this.notice.toSimpleJSON();

      if (this.curious)
        obj.curious = this.curious.toSimpleJSON();

      obj.comments = new Array();
      for (var i = 0; i < this.comments.length; i++)
        obj.comments.push(this.comments[i].toSimpleJSON());
      
      return obj;
    }
  },

  beforeValidate: function(values, next) {
    if (values.course_id)
      values.course = values.course_id;
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
    } else if (values.type == 'curious') {
      Curious
      .create({
      }).exec(function callback(err, curious) {
        if (err || !curious)
          next(err);
        else {
          values.curious = curious.id;
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
    } else if (values.type == 'curious') {
      Curious
      .update({id: values.curious}, {post: values.id})
      .exec(function callback(err, curious) {
        if (err || !curious)
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
        sails.sockets.broadcast('Course#' + post.course.id, 'post', post.toWholeJSON());
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
