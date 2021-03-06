'use strict';

/**
 * SchoolsController
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

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = {

  create: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var name = req.param('name'),
        type = req.param('type');

    if (!name) {
      return res.send(400, error.alert(req, "School Create Error", "School  is required."));
    }

    if (!type) {
      return res.send(400, error.alert(req, "School Create Error", "School type is required."));
    }

    Schools.create({ name: name, type: type })
      .exec(function (err, school) {
        if (err || !school) {
          return res.send(500, error.alert(req, "School Create Error", "Fail to create a school."));
        }

        Schools.findOneById(school.id)
          .populate('courses')
          .populate('professors')
          .populate('students')
          .exec(function (err, school) {
            return res.send(school.toWholeObject());
          });
      });
  },

  all: function (req, res) {
    res.contentType('application/json; charset=utf-8');

    Schools.find()
      .populate('courses')
      .populate('professors')
      .populate('students')
      .exec(function (err, schools) {
        for (var i = 0; i < schools.length; i++) {
          schools[i] = schools[i].toWholeObject();
          // Will be Deprecated
          schools[i].website = schools[i].coursesCount + '_Courses';
        }

        return res.send(schools);
      });
  },

  courses: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var schoolId = req.param('schoolId');

    if (!schoolId) {
      return res.send(400, error.log(req, "Show All Courses Error", "School id is required."));
    }

    Schools.findOneById(schoolId)
      .populate('courses')
      .exec(function (err, school) {
        if (err || !school) {
          return res.send(500, error.log(req, "Show All Courses Error", "School doesn't exist."));
        }

        var courses = [];
        for (var i = 0; i < school.courses.length; i++) {
          courses.push(school.courses[i].id);
        }

        Course.findById(courses)
          .populateAll()
          .exec(function (err, courses) {
            if (err || !courses) {
              return res.send(JSON.stringify([]));
            }

            for (var i = 0; i < courses.length; i++) {
              courses[i] = courses[i].toWholeObject();
            }

            return res.send(courses);
          });
      });
  },

  enroll: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
        schoolId = req.param('schoolId');
        identity = req.param('identity');

    if (!identity) {
      identity  = req.param('studentId');
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Enroll School Error", "User Find Error"));
        }

        var enrolledSchools = Arrays.getIds(user.enrolledSchools);
        if (enrolledSchools.indexOf(Number(schoolId)) !== -1) {
          return res.send(user.toWholeObject());
        }

        Schools.findOneById(schoolId)
          .exec(function (err, school) {
            if (err || !school) {
              return res.send(500, error.log(req, "Enroll School Error", "School Find Error"));
            }

            Identification.create({
                identity: identity,
                school: school.id,
                owner: user.id
              }).exec(function (err, identification) {
                if (err || !identification) {
                  return res.send(500, error.log(req, "Enroll School Error", "Fail to create identity."));
                }

                user.identifications.add(identification.id);
                user.enrolledSchools.add(school.id);
                user.save(function (err) {
                  if (err) {
                    return res.send(500, error.log(req, "Enroll School Error", "Fail to save user."));
                  }

                  User.findOneByemail(email)
                    .populateAll()
                    .exec(function (err, userNew) {
                      if (err || !userNew) {
                        return res.send(500, error.log(req, "Enroll School Error", "User Find Error"));
                      }

                      return res.send(userNew.toWholeObject());
                    });
                });
              });
          });
      });
  }

};
