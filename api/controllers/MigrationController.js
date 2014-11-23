/**
 * MigrationController
 *
 * @description :: Server-side logic for managing migrations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Arrays = require('../utils/arrays');

module.exports = {

  migrate1: function (req, res) {
    // Setting (done)
    Settings
    .find()
    .exec(function (err, settings) {
      for (var i = 0; i < settings.length; i++) {
        settings[i].curious = true;
        settings[i].save();
      }
    });

    // Attendance (done)
    Attendance
    .find()
    .exec(function (err, attendances) {
      for (var i = attendances.length - 1; i >= 0; i--) {
        attendances[i].type = 'auto';
        attendances[i].save();
      };
    });
  },

  migrate2: function (req, res) {
    // Question (done)
    Questions
    .find()
    .exec(function (err, questions) {
      async.each(questions, function (question, next) {

        if (!question.owner || question.owner == null)
          next();
        else {
          User
          .findOneById(question.owner)
          .populate('supervisingCourses')
          .exec(function (err, user) {
            if (user && user.supervisingCourses) {
              for (var i = user.supervisingCourses.length - 1; i >= 0; i--) {
                console.log(user.supervisingCourses[i]);
                ClickerQuestion.create({
                  author: question.owner,
                  message: question.message,
                  choiceCount: question.choiceCount,
                  progressTime: question.progressTime,
                  detailPrivacy: question.detailPrivacy,
                  showInfoOnSelect: question.showInfoOnSelect,
                  course: user.supervisingCourses[i].id
                }).exec(function (err, clickerQuestion) {
                  if (err)
                    console.log(err);
                  else
                    console.log(clickerQuestion);
                });
              }
            }
            next();
          });
        }

      }, function (err) {
        // TODO: Handle error
      });
    });
  },

  migrate3: function (req, res) {
    // Post init seen_students & seen_managers (done)
    Post
    .find()
    .exec(function (err, posts) {
      for (var i = posts.length - 1; i >= 0; i--) {
        posts[i].seen_students = [];
        posts[i].seen_managers = [];
        posts[i].save();
      };
    });
  },

  migrate4: function (req, res) {
    // seen_students, seen_managers (done)
    Course
    .find()
    .populate('posts')
    .populate('students')
    .populate('managers')
    .exec(function (err, courses) {
      async.each(courses, function (course, callback) {
        for (var i = course.posts.length - 1; i >= 0; i--) {
          if (course.posts[i].type != 'notice')
            course.posts[i].seen_students = Arrays.getIds(course.students);
          course.posts[i].seen_managers = Arrays.getIds(course.managers);
          course.posts[i].save();
        };
      }, function (err) {
        // TODO: Handle error
      });
    });
  },

  migrate5: function (req, res) {
    // Notice (done)
    Post
    .findByType('notice')
    .populate('notice')
    .exec(function (err, posts) {
      for (var i = posts.length - 1; i >= 0; i--) {
        if (posts[i].notice && posts[i].notice != null) {
          posts[i].seen_students = posts[i].notice.seen_students;
          posts[i].save();
        }
      };
    });
  }

};
