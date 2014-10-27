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

    // One to One
    attendance: {
      model: 'Attendances'
    },

    // One to One
    clicker: {
      model: 'Clickers'
    },

    // One to One
    notice: {
      model: 'Notices'
    },

    // One to One
    curious: {
      model: 'Curiouses'
    },

    // One to Many
    comments: {
      collection: 'Comments',
      via: 'post'
    },

    seen_students: {
      type: 'json'
    },

    seen_managers: {
      type: 'json'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.attendance;
      delete obj.clicker;
      delete obj.notice;
      delete obj.curious;
      delete obj.comments;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.attendance = this.attendance;
      obj.clicker = this.clicker;
      obj.notice = this.notice;
      obj.curious = this.curious;
      obj.comments = this.comments;
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
    
    values.seen_students = new Array();
    values.seen_managers = new Array();

    if (values.type == 'attendance') {
      values.message = 'Attendance';

      var clusters = new Array();
      var prof = new Array();
      prof.push(values.author);
      clusters.push(prof);

      Attendances
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
      Clickers
      .create({
        choice_count: Number(values.choice_count),
        progress_time: Number(values.progress_time),
        show_info_on_select: values.show_info_on_select,
        detail_privacy: values.detail_privacy,
      }).exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        else {
          values.clicker = clicker.id;
          next();
        }
      });
    } else if (values.type == 'notice') {
      Notices
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
      Curiouses
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
      Attendances
      .update({id: values.attendance}, {post: values.id})
      .exec(function callback(err, attendance) {
        if (err || !attendance)
          next(err);
        else
          next();
      });
    } else if (values.type == 'clicker') {
      Clickers
      .update({id: values.clicker}, {post: values.id})
      .exec(function callback(err, clicker) {
        if (err || !clicker)
          next(err);
        else
          next();
      });
    } else if (values.type == 'notice') {
      Notices
      .update({id: values.notice}, {post: values.id})
      .exec(function callback(err, notice) {
        if (err || !notice)
          next(err);
        else
          next();
      });
    } else if (values.type == 'curious') {
      Curiouses
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
    
    Posts
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
