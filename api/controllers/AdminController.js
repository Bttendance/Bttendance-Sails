/**
 * AdminController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Moment = require('moment-timezone');

module.exports = {

  show: function (req, res) {
    var password = req.param('password'),
        model = req.param('model'),
        id = req.param('id'),
        page = req.param('page'),
        email = req.param('email'),
        course = req.param('course');

    if (password !== 'bttendance') {
      res.contentType('html');
      return res.forbidden('Your password doesn\'t match.');
    }

    // TODO: Fix conditional
    if ((model === 'User' && !email)
      && (model === 'Post' && !course)
      && (!id || isNaN(Number(id)))
      && (!page || isNaN(Number(page)))) {
      res.contentType('html');
      return res.forbidden('Numeric parameter id or page is required.');
    }

    if (model === 'User') {
      if (page) {
        User.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, users) {
            if (err || !users) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < users.length; i++) {
                users[i] = users[i].toWholeObject();
              }
              return res.send(users);
            }
          });
      } else {
        User.findOne({ or: [{ id: id }, { email: email }] })
          .populateAll()
          .exec(function (err, user) {
            if (err || !user) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(user.toWholeObject());
            }
          });
      }
    } else if (model === 'School') {
      if (page) {
        School.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, schools) {
            if (err || !schools) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < schools.length; i++) {
                schools[i] = schools[i].toWholeObject();
              }
              return res.send(schools);
            }
          });
      } else {
        School.findOneById(Number(id))
          .populateAll()
          .exec(function (err, school) {
            if (err || !school) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(school.toWholeObject());
            }
          });
      }
    } else if (model === 'Course') {
      if (page) {
        Course.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, courses) {
            if (err || !courses) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < courses.length; i++) {
                courses[i] = courses[i].toWholeObject();
              }
              return res.send(courses);
            }
          });
      } else {
        Course.findOneById(Number(id))
          .populateAll()
          .exec(function (err, course) {
            if (err || !course) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(course.toWholeObject());
            }
          });
      }
    } else if (model === 'ClickerQuestion') {
      if (page) {
        ClickerQuestion.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, clicker_questions) {
            if (err || !clicker_questions) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < clicker_questions.length; i++) {
                clicker_questions[i] = clicker_questions[i].toWholeObject();
              }
              return res.send(clicker_questions);
            }
          });
      } else {
        ClickerQuestion.findOneById(Number(id))
          .populateAll()
          .exec(function (err, clicker_question) {
            if (err || !clicker_question) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(clicker_question.toWholeObject());
            }
          });
      }
    } else if (model === 'AttendanceAlarm') {
      if (page) {
        AttendanceAlarm.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, attendance_alarms) {
            if (err || !attendance_alarms) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < attendance_alarms.length; i++) {
                attendance_alarms[i] = attendance_alarms[i].toWholeObject();
              }
              return res.send(attendance_alarms);
            }
          });
      } else {
        AttendanceAlarm.findOneById(Number(id))
          .populateAll()
          .exec(function (err, attendance_alarm) {
            if (err || !attendance_alarm) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(attendance_alarm.toWholeObject());
            }
          });
      }
    } else if (model === 'Post') {
      if (page) {
        Post.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, posts) {
            if (err || !posts) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < posts.length; i++) {
                posts[i] = posts[i].toWholeObject();
              }
              return res.send(posts);
            }
          });
      } else if (id) {
        Post.findOneById(Number(id))
          .populateAll()
          .exec(function (err, post) {
            if (err || !post) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(post.toWholeObject());
            }
          });
      } else {
        Post.find({ where: { course: course }, sort: 'id DESC'})
          .populateAll()
          .exec(function (err, posts) {
            if (err || !posts) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < posts.length; i++) {
                posts[i] = posts[i].toWholeObject();
              }
              return res.send(posts);
            }
          });
      }
    } else if (model === 'Comment') {
      if (page) {
        Comment.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, comments) {
            if (err || !comments) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < comments.length; i++) {
                comments[i] = comments[i].toWholeObject();
              }
              return res.send(comments);
            }
          });
      } else {
        Comment.findOneById(Number(id))
          .populateAll()
          .exec(function (err, comment) {
            if (err || !comment) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(comment.toWholeObject());
            }
          });
      }
    } else if (model === 'Attendance') {
      if (page) {
        Attendance.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, attendances) {
            if (err || !attendances) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < attendances.length; i++) {
                attendances[i] = attendances[i].toWholeObject();
              }
              return res.send(attendances);
            }
          });
      } else {
        Attendance.findOneById(Number(id))
          .populateAll()
          .exec(function (err, attendance) {
            if (err || !attendance) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(attendance.toWholeObject());
            }
          });
      }
    } else if (model === 'Clicker') {
      if (page) {
        Clicker.find()
          .paginate({page: page, limit: 50})
          .populateAll()
          .sort('id DESC')
          .exec(function (err, clickers) {
            if (err || !clickers) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < clickers.length; i++)
                clickers[i] = clickers[i].toWholeObject();
              return res.send(clickers);
            }
          });
      } else {
        Clicker.findOneById(Number(id))
          .populateAll()
          .exec(function (err, clicker) {
            if (err || !clicker) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(clicker.toWholeObject());
            }
          });
      }
    } else if (model === 'Notice') {
      if (page) {
        Notice.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, notices) {
            if (err || !notices) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < notices.length; i++) {
                notices[i] = notices[i].toWholeObject();
              }
              return res.send(notices);
            }
          });
      } else {
        Notice
        .findOneById(Number(id))
        .populateAll()
        .exec(function (err, notice) {
          if (err || !notice) {
            res.contentType('html');
            return res.notFound();
          } else {
            res.contentType('application/json; charset=utf-8');
            return res.send(notice.toWholeObject());
          }
        });
      }
    } else if (model === 'Curious') {
      if (page) {
        Curious.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, curiouses) {
            if (err || !curiouses) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < curiouses.length; i++) {
                curiouses[i] = curiouses[i].toWholeObject();
              }
              return res.send(curiouses);
            }
          });
      } else {
        Curious.findOneById(Number(id))
          .populateAll()
          .exec(function (err, curious) {
            if (err || !curious) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(curious.toWholeObject());
            }
          });
      }
    } else if (model === 'Device') {
      if (page) {
        Device.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, devices) {
            if (err || !devices) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < devices.length; i++) {
                devices[i] = devices[i].toWholeObject();
              }
              return res.send(devices);
            }
          });
      } else {
        Device.findOneById(Number(id))
          .populateAll()
          .exec(function (err, device) {
            if (err || !device) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(device.toWholeObject());
            }
          });
      }
    } else if (model === 'Setting') {
      if (page) {
        Settings.find()
          .paginate({ page: page, limit: 50 })
          .populateAll()
          .sort('id DESC')
          .exec(function (err, settings) {
            if (err || !settings) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < settings.length; i++) {
                settings[i] = settings[i].toWholeObject();
              }
              return res.send(settings);
            }
          });
      } else {
        Settings.findOneById(Number(id))
          .populateAll()
          .exec(function (err, setting) {
            if (err || !setting) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(setting.toWholeObject());
            }
          });
      }
    } else if (model === 'Identification') {
      if (page) {
        Identification.find()
          .paginate({page: page, limit: 50})
          .populateAll()
          .sort('id DESC')
          .exec(function (err, identifications) {
            if (err || !identifications) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              for (var i = 0; i < identifications.length; i++) {
                identifications[i] = identifications[i].toWholeObject();
              }
              return res.send(identifications);
            }
          });
      } else {
        Identification.findOneById(Number(id))
          .populateAll()
          .exec(function (err, identification) {
            if (err || !identification) {
              res.contentType('html');
              return res.notFound();
            } else {
              res.contentType('application/json; charset=utf-8');
              return res.send(identification.toWholeObject());
            }
          });
      }
    } else {
      res.contentType('html');
      return res.forbidden('Check out your model parameter.');
    }
  },

  user: function (req, res) {
    var password = req.param('password'),
        start = req.param('start'),
        end = req.param('end');

    if (password !== 'bttendance') {
      res.contentType('html');
      return res.forbidden('Your password doesn\'t match.');
    }

    if (!start) {
      res.contentType('html');
      return res.forbidden('Check out your model parameter.');
    }

    var startDate = Moment.tz(start, "Asia/Seoul").zone("+00:00").format(),
        endDate;
    if (!end) {
      endDate = Moment.tz("Asia/Seoul").zone("+00:00").format();
    } else {
      endDate = Moment.tz(end, "Asia/Seoul").zone("+00:00").format();
    }

    if (startDate === 'Invalid date') {
      res.contentType('html');
      return res.forbidden('Start is not valid format date.');
    }

    if (endDate === 'Invalid date') {
      res.contentType('html');
      return res.forbidden('End is not valid format date.');
    }

    User.find({ createdAt: { '>': startDate, '<': endDate } })
      .exec(function (err, users) {
        if (err || !users) {
          res.contentType('html');
          return res.notFound();
        } else {
          res.contentType('application/json; charset=utf-8');
          return res.send({ user_count: users.length });
        }
      });
  },

  analyze: function (req, res) {
    var password = req.param('password'),
        start = req.param('start'),
        end = req.param('end');

    if (password !== 'bttendance') {
      res.contentType('html');
      return res.forbidden('Your password doesn\'t match.');
    }

    if (!start) {
      res.contentType('html');
      return res.forbidden('Check out your model parameter.');
    }

    var startDate = Moment.tz(start, "Asia/Seoul").zone("+00:00").format(),
        endDate;
    if (!end) {
      endDate = Moment.tz("Asia/Seoul").zone("+00:00").format();
    } else {
      endDate = Moment.tz(end, "Asia/Seoul").zone("+00:00").format();
    }

    if (startDate === 'Invalid date') {
      res.contentType('html');
      return res.forbidden('Start is not valid format date.');
    }

    if (endDate === 'Invalid date') {
      res.contentType('html');
      return res.forbidden('End is not valid format date.');
    }

    Course.find({ createdAt: { '>': startDate, '<': endDate } })
      .sort('createdAt DESC')
      .populate('students')
      .exec(function (err, courses) {
        if (err || !courses) {
          res.contentType('html');
          return res.notFound();
        } else {
          res.contentType('application/json; charset=utf-8');

          var result = { courseCount: courses.length };

          for (var i = 0; i < courses.length; i++) {
            courses[i].studentsCount = courses[i].students.length;
          }

          var largeCourseIds = [];
          for (var i = 0; i < courses.length; i++) {
            if (courses[i].students.length >= 5) {
              largeCourseIds.push(courses[i].id);
            }
          }

          result.largeCourseCount = largeCourseIds.length;

          Course.find(largeCourseIds)
            .populate('managers')
            .populate('students')
            .populate('posts')
            .exec(function (err, largeCourses) {
              if (err || !largeCourses) {
                res.send(result);
              }

              var active = 0,
                  activeManagers = [];

              for (var i = 0; i < largeCourses.length; i++) {
                largeCourses[i].managersCount = largeCourses[i].managers.length;
                largeCourses[i].studentsCount = largeCourses[i].students.length;
                largeCourses[i].postsCount = largeCourses[i].posts.length;

                var professors = [];
                for (var j = 0; j < largeCourses[i].managers.length; j++) {
                  professors.push(largeCourses[i].managers[j].toJSON());
                }
                largeCourses[i].professors = professors;

                var isActive = false;
                for (var j = 0; j < largeCourses[i].posts.length; j++) {
                  if (-Moment(largeCourses[i].posts[j].createdAt).diff(Moment(endDate), 'days') < 14) {
                    isActive = true;

                    var add = true;
                    for (var l = 0; l < activeManagers.length; l++) {
                      if (largeCourses[i].managers.length >= 1 && activeManagers[l].id === largeCourses[i].managers[0].id) {
                        add = false;
                      }
                    }

                    if (add) {
                      activeManagers.push(largeCourses[i].managers[0]);
                    }
                  }
                }

                if (isActive) {
                  active++;
                }

                largeCourses[i].active = isActive;
              }

              result.active = active;
              result.activeManagersCount = activeManagers.length;
              result.largeCourses = largeCourses;
              res.send(result);
            });
        }
      });
  },

  emails: function (req, res) {
    var password = req.param('password'),
        page = req.param('page');

    if (password !== 'bttendance') {
      res.contentType('html');
      return res.forbidden('Your password doesn\'t match.');
    }

    if (!page) {
      res.contentType('html');
      return res.forbidden('Page is required.');
    }

    var type = req.param('type'); // Non-student, student, professor, non-professor, all
    if (!type) {
      type = 'all';
    }

    User.find()
      .sort('id DESC')
      .paginate({ page: page, limit: 100 })
      .populate('supervisingCourses')
      .populate('attendingCourses')
      .exec(function (err, users) {
        if (err || !users) {
          res.contentType('html');
          return res.notFound();
        } else {
          res.contentType('application/json; charset=utf-8');

          var emails = [];
          switch (type) {
            case 'all':
              for (var i = 0; i < users.length; i++) {
                emails.push(users[i].toJSON());
              }
              break;
            case 'non-student':
              for (var i = 0; i < users.length; i++) {
                if (users[i].attendingCourses.length === 0) {
                  emails.push(users[i].toJSON());
                }
              }
              break;
            case 'student':
              for (var i = 0; i < users.length; i++) {
                if (users[i].attendingCourses.length > 0) {
                  emails.push(users[i].toJSON());
                }
              }
              break;
            case 'professor':
              for (var i = 0; i < users.length; i++) {
                if (users[i].supervisingCourses.length > 0) {
                  emails.push(users[i].toJSON());
                }
              }
              break;
            case 'non-professor':
              for (var i = 0; i < users.length; i++) {
                if (users[i].supervisingCourses.length === 0) {
                  emails.push(users[i].toJSON());
                }
              }
              break;
          }

          return res.send({ emails: emails });
        }
      });
  }

};
