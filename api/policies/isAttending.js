'use strict';

/**
 * isAttending
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays');

module.exports = function isAttending (req, res, next) {

  // Params
  var email = req.param('email'),
      password = req.param('password'),
      courseId = req.param('courseId');

  if (!email) {
    return res.send(400, error.log(req, "isAttending Policy Error", "Email is required."));
  }

  if (!password || !courseId) {
    return res.send(400, error.log(req, "isAttending Policy Error", "Password and Course ID is required."));
  }

  User.findOneByEmail(email)
    .populate('attendingCourses')
    .exec(function (err, user) {

      // Error handling
      if (err) {
        console.log(err);
        return res.send(500, error.log(req, "isAttending Policy Error", "Error in user find method."));

      // No User found
      } else if (!user) {
        return res.send(404, error.log(req, "isAttending Policy Error", "User doesn't exitst."));

      // Password Doesn't Match
      } else if (user.password !== password) {
        return res.send(404, error.log(req, "isAttending Policy Error", "Password doesn't match."));

      // User attending check
      } else if (Arrays.getIds(user.attendingCourses).indexOf(Number(courseId)) < 0) {
        return res.send(403, error.log(req, "isAttending Policy Error", "User is not attending current course."));

      // Found User
      } else {
        return next();
      }
    });

};
