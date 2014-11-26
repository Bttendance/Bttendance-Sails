'use strict';

/**
 * isSupervising
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays');

module.exports = function isSupervising (req, res, next) {

  // Params
  var userId = req.param('userId'),
      courseId = req.param('courseId');

  if (!userId) {
    return res.send(400, error.log(req, "isSupervising Policy Error", "User ID is required."));
  }

  if (!courseId) {
    return res.send(400, error.log(req, "isSupervising Policy Error", "Course ID is required."));
  }

  UserCourse
    .findOne({
      user: userId,
      course: courseId
    })
    .exec(function (err, userCourse) {

      if (err) {
        return res.send(500, error.log(req, "isSupervising Policy Error", "Error in UserCourse find method."));

      } else if (!userCourse
        || userCourse.state != 'supervising') {
        return res.send(403, error.log(req, "isSupervising Policy Error", "User is not supervising current course."));

      } else {
        return next();
      }
    });

};
