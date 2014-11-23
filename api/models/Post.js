/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // One-to-many
    course: {
      model: 'Course',
      index: true
    },

    // One-to-one
    author: {
      model: 'User'
    },

    type: {
      type: 'string',
      enum: ['attendance', 'notice', 'clicker', 'curious'],
      required: true
    },

    // One-to-many
    seen: {
      collection: 'PostSeen',
      via: 'post'
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;

      return obj;
    }
  },

  beforeCreate: function (values, next) {
    if (values.type === 'attendance') {
      values.message = 'Attendance';

      var clusters = [];
          prof = [];

      prof.push(values.author);
      clusters.push(prof);

      Attendance
        .create({
          clusters: clusters,
          type: values.attendanceType
        }).exec(function (err, attendance) {
          if (err || !attendance) {
            next(err);
          } else {
            values.attendance = attendance.id;
            next();
          }
        });
    } else if (values.type === 'clicker') {
      Clicker
        .create({
          choiceCount: Number(values.choiceCount),
          progressTime: Number(values.progressTime),
          showInfoOnSelect: values.showInfoOnSelect,
          detailPrivacy: values.detailPrivacy,
        }).exec(function (err, clicker) {
          if (err || !clicker) {
            next(err);
          } else {
            values.clicker = clicker.id;
            next();
          }
        });
    } else if (values.type === 'notice') {
      Notice
        .create().exec(function (err, notice) {
          if (err || !notice) {
            next(err);
          } else {
            values.notice = notice.id;
            next();
          }
        });
    } else if (values.type === 'curious') {
      Curious
        .create()
        .exec(function (err, curious) {
          if (err || !curious) {
            next(err);
          } else {
            values.curious = curious.id;
            next();
          }
        });
    } else {
      next();
    }
  },

  afterCreate: function (values, next) {
    if (values.type === 'attendance') {
      Attendance
        .update({ id: values.attendance }, { post: values.id })
        .exec(function (err, attendance) {
          if (err || !attendance) {
            next(err);
          } else {
            next();
          }
        });
    } else if (values.type === 'clicker') {
      Clicker
        .update({ id: values.clicker }, { post: values.id })
        .exec(function (err, clicker) {
          if (err || !clicker) {
            next(err);
          } else {
            next();
          }
        });
    } else if (values.type === 'notice') {
      Notice
        .update({ id: values.notice }, { post: values.id })
        .exec(function (err, notice) {
          if (err || !notice) {
            next(err);
          } else {
            next();
          }
        });
    } else if (values.type === 'curious') {
      Curious
        .update({ id: values.curious }, { post: values.id })
        .exec(function (err, curious) {
          if (err || !curious)
            next(err);
          else
            next();
        });
    } else {
      next();
    }
  },

  afterUpdate: function (values, next) {
    Post
      .findOneById(values.id)
      .populateAll()
      .exec(function (err, post) {
        if (post && post.course) {
          sails.sockets.broadcast('Course#' + post.course.id, 'post', post.toWholeObject());
        }
      });

    next();
  }

};
