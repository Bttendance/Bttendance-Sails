'use strict';

/**
 * isEnrolled
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays');

module.exports = function isEnrolled (req, res, next) {

  // Params
  var userId = req.param('userId'),
      schoolId = req.param('schoolId');

  if (!userId) {
    return res.send(400, error.log(req, "isEnrolled Policy Error", "User ID is required."));
  }

  if (!schoolId) {
    return res.send(400, error.log(req, "isEnrolled Policy Error", "School ID is required."));
  }

  UserSchool
    .findOne({
      user: userId,
      course: schoolId
    })
    .exec(function (err, userSchool) {

      if (err) {
        return res.send(500, error.log(req, "isEnrolled Policy Error", "Error in UserSchool find method."));

      } else if (!userSchool
        || userSchool.state != 'student') {
        return res.send(403, error.log(req, "isEnrolled Policy Error", "User is not enrolled current school."));

      } else {
        return next();
      }
    });

};
