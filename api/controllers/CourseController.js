'use strict';

/**
 * CourseController
 *
 * @module      :: CourseController
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays'),
    Noti = require('../utils/notifications'),
    Xlsx = require('node-xlsx'),
    Nodemailer = require("nodemailer"),
    moment = require('moment'),
    Url = require('url'),
    QueryString = require('querystring'),
    FS = require('fs'),
    Path = require('path'),
    Random = require('../utils/random');

module.exports = {

  info: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId');

    User.findOneByEmail(email)
      .populate('supervisingCourses')
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Course Info Error", "User doesn't exist."));
        }

        Course.findOneById(courseId)
          .populateAll()
          .sort('id ASC')
          .exec(function (err, course) {
            if (err || !course) {
              return res.send(500, error.log(req, "Course Info Error", "Course doesn't exist."));
            }

            Post.find({ course: courseId })
              .populate('attendance')
              .populate('clicker')
              .populate('notice')
              .populate('curious')
              .sort('id DESC')
              .exec(function (err, posts) {
                if (err || !posts) {
                  course = course.toWholeObject();
                  course.grade = 0;
                  course.attendanceRate = 0;
                  course.clickerRate = 0;
                  course.noticeUnseen = 0;

                  return res.send(course);
                }

                // Attendance
                var attendanceRate = 0; //전체 출석률 or 본인의 출석률
                var attdLast = undefined; //가장 마지막 attendance
                var attdChecks = []; //checkedStudents lateStudents를 모두 합한 Array
                var attdUsage = 0; //attd check을 여태까지 몇번했는지
                var attdCheckedCount = 0; //본인이 attd check이 몇번 되었는지 (강의자의 경우 attd check을 한것으로 인정)

                // Clicker
                var clickerRate = 0; //전체 참여율 or 본인의 참여율
                var clickerLast = undefined; //가장 마지막 clicker
                var clickerChecks = []; //a_students, b_students, c_students, d_students, e_students를 모두 합한 Array
                var clickerUsage = 0; //clicker를 여태까지 몇번 사용 했는지
                var clickerCheckedCount = 0; //본인이 clicker를 몇번 참여했는지 (강의자의 경우 참여 안한 것으로 간주)

                // Notice
                var noticeRate = 0; //전체 공지 리치율 or 본인 공지 읽은 율
                var noticeChecks = []; //seenStudents를 모두 합한 Array
                var noticeUnseen = 0;
                var noticeLastPost = undefined; //가장 마지막 attendance
                var noticeUsage = 0; //notice를 post한 횟수
                var noticeSeenCount = 0; //본인이 notice를 몇개 보았는지 (강의자의 경우 안본 것으로 간주)

                for (var j = 0; j < posts.length; j++) {
                  // Attendance Count
                  var thisPost = posts[j],
                      thisClicker = posts[j].clicker;

                  if (thisPost.type === "attendance") {
                    if (thisPost.attendance.checkedStudents.indexOf(user.id) >= 0) {
                      attdCheckedCount++;
                    }

                    if (!attdLast) {
                      attdLast = thisPost.attendance;
                    }

                    attdChecks = attdChecks.concat(
                      thisPost.attendance.checkedStudents,
                      thisPost.attendance.lateStudents
                    );

                    attdUsage++;
                  }

                  // Clicker Count
                  if (thisPost.type === "clicker") {
                    if (thisPost.clicker.a_students.indexOf(user.id) >= 0) {
                      clickerCheckedCount++;
                    }
                    if (thisPost.clicker.b_students.indexOf(user.id) >= 0) {
                      clickerCheckedCount++;
                    }
                    if (thisPost.clicker.c_students.indexOf(user.id) >= 0) {
                      clickerCheckedCount++;
                    }
                    if (thisPost.clicker.d_students.indexOf(user.id) >= 0) {
                      clickerCheckedCount++;
                    }
                    if (thisPost.clicker.e_students.indexOf(user.id) >= 0) {
                      clickerCheckedCount++;
                    }

                    clickerChecks = clickerChecks.concat(thisClicker.a_students,
                                                           thisClicker.b_students,
                                                           thisClicker.c_students,
                                                           thisClicker.d_students,
                                                           thisClicker.e_students);

                    clickerUsage++;
                  }

                  // Notice Count
                  if (thisPost.type === "notice") {
                    if (thisPost.notice.seenStudents.indexOf(user.id) >= 0) {
                      noticeSeenCount++;
                    }

                    if (!noticeLastPost) {
                      noticeLastPost = thisPost;
                    }

                    noticeChecks = noticeChecks.concat(thisPost.seenStudents);

                    noticeUsage++;
                  }
                }

                if (Arrays.getIds(user.supervisingCourses).indexOf(course.id) >= 0) {
                  attendanceRate = Number((attdChecks.length / attdUsage / course.students.length * 100).toFixed());
                  clickerRate = Number((clickerChecks.length / clickerUsage / course.students.length * 100).toFixed());
                  noticeRate = Number((noticeChecks.length / noticeUsage / course.students.length * 100).toFixed());

                  if (noticeLastPost) {
                    noticeUnseen = course.students.length - noticeLastPost.seenStudents.length;
                  } else {
                    noticeUnseen = course.students.length;
                  }
                } else {
                  attendanceRate = Number((attdCheckedCount / attdUsage * 100).toFixed());
                  clickerRate = Number((clickerCheckedCount / clickerUsage * 100).toFixed());
                  noticeRate = Number((noticeSeenCount / noticeUsage * 100).toFixed());
                  noticeUnseen = noticeUsage - noticeSeenCount;
                }

                // Attendance Rate >= 0 & < 100
                if (attendanceRate < 0 || attdUsage === 0 || isNaN(attendanceRate)) attendanceRate = 0;
                if (attendanceRate > 100) attendanceRate = 100;

                // Attendance Rate >= 0 & < 100
                if (clickerRate < 0 || clickerUsage === 0 || isNaN(clickerRate)) clickerRate = 0;
                if (clickerRate > 100) clickerRate = 100;

                course = course.toWholeObject();
                course.grade = attendanceRate;
                course.attendanceRate = attendanceRate;
                course.clickerRate = clickerRate;
                course.noticeRate = noticeRate;
                course.noticeUnseen = noticeUnseen;
                course.clickerUsage = clickerUsage;
                course.noticeUsage = noticeUsage;
                if (attdLast) {
                  course.attdCheckedAt = attdLast.createdAt;
                }

                return res.send(course);
              });
          });
      });
  },

  createInstant: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        name = req.param('name'),
        schoolId = req.param('schoolId'),
        professorName = req.param('professorName'),
        locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Course Create Error", "User doesn't exist."));
        }

        School.findOneById(schoolId)
          .exec(function (err, school) {
            if (err || !school) {
              return res.send(500, error.log(req, "Course Create Error", "School doesn't exist."));
            }

            var code = Random.string(4);

            Course.create({
                name: name,
                school: schoolId,
                professorName: professorName,
                code: code
              }).exec(function (err, course) {
                if (err || !course) {
                  return res.send(500, error.log(req, "Course Create Error", "Fail to create a course."));
                }

                var employedSchools = Arrays.getIds(user.employedSchools);
                if (employedSchools.indexOf(Number(schoolId)) === -1)
                  user.employedSchools.add(schoolId);

                user.supervisingCourses.add(course.id);
                user.save(function (err) {
                  if (err)
                    return res.send(500, error.log(req, "Course Create Error", "User save error."));

                  User.findOneByEmail(email)
                    .populateAll()
                    .exec(function (err, userNew) {
                      if (err || !userNew)
                        return res.send(500, error.log(req, "Course Create Error", "User doesn't exist."));

                      Course.findOneById(course.id)
                        .populateAll()
                        .exec(function (err, course) {

                          // Create reusable transport method (opens pool of SMTP connections)
                          var smtpTransport = Nodemailer.createTransport({
                            service: "Gmail",
                            auth: {
                              user: "no-reply@bttendance.com",
                              pass: "N0n0r2ply"
                            }
                          });

                          var path, guide;
                          if (locale === 'ko') {
                            path = Path.resolve(__dirname, '../../assets/emails/CreateCourse_KO.html');
                            guide = Path.resolve(__dirname, '../../assets/manual/manual_prof_ko.pdf');
                          } else {
                            path = Path.resolve(__dirname, '../../assets/emails/CreateCourse_EN.html');
                            guide = Path.resolve(__dirname, '../../assets/manual/manual_prof_en.pdf');
                          }

                          FS.readFile(path, 'utf8', function (err, file) {
                            if (err) {
                              return res.send(500, { message: "File Read Error" });
                            }

                            file = file.replace('#name', userNew.name);
                            file = file.replace('#schoolName', course.school.name);
                            file = file.replace('#courseTitle', course.name);
                            file = file.replace('#classCode', course.code);
                            file = file.replace('#profName', course.professorName);

                            // Setup e-mail data with unicode symbols
                            var mailOptions = {
                              from: "Bttendance<no-reply@bttendance.com>", // Sender address
                              to: user.email, // List of receivers
                              subject: sails.__({ phrase: "Course %s Creation Finished", locale: locale }, course.name), // Subject line
                              html: file, // Plaintext body
                              attachments: [{   // File on disk as an attachment
                                filename: sails.__({ phrase: "Bttendance Manual (for Prof).pdf", locale: locale }),
                                path: guide // Stream this file
                              }]
                            };

                            // Send mail with defined transport object
                            smtpTransport.sendMail(mailOptions, function (error, info) {
                              // TODO: Handle error
                            });

                            return res.send(userNew.toWholeObject());
                          });
                        });
                    });
                });
              });
          });
      });
  },

  search: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseCode = req.param('courseCode').toLowerCase(),
        courseId = req.param('courseId');

    Course.findOne({ or: [{ id: courseId }, { code: courseCode }] })
      .populateAll()
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.alert(req, "Course Find Error", "Course doesn't exist."));
        }

        return res.send(course.toWholeObject());
      });
  },

  attend: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId'),
        locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    Course.findOneById(courseId)
      .populateAll()
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.log(req, "Course Attend Error", "Course doesn't exist."));
        }

        if (!course.opened) {
          return res.send(500, error.alert(req, "Course Attend Error", "Current course is closed."));
        }

        User.findOneByEmail(email)
          .populateAll()
          .exec(function (err, user) {
            if (err || !user) {
              return res.send(500, error.log(req, "Course Attend Error", "User doesn't exist."));
            }

            var supervisingCourses = Arrays.getIds(user.supervisingCourses);
            if (supervisingCourses.indexOf(Number(courseId)) !== -1) {
              return res.send(500, error.alert(req, "Course Attend Error", "You are already supervising current course."));
            }

            var attendingCourses = Arrays.getIds(user.attendingCourses);
            if (attendingCourses.indexOf(Number(courseId)) !== -1) {
              return res.send(500, error.alert(req, "Course Attend Error", "You are already attending current course."));
            }

            user.attendingCourses.add(courseId);
            user.save(function (err) {
              if (err) {
                return res.send(500, error.log(req, "Course Attend Error", "Fail to save user."));
              }

              User.findOneByEmail(email)
                .populateAll()
                .exec(function (err, userNew) {
                  if (err || !userNew) {
                    return res.send(500, error.log(req, "Course Attend Error", "User doesn't exist."));
                  }

                  // Create reusable transport method (opens pool of SMTP connections)
                  var smtpTransport = Nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                      user: "no-reply@bttendance.com",
                      pass: "N0n0r2ply"
                    }
                  });

                  var path, guide;
                  if (locale === 'ko') {
                    path = Path.resolve(__dirname, '../../assets/emails/AttendCourse_KO.html');
                    guide = Path.resolve(__dirname, '../../assets/manual/manual_std_ko.pdf');
                  } else {
                    path = Path.resolve(__dirname, '../../assets/emails/AttendCourse_EN.html');
                    guide = Path.resolve(__dirname, '../../assets/manual/manual_std_en.pdf');
                  }

                  FS.readFile(path, 'utf8', function (err, file) {
                    if (err) {
                      return res.send(500, { message: "File Read Error" });
                    }

                    var studentID = '';
                    for (var i = 0; i < user.identifications.length; i++) {
                      if (user.identifications[i].school === course.school.id) {
                        studentID = user.identifications[i].identity;
                      }
                    }

                    file = file.replace('#name', userNew.name);
                    file = file.replace('#courseTitle', course.name);
                    file = file.replace('#classCode', course.code);
                    file = file.replace('#profName', course.professorName);
                    file = file.replace('#schoolName', course.school.name);
                    file = file.replace('#studentID', studentID);

                    // Setup e-mail data with unicode symbols
                    var mailOptions = {
                      from: "Bttendance<no-reply@bttendance.com>", // Sender address
                      to: user.email, // List of receivers
                      subject: sails.__({ phrase: "You are successfully registered in course %s!", locale: locale }, course.name), // Subject line
                      html: file, // Plaintext body
                      attachments: [{   // File on disk as an attachment
                        filename: sails.__({ phrase: "Bttendance Manual (for Std).pdf", locale: locale }),
                        path: guide // Stream this file
                      }]
                    };

                    // Send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function (error, info) {
                      // TODO: Handle error
                    });

                    return res.send(userNew.toWholeObject());
                  });
                });
            });
          });
      });
  },

  dettend: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId');

    Course.findOneById(courseId).exec(function (err, course) {
      if (err || !course) {
        return res.send(500, error.log(req, "Course Unjoin Error", "Course doesn't exist."));
      }

      if (!course.opened) {
        return res.send(500, error.alert(req, "Course Unjoin Error", "Current course is closed."));
      }

      User.findOneByEmail(email)
        .populateAll()
        .exec(function (err, user) {
          if (err || !user) {
            return res.send(500, error.log(req, "Course Unjoin Error", "User doesn't exist."));
          }

          var supervisingCourses = Arrays.getIds(user.supervisingCourses);
          if (supervisingCourses.indexOf(Number(courseId)) !== -1) {
            return res.send(500, error.log(req, "Course Unjoin Error", "User is supervising this course."));
          }

          var attendingCourses = Arrays.getIds(user.attendingCourses);
          if (attendingCourses.indexOf(Number(courseId)) === -1) {
            return res.send(500, error.log(req, "Course Unjoin Error", "User is not attending this course"));
          }

          user.attendingCourses.remove(courseId);
          user.save(function (err) {
            if (err) {
              return res.send(500, error.log(req, "Course Unjoin Error", "Fail to save user."));
            }

            User.findOneByEamil(email)
              .populateAll()
              .exec(function (err, userNew) {
                if (err || !userNew) {
                  return res.send(500, error.log(req, "Course Unjoin Error", "User doesn't exist."));
                }

                return res.send(userNew.toWholeObject());
              });
          });
        });
    });
  },

  feed: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId'),
        page = req.param('page');

    User.findOneByEmail(email)
      .populate('supervisingCourses')
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Course Feed Error", "User doesn't exist."));
        }

        var supervisingCourses = Arrays.getIds(user.supervisingCourses);

        Course.findOneById(courseId)
          .populate('students')
          .populate('managers')
          .exec(function (err, course) {
            if (err || !course) {
              return res.send(500, error.log(req, "Course Feed Error", "Course doesn't exist."));
            }

            Post.find({ course: courseId })
              .populate('attendance')
              .populate('clicker')
              .populate('notice')
              .populate('curious')
              .sort('id DESC').exec(function (err, posts) {
                if (err || !posts) {
                  return res.send(500, error.log(req, "Course Feed Error", "Post doesn't exist."));
                }

                for (var i = 0; i < posts.length; i++) {
                  var thisPost = posts[i],
                      message;

                  if (thisPost.type === 'attendance') {
                    var locale = user.locale;
                    if (!locale || locale !== 'ko') {
                      locale = 'en';
                    }

                    if (supervisingCourses.indexOf(thisPost.course.id) >= 0) {
                      message = (thisPost.attendance.checkedStudents.length + thisPost.attendance.lateStudents.length) + "/" + course.students.length + " (" + grade + "%) " + sails.__({ phrase: "students has been attended.", locale: locale });
                    } else {
                      if (thisPost.attendance.checkedStudents.indexOf(user.id) >= 0) {
                        message = sails.__({ phrase: "Attendance Checked", locale: locale })
                      } else if (thisPost.attendance.lateStudents.indexOf(user.id) >= 0) {
                        message = sails.__({ phrase: "Attendance Late", locale: locale })
                      } else if (moment().diff(moment(thisPost.createdAt)) < 60 * 1000 && thisPost.attendance.type === 'auto') {
                         message = sails.__({ phrase: "Attendance Checking", locale: locale })
                      } else {
                         message = sails.__({ phrase: "Attendance Failed", locale: locale })
                       }
                    }
                  }

                  thisPost = thisPost.toWholeObject();
                  thisPost.course = course.toJSON();
                  if (thisPost.type === 'attendance') {
                    thisPost.message = message;
                  }
                }

                var authors = [];
                for (var i = posts.length - 1; i >= 0; i--) {
                  if (authors.indexOf(thisPost.author) < 0) {
                    authors.push(thisPost.author);
                  }
                }

                User.findById(authors)
                  .exec(function (err, users) {
                    if (err || !user) {
                      return res.send(posts);
                    }

                    for (var i = posts.length - 1; i >= 0; i--) {
                      for (var j = users.length - 1; j >= 0; j--) {
                        if (thisPost.author === users[j].id) {
                          thisPost.author = users[j].toJSON();
                        }
                      }

                      if (!thisPost.author || !thisPost.author.id) {
                        var tempUser = {
                          username: '',
                          email: '',
                          name: '',
                          id: 0
                        }
                        thisPost.author = tempUser;
                      }
                    }

                    return res.send(posts);
                  });
              });
          });
      });
  },

  open: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId');

    Course.update({ id : courseId }, { opened : true })
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.alert(req, "Course Open Error", "Course update error."));
        }

        User.findOneByEmail(email)
          .populateAll()
          .exec(function (err, user) {
            if (err || !user) {
              return res.send(500, error.log(req, "Course Open Error", "Fail to find user."));
            }

            return res.send(user.toWholeObject());
          });
      });
  },

  close: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId');

    Course.update({ id : courseId }, { opened : false })
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.alert(req, "Course Open Error", "Course update error."));
        }

        User.findOneByEmail(email)
          .populateAll()
          .exec(function (err, user) {
            if (err || !user) {
              return res.send(500, error.log(req, "Course Open Error", "Fail to find user."));
            }

            return res.send(user.toWholeObject());
          });
      });
  },

  students: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId');

    Course.findOneById(courseId)
      .populateAll()
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.log(req, "Course Students Error", "Course doesn't exist."));
        }

        User.findById(Arrays.getIds(course.students))
          .populateAll()
          .exec(function (err, users) {
            if (err || !users) {
              return res.send(500, error.log(req, "Course Students Error", "User doesn't exist."));
            }

            for (var index in users) {
              users[index].studentId = "";
              for (var i = 0; i < users[index].identifications.length; i++) {
                if (users[index].identifications[i].school === course.school.id) {
                  users[index].studentId = users[index].identifications[i].identity;
                }
              }
              users[index].courseId = courseId;
            }

            users.sort(function (a, b) {
              if (!a.studentId) {
                return true;
              }
              if (!b.studentId) {
                return false;
              }

              return a.studentId.localeCompare(b.studentId);
            });

            return res.send(users);
          });
      });
  },

  addManager: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId'),
        email = req.param('email'),
        manager = req.param('manager');

    Course.findOneById(courseId)
      .populateAll()
      .exec(function (err, course) {
        if (err || !course)
          return res.send(500, error.alert(req, "Adding Manager Error", "Course doesn't exist."));

        if (!course.opened)
            return res.send(500, error.alert(req, "Adding Manager Error", "Current course is closed."));

        if (Arrays.getEmails(course.managers).indexOf(email) === -1)
          return res.send(500, error.alert(req, "Adding Manager Error", "You are not supervising current course."));

        if (Arrays.getEmails(course.students).indexOf(manager) >= 0)
          return res.send(500, error.alert(req, "Adding Manager Error", "User is already attending current course."));

        User.findOneByEmail(email)
          .populateAll()
          .exec(function (err, mang) {
            if (err || !mang) {
              return res.send(500, error.alert(req, "Adding Manager Error", "Fail to add a user %s as a manager.\nPlease check User ID of Email again.", manager));
            }

            if (Arrays.getEmails(course.managers).indexOf(manager) >= 0) {
              return res.send(500, error.alert(req, "Adding Manager Error", "%s is already supervising current course.", mang.name));
            }

            var employedSchools = Arrays.getIds(mang.employedSchools);
            if (employedSchools.indexOf(Number(course.school.id)) === -1) {
              mang.employedSchools.add(course.school.id);
            }

            mang.supervisingCourses.add(course.id);

            mang.save(function (err) {
              console.log(err);
              if (err) {
                return res.send(500, error.alert(req, "Adding Manager Error", "Oh uh, fail to save %s as a manager.\nPlease try again.", mang.name));
              }

              Noti.send(mang, course.name, "You have been added as a manager.", "added_as_manager", course.id);

              Course.findOneById(courseId)
                .populateAll()
                .exec(function (err, course) {
                  if (err || !course) {
                    return res.send(500, error.alert(req, "Adding Manager Error", "Course doesn't exist."));
                  }

                  return res.send(course.toWholeObject());
                });
            });
          });
      });
  },

  attendanceRecord: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId');

    Course.findOneById(courseId)
      .populateAll()
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.log(req, "Attendance Grades Error", "Course doesn't exist."));
        }

        User.findById(Arrays.getIds(course.students))
          .populateAll()
          .sort('name DESC')
          .exec(function (err, users) {
            if (err || !users) {
              return res.send(500, error.alert(req, "Attendance Grades Error", "Current course has no student."));
            }

            Post.findById(Arrays.getIds(course.posts))
              .populateAll()
              .sort('id DESC')
              .exec(function (err, posts) {
                if (err || !posts) {
                  return res.send(500, error.alert(req, "Attendance Grades Error", "Fail to load posts."));
                }

                var postsObject = [];
                for (var index in posts) {
                  if (posts[index].type === "attendance") {
                    postsObject.push(posts[index]);
                  }
                }

                var totalGrade = postsObject.length;
                if (totalGrade <= 0) {
                  return res.send(500, error.alert(req, "Attendance Grades Error", "Current course has no attendance records."));
                }

                for (var index in users) {
                  var grade = 0;
                  for (var i = 0; i < postsObject.length; i++) {
                    for (var j = 0; j < postsObject[i].attendance.checkedStudents.length; j++) {
                      if (postsObject[i].attendance.checkedStudents[j] === users[index].id) {
                        grade++;
                      }
                    }
                  }

                  users[index].grade = grade + "/" + totalGrade;
                  users[index].studentId = "";

                  for (var i = 0; i < users[index].identifications.length; i++) {
                    if (users[index].identifications[i].school === course.school.id) {
                      users[index].studentId = users[index].identifications[i].identity;
                    }
                  }

                  users[index].courseId = courseId;
                }

                users.sort(function (a, b) {
                  if (!a.studentId) {
                    return true;
                  }
                  if (!b.studentId) {
                    return false;
                  }

                  return a.studentId.localeCompare(b.studentId);
                });

                return res.send(users);
              });
          });
      });
  },

  clickerRecord: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId');

    Course.findOneById(courseId)
      .populate('students')
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.log(req, "Clicker Grades Error", "Course doesn't exist."));
        }

        User.findById(Arrays.getIds(course.students))
          .populate('identifications')
          .sort('name DESC')
          .exec(function (err, users) {
            if (err || !users) {
              return res.send(500, error.alert(req, "Clicker Grades Error", "Current course has no student."));
            }

            Post.find({ course: courseId, type: 'clicker' })
              .populate('clicker')
              .sort('id DESC')
              .exec(function (err, posts) {
                if (err || !posts) {
                  return res.send(500, error.alert(req, "Clicker Grades Error", "Fail to load posts."));
                }

                var totalGrade = posts.length;
                if (totalGrade === 0) {
                  return res.send(500, error.alert(req, "Clicker Grades Error", "Current course has no clicker records."));
                }

                for (var index in users) {
                  var grade = 0;
                  for (var i = 0; i < posts.length; i++) {
                    for (var j = 0; j < posts[i].clicker.a_students.length; j++) {
                      if (posts[i].clicker.a_students[j] === users[index].id) {
                        grade++;
                      }
                    }
                    for (var j = 0; j < posts[i].clicker.b_students.length; j++) {
                      if (posts[i].clicker.b_students[j] === users[index].id) {
                        grade++;
                      }
                    }
                    for (var j = 0; j < posts[i].clicker.c_students.length; j++) {
                      if (posts[i].clicker.c_students[j] === users[index].id) {
                        grade++;
                      }
                    }
                    for (var j = 0; j < posts[i].clicker.d_students.length; j++) {
                      if (posts[i].clicker.d_students[j] === users[index].id) {
                        grade++;
                      }
                    }
                    for (var j = 0; j < posts[i].clicker.e_students.length; j++) {
                      if (posts[i].clicker.e_students[j] === users[index].id) {
                        grade++;
                      }
                    }
                  }

                  users[index].grade = grade + "/" + totalGrade;
                  users[index].studentId = "";
                  for (var i = 0; i < users[index].identifications.length; i++) {
                    if (users[index].identifications[i].school === course.school) {
                      users[index].studentId = users[index].identifications[i].identity;
                    }
                  }

                  users[index].courseId = courseId;
                }

                users.sort(function (a, b) {
                  if (!a.studentId) {
                    return true;
                  }
                  if (!b.studentId) {
                    return false;
                  }

                  return a.studentId.localeCompare(b.studentId);
                });

                return res.send(users);
              });
          });
      });
  },

  exportRecord: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId'),
        locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    Course.findOneById(courseId)
      .populateAll()
      .exec(function (err, course) {
        if (err || !course) {
          return res.send(500, error.alert(req, "Export Grades Error", "Fail to find current course."));
        }

        User.findById(Arrays.getIds(course.students))
          .populateAll()
          .sort('name DESC')
          .exec(function (err, users) {
            if (err || !users) {
              return res.send(500, error.alert(req, "Export Grades Error", "Current course has no student."));
            }

            Post.findById(Arrays.getIds(course.posts))
              .populateAll()
              .sort('id DESC')
              .exec(function (err, posts) {
                if (err || !posts) {
                  return res.send(500, error.alert(req, "Export Grades Error", "Current course has no post."));
                }

                var data_clicker = [];
                {
                  var postsObject = [];
                  for (var index in posts)
                    if (posts[index].type === "clicker")
                      postsObject.push(posts[index]);

                  // Empty, empty, empty, message#1, message#2, ... , message#n
                  var message = [];
                  message.push(sails.__({ phrase: "Clicker Message", locale: locale }), "", ""); // Empty
                  for (var i = 0; i < postsObject.length; i++) {
                    message.push(postsObject[i].message);
                  }
                  data_clicker.push(message);

                  // Empty, empty, empty, choiceCount#1, choiceCount#2, ... , choiceCount#n
                  var choiceCount = [];
                  choiceCount.push(sails.__({ phrase: "Choice Count", locale: locale }), "", ""); // Empty
                  for (var i = 0; i < postsObject.length; i++) {
                    choiceCount.push(sails.__({ phrase: "%s Choice", locale: locale }, postsObject[i].clicker.choiceCount));
                  }
                  data_clicker.push(choiceCount);

                  // Student Name, Student Identity, empty, date#1, date#2, ... , date#n
                  var headline = [];
                  headline.push(sails.__({ phrase: "Student Name", locale: locale }),
                                sails.__({ phrase: "Student Identity", locale: locale }), ""); // Empty

                  for (var i = 0; i < postsObject.length; i++) {
                    headline.push(moment(postsObject[i].createdAt).format("YYYY-MM-DD hh:mm"));
                  }
                  data_clicker.push(headline);

                  var grades = [];
                  for (var index in users) {
                    var gradeObject = [];
                    gradeObject.push(users[index].name); // Student Name
                    for (var i = 0; i < users[index].identifications.length; i++) {
                      if (users[index].identifications[i].school === course.school.id
                        && users[index].identifications[i].identity
                        && users[index].identifications[i].identity !== null) {
                          gradeObject.push(users[index].identifications[i].identity.trim()); // Student ID
                      }
                    }

                    if (gradeObject.length < 2) {
                      gradeObject.push("Student has no ID");
                    }

                    gradeObject.push(""); // Empty

                    for (var i = 0; i < postsObject.length; i++) {
                      var choice = 0;

                      for (var j = 0; j < postsObject[i].clicker.a_students.length; j++) {
                        if (postsObject[i].clicker.a_students[j] === users[index].id) {
                          choice = 1;
                        }
                      }

                      for (var j = 0; j < postsObject[i].clicker.b_students.length; j++) {
                        if (postsObject[i].clicker.b_students[j] === users[index].id) {
                          choice = 2;
                        }
                      }

                      for (var j = 0; j < postsObject[i].clicker.c_students.length; j++) {
                        if (postsObject[i].clicker.c_students[j] === users[index].id) {
                          choice = 3;
                        }
                      }

                      for (var j = 0; j < postsObject[i].clicker.d_students.length; j++) {
                        if (postsObject[i].clicker.d_students[j] === users[index].id) {
                          choice = 4;
                        }
                      }

                      for (var j = 0; j < postsObject[i].clicker.e_students.length; j++) {
                        if (postsObject[i].clicker.e_students[j] === users[index].id) {
                          choice = 5;
                        }
                      }

                      if (choice === 0) {
                        gradeObject.push(sails.__({ phrase: "Didn't Participated", locale: locale }));
                      } else if (choice === 1) {
                        gradeObject.push("A");
                      } else if (choice === 2) {
                        gradeObject.push("B");
                      } else if (choice === 3) {
                        gradeObject.push("C");
                      } else if (choice === 4) {
                        gradeObject.push("D");
                      } else {
                        gradeObject.push("E");
                      }
                    }

                    grades.push(gradeObject);
                  }

                  grades.sort(function (a, b) {
                    if (!a[1]) {
                      return true;
                    }
                    if (!b[1]) {
                      return false;
                    }

                    return a[1].localeCompare(b[1]);
                  });

                  data_clicker = data_clicker.concat(grades);
                }

                var data_attendance = [];
                {
                  var postsObject = [];
                  for (var index in posts)
                    if (posts[index].type === "attendance")
                      postsObject.push(posts[index]);

                  // Empty, empty, empty, type#1, type#2, ... , type#n
                  var info = [];
                  info.push(sails.__({ phrase: "Attendance Type", locale: locale }), "", ""); // Empty
                  for (var i = 0; i < postsObject.length; i++) {
                    if (postsObject[i].attendance.type === "auto") {
                      info.push(sails.__({ phrase: "Auto Check", locale: locale }));
                    } else {
                      info.push(sails.__({ phrase: "Manual Check", locale: locale }));
                    }
                  }
                  data_attendance.push(info);

                  // Student Name, Student Identity, empty, date#1, date#2, ... , date#n, empty, Present, Tardy, Absent
                  var headline = [];
                  headline.push(sails.__({ phrase: "Student Name", locale: locale }),
                                sails.__({ phrase: "Student Identity", locale: locale }), "");
                  for (var i = 0; i < postsObject.length; i++) {
                    headline.push(moment(postsObject[i].createdAt).format("YYYY-MM-DD hh:mm"));
                  }

                  headline.push("",
                                sails.__({ phrase: "Present", locale: locale }),
                                sails.__({ phrase: "Tardy", locale: locale }),
                                sails.__({ phrase: "Absent", locale: locale }));
                  data_attendance.push(headline);

                  var grades = [];
                  for (var index in users) {
                    var gradeObject = [];
                    gradeObject.push(users[index].name); // Student Name
                    for (var i = 0; i < users[index].identifications.length; i++) {
                      if (users[index].identifications[i].school === course.school.id
                        && users[index].identifications[i].identity
                        && users[index].identifications[i].identity !== null) {
                        gradeObject.push(users[index].identifications[i].identity.trim()); // Student ID
                      }
                    }

                    if (gradeObject.length < 2) {
                      gradeObject.push("Student has no ID");
                    }

                    gradeObject.push(""); // Empty

                    var present = tardy = absent = 0;
                    for (var i = 0; i < postsObject.length; i++) {
                      var check = 0;

                      for (var j = 0; j < postsObject[i].attendance.checkedStudents.length; j++) {
                        if (postsObject[i].attendance.checkedStudents[j] === users[index].id) {
                          present++;
                          check = 1;
                        }
                      }

                      for (var j = 0; j < postsObject[i].attendance.lateStudents.length; j++) {
                        if (postsObject[i].attendance.lateStudents[j] === users[index].id) {
                          tardy++;
                          check = 2;
                        }
                      }

                      if (check === 0) {
                        gradeObject.push(sails.__({ phrase: "Absent", locale: locale }));
                        absent++;
                      } else if (check === 1) {
                        gradeObject.push(sails.__({ phrase: "Present", locale: locale }));
                      } else {
                        gradeObject.push(sails.__({ phrase: "Tardy", locale: locale }));
                      }
                    }

                    gradeObject.push("", tardy, absent, gradeObject);
                  }

                  grades.sort(function (a, b) {
                    if (!a[1]) {
                      return true;
                    }
                    if (!b[1]) {
                      return false;
                    }

                    return a[1].localeCompare(b[1]);
                  });

                  data_attendance = data_attendance.concat(grades);
                }

                var data_notice = [];
                {
                  var postsObject = [];
                  for (var index in posts) {
                    if (posts[index].type === "notice") {
                      postsObject.push(posts[index]);
                    }
                  }

                  // Empty, empty, empty, type#1, type#2, ... , type#n
                  var info = [];
                  info.push(sails.__({ phrase: "Notice Message", locale: locale }), "", "");
                  for (var i = 0; i < postsObject.length; i++) {
                    info.push(postsObject[i].message);
                  }
                  data_notice.push(info);

                  // Student Name, Student Identity, empty, date#1, date#2, ... , date#n, empty, Read, Unread
                  var headline = [];
                  headline.push(sails.__({ phrase: "Student Name", locale: locale }),
                                sails.__({ phrase: "Student Identity", locale: locale }), "");
                  for (var i = 0; i < postsObject.length; i++) {
                    headline.push(moment(postsObject[i].createdAt).format("YYYY-MM-DD hh:mm"));
                  }

                  headline.push("",
                                sails.__({ phrase: "Read", locale: locale }),
                                sails.__({ phrase: "Unread", locale: locale }));
                  data_notice.push(headline);

                  var grades = [];
                  for (var index in users) {
                    var gradeObject = [];
                    gradeObject.push(users[index].name); // Student Name
                    for (var i = 0; i < users[index].identifications.length; i++) {
                      if (users[index].identifications[i].school === course.school.id
                        && users[index].identifications[i].identity
                        && users[index].identifications[i].identity !== null) {
                        gradeObject.push(users[index].identifications[i].identity.trim()); // Student Id
                      }
                    }

                    if (gradeObject.length < 2) {
                      gradeObject.push("Student has no ID");
                    }
                    gradeObject.push(""); // Empty

                    var read = unread = 0;
                    for (var i = 0; i < postsObject.length; i++) {
                      var seen = false;
                      for (var j = 0; j < postsObject[i].notice.seenStudents.length; j++) {
                        if (postsObject[i].notice.seenStudents[j] === users[index].id) {
                          seen = true;
                        }
                      }

                      if (seen) {
                        gradeObject.push(sails.__({ phrase: "Read", locale: locale }));
                        read++;
                      } else {
                        gradeObject.push(sails.__({ phrase: "Unread", locale: locale }));
                        unread++;
                      }
                    }

                    gradeObject.push("", read, unread);
                    grades.push(gradeObject);
                  }

                  grades.sort(function (a, b) {
                    if (!a[1]) {
                      return true;
                    }
                    if (!b[1]) {
                      return false;
                    }

                    return a[1].localeCompare(b[1]);
                  });

                  data_notice = data_notice.concat(grades);
                }

                var buffer = Xlsx.build({
                  worksheets: [
                    {
                      "": sails.__({ phrase: "Clicker", locale: locale }),
                      "data": data_clicker
                    },
                    {
                      "": sails.__({ phrase: "Attendance", locale: locale }),
                      "data": data_attendance
                    },
                    {
                      "": sails.__({ phrase: "Notice", locale: locale }),
                      "data": data_notice
                    }
                  ]
                });

                User.findOneByEmail(email)
                  .exec(function (err, user) {
                    if (err || !user) {
                      return res.send(500, error.alert(req, "Export Grades Error", "Fail to find user."));
                    }

                    // create reusable transport method (opens pool of SMTP connections)
                    var smtpTransport = Nodemailer.createTransport({
                      service: "Gmail",
                      auth: {
                        user: "no-reply@bttendance.com",
                        pass: "N0n0r2ply"
                      }
                    });

                    var path;
                    if (locale === 'ko') {
                      path = Path.resolve(__dirname, '../../assets/emails/ExportGrades_KO.html');
                    } else {
                      path = Path.resolve(__dirname, '../../assets/emails/ExportGrades_EN.html');
                    }

                    FS.readFile(path, 'utf8', function (err, file) {
                      if (err) {
                        return res.send(500, error.alert(req, "Export Grades Error", "Fail to read email format file."));
                      }

                      var today = new Date(),
                          dd = today.getDate(),
                          mm = today.getMonth() + 1, // January is 0!
                          yyyy = today.getFullYear();

                      if (dd < 10) {
                        dd = '0' + dd;
                      }

                      if (mm < 10) {
                        mm = '0' + mm;
                      }

                      var todayDate = yyyy + '/' + mm + '/' + dd,
                          todayDate_ = yyyy + '_' + mm + '_' + dd;

                      file = file.replace('#name', user.name);
                      file = file.replace('#firstdate', moment(course.createdAt).format("YYYY/MM/DD"));
                      file = file.replace('#lastdate', todayDate);

                      var file = course.name + " Records " + todayDate_ + ".xlsx";

                      // Setup e-mail data with unicode symbols
                      var mailOptions = {
                        from: "Bttendance<no-reply@bttendance.com>", // Sender address
                        to: 'user.email', // List of receivers
                        subject: sails.__({ phrase: "Grade of %s", locale: locale }, course.name), // Subject line
                        html: file,
                        attachments: [{
                            filefile: file,
                            content: buffer
                        }]
                      };

                      // send mail with defined transport object
                      smtpTransport.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          return res.send(500, error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
                        }

                        return res.send({ email: user.email });
                      });
                    });
                  });
              });
          });
      });
  },

  update_begin_date: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId'),
        beginDate = req.param('beginDate');

    Course.findOneById(courseId)
      .populateAll()
      .exec(function (err, course) {
        // TODO: Handle error
      });
  }

};
