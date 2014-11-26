'use strict';

/**
 * isEmployed
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays');

module.exports = function isEmployed (req, res, next) {

  // Params
  var userId = req.param('userId'),
      schoolId = req.param('schoolId');

  if (!userId) {
    return res.send(400, error.log(req, "isEmployed Policy Error", "User ID is required."));
  }

  if (!schoolId) {
    return res.send(400, error.log(req, "isEmployed Policy Error", "School ID is required."));
  }

  UserSchool
    .findOne({
      user: userId,
      course: schoolId
    })
    .exec(function (err, userSchool) {

      if (err) {
        return res.send(500, error.log(req, "isEmployed Policy Error", "Error in UserSchool find method."));

      } else if (!userSchool
        || userSchool.state != 'supervisor') {
        return res.send(403, error.log(req, "isEmployed Policy Error", "User is not employed current school."));

      } else {
        return next();
      }
    });

};
