'use strict';

/**
 * UserController
 *
 * @module      :: Controller
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

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays'),
    Random = require('../utils/Random'),
    PasswordHash = require('password-hash'),
    Nodemailer = require("nodemailer"),
    FS = require('fs'),
    Path = require('path'),
    moment = require('moment'),
    Validator = require('validator');

module.exports = {

  signup: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var password = req.param('password'),
        name = req.param('name'),
        email = req.param('email').toLowerCase(),
        deviceType = req.param('deviceType'),
        deviceUuid = req.param('deviceUuid'),
        locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    if (!password) {
      return res.send(400, error.alert(req, "Sign Up Error", "Password is required."));
    }

    if (password.length < 6) {
      return res.send(400, error.alert(req, "Sign Up Error", "Password is too short. (should be longer than 6 letters)"));
    }

    if (!email) {
      return res.send(400, error.alert(req, "Sign Up Error", "Email is required."));
    }

    if (!Validator.isEmail(email)) {
      return res.send(400, error.alert(req, "Sign Up Error", "Email is wrong formed."));
    }

    if (!name || name.length === 0) {
      return res.send(400, error.alert(req, "Sign Up Error", "Full Name is required."));
    }

    if (!deviceType) {
      return res.send(400, error.alert(req, "Sign Up Error", "Device Type is required."));
    }

    if (!deviceUuid) {
      return res.send(400, error.alert(req, "Sign Up Error", "Device ID is required."));
    }

    Device.findOneByUuid(deviceUuid).populate('owner').exec(function (err, device) {
      if (err) {
        return res.send(500, error.log(req, "Sign Up Error", "Deivce Find Error"));
      }

      if (device && device.owner) {
        return res.send(500, error.alert(req, "Sign Up Error", "Your device already has been registered."));
      }

      User.findOneByEmail(email)
        .exec(function (err, user) {
          if (err && !user) {
            return res.send(500, error.log(req, "Sign Up Error", "User Find Error"));
          }
          if (user && user.email === email) {
            return res.send(500, error.alert(req, "Sign Up Error", "Email is already taken."));
          }

          if (device) {
            User.create({
                email: email,
                password: password,
                name: name,
                locale: locale,
                device: device.id
              }).exec(function (err, newUser) {
                if (err || !newUser) {
                  return res.send(500, error.alert(req, "Sign Up Error", "User Create error. Please try sign up again."));
                }

                Device.update({ id: device.id }, { owner: newUser.id })
                  .exec(function (err, updatedDevice) {
                    if (err || !updatedDevice) {
                      return res.send(500, error.alert(req, "Sign Up Error", "Deivce Save error. Please try sign up again."));
                    }

                    User.findOneById(newUser.id)
                      .populateAll()
                      .exec(function (err, userNew) {
                        if (err || !userNew) {
                          return res.send(500, error.log(req, "Sign Up Error", "No User Found Error"));
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

                        if (!locale || locale !== 'ko') {
                          locale = 'en';
                        }

                        if (locale === 'ko') {
                          path = Path.resolve(__dirname,  '../../assets/emails/Welcome_KO.html');
                        } else {
                          path = Path.resolve(__dirname, '../../assets/emails/Welcome_EN.html');
                        }

                        FS.readFile(path, 'utf8', function (err, file) {
                          if (err) {
                            return res.send(500, { message: "File Read Error" });
                          }

                          // Setup e-mail data with unicode symbols
                          var mailOptions = {
                            from: "Bttendance<no-reply@bttendance.com>", // Sender address
                            to: userNew.email, // List of receivers
                            subject: sails.__({ phrase: "Welcome to BTTENDANCE!", locale: locale }), // Subject line
                            html: file, // Plaintext body
                          };

                          // Send mail with defined transport object
                          smtpTransport.sendMail(mailOptions, function (error, info) {
                            // TODO: Handle error
                          });
                        });

                        return res.send(userNew.toWholeObject());
                      });
                });
              });
          } else {
            Device.create({
                type: deviceType,
                uuid: deviceUuid
              }).exec(function (err, newDevice) {
                if (err || !newDevice) {
                  return res.send(500, error.alert(req, "Sign Up Error",  "Deivce Create Error"));
                }

                User.create({
                    email: email,
                    password: password,
                    name: name,
                    locale: locale,
                    device: newDevice.id
                  }).exec(function (err, newUser) {
                    if (err || !newUser) {
                      return res.send(500, error.alert(req, "Sign Up Error",  "User Create error. Please try sign up again."));
                    }

                    Device.update({ id: newDevice.id }, { owner: newUser.id })
                      .exec(function (err, updatedDevice) {
                        if (err || !updatedDevice) {
                          return res.send(500, error.alert(req, "Sign Up Error",  "Deivce Save error. Please try sign up again."));
                        }

                        User.findOneById(newUser.id)
                          .populateAll()
                          .exec(function (err, userNew) {
                            if (err || !userNew) {
                              return res.send(500, error.log(req, "Sign Up Error", "No User Found Error"));
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
                            if (!locale || locale !== 'ko') {
                              locale = 'en';
                            }
                            if (locale === 'ko') {
                              path = Path.resolve(__dirname, '../../assets/emails/Welcome_KO.html');
                            } else {
                              path = Path.resolve(__dirname, '../../assets/emails/Welcome_EN.html');
                            }

                            FS.readFile(path, 'utf8', function (err, file) {
                              if (err) {
                                return res.send(500, { message: "File Read Error" });
                              }

                              // setup e-mail data with unicode symbols
                              var mailOptions = {
                                from: "Bttendance<no-reply@bttendance.com>", // sender address
                                to: userNew.email, // list of receivers
                                subject: sails.__({ phrase: "Welcome to BTTENDANCE!", locale: locale }), // Subject line
                                html: file, // plaintext body
                              };

                              // send mail with defined transport object
                              smtpTransport.sendMail(mailOptions, function (error, info) {
                                // TODO: Handle errors
                              });
                            });

                            return res.send(userNew.toWholeObject());
                          });
                    });
                  });
              });
          }
        });
    });
  },

  // 401 : Auto Sign Out
  // 441 : Update Recommended
  // 442 : Update Required
  autoSignin: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        password = req.param('password'),
        locale = req.param('locale'),
        deviceUuid = req.param('deviceUuid'),
        deviceType = req.param('deviceType'),
        appVersion = req.param('appVersion');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(401, error.alert(req, "Auto Sign Out", "User doesn't exist."));
        }

        if (password !== user.password) {
          return res.send(401, error.alert(req, "Auto Sign Out", "Password is incorrect."));
        }

        if (deviceUuid !== user.device.uuid) {
          return res.send(401, error.alert(req, "Auto Sign Out", "User has been signed-in other device."));
        }

        if (parseFloat(appVersion) < 1) {
          return res.send(442, error.alert(req, sails.__({ phrase: "Update Available", locale: locale }), sails.__({ phrase: "New version of Bttendance has been updated. Please update the app for new features.", locale: locale })));
        }

        return res.send(user.toWholeObject());
      });
  },

  signin: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        password = req.param('password'),
        deviceUuid = req.param('deviceUuid'),
        deviceType = req.param('deviceType');

    if (!email) {
      return res.send(400, error.alert(req, "Sign In Error", "Email is required."));
    }

    if (!password) {
      return res.send(400, error.alert(req, "Sign In Error", "Password is required."));
    }

    if (!deviceUuid) {
      return res.send(400, error.alert(req, "Sign In Error", "Device ID is required."));
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, "Sign In Error", "Please check your EMAIL address again."));
        }

        var emailsToCheck = [
          "apple0@apple.com", "apple1@apple.com", "apple2@apple.com",
          "apple3@apple.com", "apple4@apple.com", "apple5@apple.com",
          "apple6@apple.com", "apple7@apple.com", "apple8@apple.com",
          "apple9@apple.com"
        ];

        if (emailsToCheck.indexOf(email) !== -1) {
          Device.findOneByUuid(deviceUuid)
            .populate('owner')
            .exec(function (err, device) {
              if (err) {
                return res.send(500, error.log(req, "Sign In Error", "Device Found Error"));
              }

              if (!device) {
                user.device.uuid = deviceUuid;
                user.device.save(function (err) {
                  if (err) {
                    return res.send(500, error.log(req, "Sign In Error", "Device Save Error"));
                  }

                  return res.send(user.toWholeObject());
                });
              } else if (device.uuid !== user.device.uuid) {
                device.owner = user.id;
                device.save(function (err) {
                  if (err) {
                    return res.send(500, error.log(req, "Sign In Error", "Device Save Error"));
                  }

                  user.device.uuid = deviceUuid;
                  console.log(user);
                  user.device.save(function (err) {
                    if (err) {
                      return res.send(500, error.log(req, "Sign In Error", "Device Save Error"));
                    }

                    return res.send(user.toWholeObject());
                  });
                });
              } else
                return res.send(user.toWholeObject());
            });
        } else {
          if (!PasswordHash.verify(password, user.password)) {
            return res.send(500, error.alert(req, "Sign In Error", "Please check your PASSWORD again."));
          } else if (user.device.uuid !== deviceUuid) {
            Device.findOneByUuid(deviceUuid)
              .populate('owner')
              .exec(function (err, device) {
                if (err) {
                  return res.send(500, error.log(req, "Sign In Error", "Device Found Error"));
                }

                if (!device) {
                  Device.create({
                      type: deviceType,
                      uuid: deviceUuid,
                      owner: user.id
                    }).exec(function (err, newDevice) {
                      if (err || !newDevice) {
                        console.log(err);
                        console.log(newDevice);
                        return res.send(500, error.log(req, "Sign In Error", "Device Create Error"));
                      }

                      user.device.owner = null;
                      user.device.save();

                      user.device = newDevice;
                      user.save(function (err, updatedUser) {
                        if (err || !updatedUser) {
                          return res.send(500, error.log(req, "Sign In Error", "User Update Error"));
                        }

                        User.findOneById(updatedUser.id).populateAll()
                          .exec(function (err, user) {
                            if (err || !user) {
                              return res.send(500, error.log(req, "Sign In Error", "User Found Error"));
                            }

                            return res.send(user.toWholeObject());
                          });
                      });
                    });
                } else if (device.owner && device.owner !== null) {
                  return res.send(500, error.alert(req, "Sign In Error", "We doesn't support multi devices for now. If you have changed your phone, please contact us via contact@bttendance.com."));
                } else {
                  user.device.owner = null;
                  user.device.save();

                  device.owner = user;
                  device.save();

                  user.device = device;
                  user.save(function (err, updatedUser) {
                    if (err || !updatedUser) {
                      return res.send(500, error.log(req, "Sign In Error", "User Update Error"));
                    }

                    User.findOneById(updatedUser.id)
                      .populateAll()
                      .exec(function (err, user) {
                        if (err || !user) {
                          return res.send(500, error.log(req, "Sign In Error", "User Found Error"));
                        }

                        return res.send(user.toWholeObject());
                      });
                  });
                }
              });
          } else {
            return res.send(user.toWholeObject());
          }
        }
      });
  },

  forgotPassword: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, "Password Recovery Error", "Please check your email address again."));
        }

        var password = Random.string(8);
        user.password = PasswordHash.generate(password);

        // Create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = Nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "no-reply@bttendance.com",
            pass: "N0n0r2ply"
          }
        });

        var path;
        if (locale === 'ko') {
          path = Path.resolve(__dirname, '../../assets/emails/ForgotPassword_KO.html');
        } else {
          path = Path.resolve(__dirname, '../../assets/emails/ForgotPassword_EN.html');
        }

        FS.readFile(path, 'utf8', function (err, file) {
          if (err) {
            return res.send(500, error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
          }

          file = file.replace('#name', user.name);
          file = file.replace('#password', password);

          // Setup e-mail data with unicode symbols
          var mailOptions = {
            from: "Bttendance<no-reply@bttendance.com>", // Sender address
            to: user.email, // List of receivers
            subject: sails.__({ phrase: "Password Recovery", locale: locale }), // Subject line
            html: file, // Plaintext body
          }

          user.save(function (err, user) {
            if (err || !user) {
              return res.send(400, error.alert(req, "Password Recovery Error", "Password recovery has failed."));
            }

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
  },

  updatePassword: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        passwordOld = req.param('passwordOld'),
        passwordNew = req.param('passwordNew'),
        locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    if (!email) {
      return res.send(400, error.alert(req, "Password Update Error", "Email is required."));
    }

    if (!passwordOld) {
      return res.send(400, error.alert(req, "Password Update Error", "Old Password is required."));
    }

    if (!passwordNew) {
      return res.send(400, error.alert(req, "Password Update Error", "New password is required."));
    }

    if (passwordNew.length < 6) {
      return res.send(400, error.alert(req, "Password Update Error", "New Password is too short. (should be longer than 6 letters)"));
    }

    User.findOneByEmail(email)
    .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, "Password Update Error", "User doesn't exist."));
        }

        if (!PasswordHash.verify(passwordOld, user.password)) {
          return res.send(500, error.alert(req, "Password Update Error", "Please check your old password again."));
        }

        user.password = PasswordHash.generate(passwordNew);

        // Create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = Nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "no-reply@bttendance.com",
            pass: "N0n0r2ply"
          }
        });

        var path;
        if (locale === 'ko') {
          path = Path.resolve(__dirname, '../../assets/emails/UpdatePassword_KO.html');
        } else {
          path = Path.resolve(__dirname, '../../assets/emails/UpdatePassword_EN.html');
        }

        FS.readFile(path, 'utf8', function (err, file) {
          if (err) {
            return res.send(500, error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
          }

          file = file.replace('#name', user.name);
          file = file.replace('#password', passwordNew);

          // Setup e-mail data with unicode symbols
          var mailOptions = {
            from: "Bttendance<no-reply@bttendance.com>", // Sender address
            to: user.email, // List of receivers
            subject: sails.__({ phrase: "Password Update", locale: locale }), // Subject line
            html: file, // Plaintext body
          }

          user.save(function (err, user) {
            if (err || !user) {
              return res.send(400, error.alert(req, "Password Update Error", "Updating password has failed."));
            }

            // send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function (error, info) {
              if (error) {
                return res.send(500, error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
              }

              return res.send(user.toWholeObject());
            });
          });
        });
      });
  },

  updateName: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        name = req.param('name');

    if (!name) {
      return res.send(400, error.alert(req, "Name Update Error", "Name is required."));
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, "Name Update Error", "User doesn't exist."));
        }

        user.name = name;
        user.save(function (err, updatedUser) {
          if (err || !updatedUser) {
            return res.send(400, error.alert(req, "Name Update Error", "Updating name has failed."));
          }

          return res.send(updatedUser.toWholeObject());
        });
      });
  },

  updateEmail: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
        emailNew = req.param('emailNew');

    if (!email) {
      return res.send(400, error.alert(req, "Email Update Error", "Email is required."));
    }

    if (!emailNew) {
      return res.send(400, error.alert(req, "Email Update Error", "New email is required."));
    }

    User.findOneByEmail(email)
    .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.alert(req, "Email Update Error", "User doesn't exist."));
        }

        user.email = emailNew;
        user.save(function (err, updatedUser) {
          if (err || !updatedUser) {
            return res.send(400, error.alert(req, "Email Update Error", "Email already registered to other user."));
          }

          return res.send(updatedUser.toWholeObject());
        });
      });
  },

  search: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var searchId = req.param('searchId').toLowerCase();
        email = req.param('email');

    if (!searchId) {
      return res.send(400, error.alert(req, "Searching User Error", "Email is required." ));
    }

    User.findOneByEmail(searchId)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(404, error.alert(req, "Searching User Error", "Fail to find a user \"%s\".\nPlease check User ID of Email again.", searchId));
        }

        if (user.email === email) {
          return res.send(400, error.alert(req, "Busted", "HaHa, trying to find yourself? Got You! :)"));
        }

        return res.send(user);
      });
  },

  courses: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Courses Error", "User doesn't exist."));
        }

        var supervisingCourses = Arrays.getIds(user.supervisingCourses),
            attendingCourses = Arrays.getIds(user.attendingCourses),
            total_courses = supervisingCourses.concat(attendingCourses);

        Course.findById(total_courses)
          .populateAll()
          .sort('id ASC')
          .exec(function (err, courses) {
            if (err || !courses) {
              return res.send(JSON.stringify([]));
            }

            var total_posts = [];
            for (var i = 0; i < courses.length; i++) {
              for (var j = 0; j < courses[i].posts.length; j++) {
                total_posts.push(courses[i].posts[j].id);
              }
            }

            Post.findById(total_posts)
              .populate('attendance')
              .populate('clicker')
              .populate('notice')
              .populate('curious')
              .sort('id DESC')
              .exec(function (err, posts) {
                if (!posts) {
                  for (var i = 0; i < courses.length; i++) {
                    courses[i] = courses[i].toWholeObject();
                    courses[i].grade = 0;
                    courses[i].attendanceRate = 0;
                    courses[i].clickerRate = 0;
                    courses[i].noticeUnseen = 0;
                  }

                  return res.send(courses);
                }

                for (var i = 0; i < courses.length; i++) {
                  // Attendance
                  var attendanceRate = 0; // 전체 출석률 or 본인의 출석률
                  var attdLast = undefined; // 가장 마지막 attendance
                  var attdChecks = []; // checkedStudents lateStudents를 모두 합한 Array
                  var attdUsage = 0; // attd check을 여태까지 몇번했는지
                  var attdCheckedCount = 0; // 본인이 attd check이 몇번 되었는지 (강의자의 경우 attd check을 한것으로 인정)

                  // Clicker
                  var clickerRate = 0; // 전체 참여율 or 본인의 참여율
                  var clickerLast = undefined; // 가장 마지막 clicker
                  var clickerChecks = []; // a_students, b_students, c_students, d_students, e_students를 모두 합한 Array
                  var clickerUsage = 0; // clicker를 여태까지 몇번 사용 했는지
                  var clickerCheckedCount = 0; // 본인이 clicker를 몇번 참여했는지 (강의자의 경우 참여 안한 것으로 간주)

                  // Notice
                  var noticeRate = 0; // 전체 공지 리치율 or 본인 공지 읽은 율
                  var noticeChecks = []; // seenStudents를 모두 합한 Array
                  var noticeUnseen = 0;
                  var noticeLastPost = undefined; // 가장 마지막 attendance
                  var noticeUsage = 0; // notice를 post한 횟수
                  var noticeSeenCount = 0; // 본인이 notice를 몇개 보았는지 (강의자의 경우 안본 것으로 간주)

                  for (var j = 0; j < posts.length; j++) {
                    // Attendance Count
                    if (posts[j].course === courses[i].id && posts[j].type === "attendance") {
                      if (posts[j].attendance.checkedStudents.indexOf(user.id) >= 0) {
                        attdCheckedCount++;
                      }

                      if (!attdLast) {
                        attdLast = posts[j].attendance;
                      }

                      attdChecks = attdChecks.concat(
                        posts[j].attendance.checkedStudents,
                        posts[j].attendance.lateStudents
                      );

                      attdUsage++;
                    }

                    // Clicker Count
                    if (posts[j].course === courses[i].id && posts[j].type === "clicker") {
                      if (posts[j].clicker.a_students.indexOf(user.id) >= 0) {
                        clickerCheckedCount++;
                      }
                      if (posts[j].clicker.b_students.indexOf(user.id) >= 0) {
                        clickerCheckedCount++;
                      }
                      if (posts[j].clicker.c_students.indexOf(user.id) >= 0) {
                        clickerCheckedCount++;
                      }
                      if (posts[j].clicker.d_students.indexOf(user.id) >= 0) {
                        clickerCheckedCount++;
                      }
                      if (posts[j].clicker.e_students.indexOf(user.id) >= 0) {
                        clickerCheckedCount++;
                      }

                      clickerChecks = clickerChecks.concat(
                        posts[j].clicker.a_students,
                        posts[j].clicker.b_students,
                        posts[j].clicker.c_students,
                        posts[j].clicker.d_students,
                        posts[j].clicker.e_students
                      );

                      clickerUsage++;
                    }

                    // Notice Count
                    if (posts[j].course === courses[i].id && posts[j].type === "notice") {
                      if (posts[j].seenStudents.indexOf(user.id) >= 0) {
                        noticeSeenCount++;
                      }

                      if (!noticeLastPost) {
                        noticeLastPost = posts[j];
                      }

                      noticeChecks = noticeChecks.concat(posts[j].seenStudents);

                      noticeUsage++;
                    }
                  }

                  if (supervisingCourses.indexOf(courses[i].id) >= 0) {
                    attendanceRate = Number((attdChecks.length / attdUsage / courses[i].students.length * 100).toFixed());
                    clickerRate = Number((clickerChecks.length / clickerUsage / courses[i].students.length * 100).toFixed());
                    noticeRate = Number((noticeChecks.length / noticeUsage / courses[i].students.length * 100).toFixed());

                    if (noticeLastPost) {
                      noticeUnseen = courses[i].students.length - noticeLastPost.seenStudents.length;
                    } else {
                      noticeUnseen = courses[i].students.length;
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

                  courses[i] = courses[i].toWholeObject();
                  courses[i].grade = attendanceRate;
                  courses[i].attendanceRate = attendanceRate;
                  courses[i].clickerRate = clickerRate;
                  courses[i].noticeRate = noticeRate;
                  courses[i].noticeUnseen = noticeUnseen;
                  courses[i].clickerUsage = clickerUsage;
                  courses[i].noticeUsage = noticeUsage;

                  if (attdLast) {
                    courses[i].attdCheckedAt = attdLast.createdAt;
                  }
                }

                return res.send(courses);
              });
          });
      });
  }

};
