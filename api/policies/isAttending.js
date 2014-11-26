'use strict';

/**
 * isAttending
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = function isAttending (req, res, next) {

  // Params
  var userId = req.param('userId'),
      courseId = req.param('courseId');

  if (!userId) {
    return res.send(400, error.log(req, "isAttending Policy Error", "User ID is required."));
  }

  if (!courseId) {
    return res.send(400, error.log(req, "isAttending Policy Error", "Course ID is required."));
  }

  UserCourse
    .findOne({
      user: userId,
      course: courseId
    })
    .exec(function (err, userCourse) {

      if (err) {
        return res.send(500, error.log(req, "isAttending Policy Error", "Error in UserCourse find method."));

      } else if (!userCourse
        || userCourse.state != 'attending') {
        return res.send(403, error.log(req, "isAttending Policy Error", "User is not attending current course."));

      } else {
        return next();
      }
    });

};
