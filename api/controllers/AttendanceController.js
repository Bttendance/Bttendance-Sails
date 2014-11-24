'use strict';

/**
 * AttendanceController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Noti = require('../utils/notifications'),
    error = require('../utils/errors'),
    Arrays = require('../utils/arrays'),
    moment = require('moment');

module.exports = {

  fromCourses: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseIds = req.param('courseIds');

    Course.findById(courseIds)
      .populate('posts')
      .exec(function (err, courses) {
        if (err || !courses) {
          return res.send([]);
        }

        var postsWithAttendances = [],
            now = moment();

        for (var i = 0; i < courses.length; i++) {
          for (var j = 0; j < courses[i].posts.length; j++) {
            var createdAt = moment(courses[i].posts[j].createdAt),
                diff = now.diff(createdAt);

            if (diff < 65 * 1000 && courses[i].posts[j].type === 'attendance') {
              postsWithAttendances.push(courses[i].posts[j].id);
            }
          }
        }

        Post.findById(postsWithAttendances)
          .populate('attendance')
          .exec(function (err, posts) {
            if (err || !posts) {
              return res.send([]);
            }

            var autoAttds = [];
            for (var i = 0; i < posts.length; i++) {
              if (posts[i].attendance.type === 'auto') {
                autoAttds.push(posts[i].attendance.id);
              }
            }

            return res.send(autoAttds);
          });
      });
  },

  foundDevice: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        attendanceId = req.param('attendanceId'),
        uuid = req.param('uuid');

    Device.findOneByUuid(uuid)
      .exec(function (err, device) {
        if (err || !device) {
          return res.send(500, error.log(req, 'Bttendance Error', 'Wrong device.'));
        }

        User.findOneById(device.owner)
          .populate('supervisingCourses')
          .populate('attendingCourses')
          .exec(function (err, userUuid) {
            if (err || !userUuid) {
              return res.send(500, error.log(req, 'Bttendance Error', 'Fail to find user.'));
            }

            User.findOneByEmail(email)
              .populate('supervisingCourses')
              .populate('attendingCourses')
              .exec(function (err, userApi) {
                if (err || !userApi) {
                  return res.send(500, error.log(req, 'Bttendance Error', 'Fail to find user.'));
                }

                if (userUuid.id === userApi.id) {
                  return res.send(400, error.log(req, 'Bttendance Error', 'User has found his own device somehow.'));
                }

                Attendance.findOneById(attendanceId)
                  .populate('post')
                  .exec(function (err, attendance) {
                    if (err || !attendance) {
                      return res.send(500, error.log(req, 'Bttendance Error', 'Attendance record doesn\'t exist.'));
                    }

                    // Attendance Type Auto
                    if (attendance.type !== 'auto') {
                      return res.send(204, error.log(req, 'Bttendance Error', 'Attendance type is not auto.'));
                    }

                    // Check whether users are in same courses(post)
                    if ((Arrays.getIds(userApi.supervisingCourses).indexOf(attendance.post.course) === -1
                      && Arrays.getIds(userApi.attendingCourses).indexOf(attendance.post.course) === -1)
                      || (Arrays.getIds(userUuid.supervisingCourses).indexOf(attendance.post.course) === -1
                      && Arrays.getIds(userUuid.attendingCourses).indexOf(attendance.post.course) === -1)) {
                      return res.send(204, error.log(req, 'Bttendance Error', 'User is not attending of supervising current course.'));
                    }

                    if (Arrays.getIds(userApi.supervisingCourses).indexOf(attendance.post.course) !== -1
                      && userApi.id !== attendance.post.author) {
                      return res.send(204, error.log(req, 'Bttendance Error', 'Manager around who is not author.'));
                    }

                    if (Arrays.getIds(userUuid.supervisingCourses).indexOf(attendance.post.course) !== -1
                      && userUuid.id !== attendance.post.author) {
                      return res.send(204, error.log(req, 'Bttendance Error', 'Manager around who is not author.'));
                    }

                    // Re Clustering - userApi : A, userUuid : B
                    //          Find Cluster Number which User A, B included (say it's a,b)
                    // Case 1 : None included => Make new cluster and add
                    // Case 2 : One included => Add other to the cluster
                    // Case 3 : Both included Same => Do nothing
                    // Case 4 : Both included Diff => Merge two cluster
                    var userIds = [userApi.id, userUuid.id],
                        clusters = [];

                    {
                      for (var i = 0; i < attendance.clusters.length; i++) {
                        clusters.push(attendance.clusters[i]);
                      }

                      // Find Cluster Number a, b
                      var a = b = -1;
                      for (var i = 0; i < clusters.length; i++) {
                        for (var j = 0; j < clusters[i].length; j++) {
                          if (clusters[i][j] === userApi.id) {
                            a = i;
                          }

                          if (clusters[i][j] === userUuid.id) {
                            b = i;
                          }
                        }
                      }

                      // Case 3
                      if (a === b && a !== -1) {
                        return res.send(202, error.log(req, 'Bttendance Error', 'User are already accepted.'));
                      }

                      // Case 1
                      else if (a === b && a === -1) {
                        clusters.push(userIds);
                      }

                      // Case 2
                      else if (a !== -1 && b === -1) {
                        clusters[a].push(userUuid.id);
                      }

                      // Case 2
                      else if (a === -1 && b !== -1) {
                        clusters[b].push(userApi.id);
                      }

                      // Case 4
                      else {
                        var newCluser = [];
                        for (var i = 0; i < clusters.length; i++) {
                          if (i !== a && i !== b) {
                            newCluser.push(clusters[i]);
                          }
                        }

                        var mergedArray = clusters[a].concat(clusters[b]);
                        newCluser.push(mergedArray);

                        clusters = newCluser;
                      }
                    }

                    // Found if any cluster has more than 3 users
                    {
                      var a = b = -1;
                      for (var i = 0; i < clusters.length; i++) {
                        for (var j = 0; j < clusters[i].length; j++) {
                          if (clusters[i][j] === attendance.post.author) {
                            b = i;
                          }
                        }
                      }

                      for (var i = 0; i < clusters.length; i++) {
                        if (i !== b && clusters[i].length >= 2) {
                          a = i;
                        }
                      }

                      if (a !== -1) {
                        var newCluser = [];
                        for (var i = 0; i < clusters.length; i++) {
                          if (i !== a && i !== b) {
                            newCluser.push(clusters[i]);
                          }
                        }

                        var mergedArray = clusters[a].concat(clusters[b]);
                        newCluser.push(mergedArray);

                        clusters = newCluser;
                      }
                    }

                    // Send Notification
                    {
                      var checks = [];
                      for (var i = 0; i < attendance.checkedStudents.length; i++) {
                        checks.push(attendance.checkedStudents[i]);
                      }
                      checks.push(attendance.post.author);

                      for (var i = 0; i < clusters.length; i++) {

                        var hasAuthor = false;
                        for (var j = 0; j < clusters[i].length; j++) {
                          if (clusters[i][j] === attendance.post.author) {
                            hasAuthor = true;
                            break;
                          }
                        }

                        if (hasAuthor) {
                          var notiable = [];
                          for (var j = 0; j < clusters[i].length; j++) {
                            notiable.push(clusters[i][j]);
                          }

                          sails.log.error(notiable);

                          for (var m = 0; m < notiable.length; m++) {

                            var noti = true;
                            for (var k = 0; k < checks.length; k++) {
                              if (notiable[m] === checks[k]) {
                                noti = false;
                              }
                            }

                            if (noti) {
                              User.findOneById(notiable[m])
                                .populate('device')
                                .populate('setting')
                                .exec(function (err, user) {
                                  if (user && user.setting && user.setting.attendance) {
                                    Course.findOneById(attendance.post.course)
                                      .exec(function (err, course) {
                                        if (course) {
                                          Noti.send(user, course.name, 'Attendance has been checked', 'attendance_checked', course.id);
                                        }
                                      })
                                  }
                                });
                            }
                          }

                          break;
                        }
                      }
                    }

                    var updatingChecks = [];
                    for (var i = 0; i < notiable.length; i++) {
                      if (attendance.post.author !== notiable[i]) {
                        updatingChecks.push(notiable[i]);
                      }
                    }

                    // Update Checks & Clusters
                    attendance.checkedStudents = updatingChecks;
                    attendance.clusters = clusters;
                    attendance.save(function (err) {
                      return res.send(attendance.toWholeObject());
                    });
                  });
              });
          });
      });
  },

  checkManually: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var userId = req.param('userId'),
        attendanceId = req.param('attendanceId');

    User.findOneById(userId)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, 'Manual Check Error', 'Student doesn\'t exist.'));
        }

        Attendance.findOneById(attendanceId)
          .populateAll()
          .exec(function (err, attendance) {
            if (err || !attendance) {
              return res.send(500, error.alert(req, 'Manual Check Error', 'Attendance record doesn\'t exist.'));
            }

            var hasUser = false,
                checkedStudents = [];
            for (var i = 0; i < attendance.checkedStudents.length; i++) {
              var id = attendance.checkedStudents[i];

              if (id === user.id) {
                hasUser = true;
              }

              checkedStudents.push(id);
            }

            var lateStudents = [];
            for (var i = 0; i < attendance.lateStudents.length; i++) {
              var id = attendance.lateStudents[i];
              if (id === user.id) {
                hasUser = false;
              } else {
                lateStudents.push(id);
              }
            }

            if (!hasUser) {
              checkedStudents.push(user.id);
              attendance.checkedStudents = checkedStudents;
              attendance.lateStudents = lateStudents;
              attendance.save(function (err) {
                if (err) {
                  return res.send(500, error.alert(req, 'Manual Check Error', 'Updating attendance record has failed.'));
                }

                Post.findOneById(attendance.post.id)
                  .populateAll()
                  .exec(function (err, post) {
                    if (err || !post) {
                      return res.send(500, error.alert(req, 'Manual Check Error', 'Manual attendance check failed. Please try again.'));
                    }

                    return res.send(attendance.toWholeObject());
                  });
              });
            } else {
              return res.send(attendance.toWholeObject());
            }
          });
      });
  },

  uncheckManually: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var userId = req.param('userId'),
        attendanceId = req.param('attendanceId');

    User.findOneById(userId)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, 'Manual Un-Check Error', 'Student doesn\'t exist.'));
        }

        Attendance.findOneById(attendanceId)
          .populateAll()
          .exec(function (err, attendance) {
            if (err || !attendance) {
              return res.send(500, error.alert(req, 'Manual Un-Check Error', 'Attendance record doesn\'t exist.'));
            }

            var hasUser = false,
                checkedStudents = [];
            for (var i = 0; i < attendance.checkedStudents.length; i++) {
              var id = attendance.checkedStudents[i];
              if (id === user.id) {
                hasUser = true;
              } else {
                checkedStudents.push(id);
              }
            }

            var lateStudents = [];
            for (var i = 0; i < attendance.lateStudents.length; i++) {
              var id = attendance.lateStudents[i];
              if (id === user.id) {
                hasUser = true;
              } else {
                lateStudents.push(id);
              }
            }

            if (hasUser) {
              attendance.checkedStudents = checkedStudents;
              attendance.lateStudents = lateStudents;
              attendance.save(function (err) {
                if (err) {
                  return res.send(500, error.alert(req, 'Manual Un-Check Error', 'Updating attendance record has failed.'));
                }

                Post
                .findOneById(attendance.post.id)
                .populateAll()
                .exec(function (err, post) {
                  if (err || !post) {
                    return res.send(500, error.alert(req, 'Manual Un-Check Error', 'Manual attendance un-check failed. Please try again.'));
                  }

                  return res.send(attendance.toWholeObject());
                });
              });
            } else {
              return res.send(attendance.toWholeObject());
            }
          });
      });
  },

  toggleManually: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var userId = req.param('userId'),
        attendanceId = req.param('attendanceId');

    User.findOneById(userId)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, 'Manual Check Error', 'Student doesn\'t exist.'));
        }

        Attendance.findOneById(attendanceId)
          .populateAll()
          .exec(function (err, attendance) {
            if (err || !attendance) {
              return res.send(500, error.alert(req, 'Manual Check Error', 'Attendance record doesn\'t exist.'));
            }

            var lateUser = false,
                lateStudents = [];
            for (var i = 0; i < attendance.lateStudents.length; i++) {
              var id = attendance.lateStudents[i];
              if (id === user.id) {
                lateUser = true;
              } else {
                lateStudents.push(id);
              }
            }

            var checkUser = false;
                checkedStudents = [];
            for (var i = 0; i < attendance.checkedStudents.length; i++) {
              var id = attendance.checkedStudents[i];
              if (id === user.id) {
                checkUser = true;
              } else {
                checkedStudents.push(id);
              }
            }

            // check => late
            if (checkUser) {
              lateStudents.push(user.id);
            }

            // late => uncheck (do nothing)

            // uncheck => check
            if (!checkUser && !lateUser) {
              checkedStudents.push(user.id);
            }

            attendance.checkedStudents = checkedStudents;
            attendance.lateStudents = lateStudents;
            attendance.save(function (err) {
              if (err) {
                return res.send(500, error.alert(req, 'Manual Check Error', 'Updating attendance record has failed.'));
              }

              Post.findOneById(attendance.post.id)
                .populateAll()
                .exec(function (err, post) {
                  if (err || !post) {
                    return res.send(500, error.alert(req, 'Manual Check Error', 'Manual attendance check failed. Please try again.'));
                  }

                  return res.send(attendance.toWholeObject());
                });
            });
          });
      });
  }

};
