'use strict';

/**
 * hasCourse
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays');

module.exports = function hasCourse (req, res, next) {

  // Params
  var userId = req.param('userId'),
      courseId = req.param('courseId');

  if (!email) {
    return res.send(400, error.log(req, "hasCourse Policy Error", "Email is required."));
  }

  if (!password || !courseId) {
    return res.send(400, error.log(req, "hasCourse Policy Error", "Password and course id is required."));
  }

  UserCourse
    .findOne({
      user: userId,
      course: courseId
    })
    .exec(function (err, userCourse) {

      // Error handling
      if (err) {
        return res.send(500, error.log(req, "hasCourse Policy Error", "Error in UserCourse find method."));

      // No User found
      } else if (!userCourse) {
        return res.send(404, error.log(req, "hasCourse Policy Error", "UserCourse doesn't exitst."));

      // User attending check
      } else if (Arrays.getIds(user.attendingCourses).indexOf(Number(courseId)) < 0
        && Arrays.getIds(user.supervisingCourses).indexOf(Number(courseId)) < 0) {
        return res.send(403, error.log(req, "hasCourse Policy Error", "User is not attending or supervising current course."));

      // Found User
      } else {
        return next();
      }
    });
};
