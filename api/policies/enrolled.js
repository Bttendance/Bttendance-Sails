'use strict';

/**
 * Enrolled
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = function isUser (req, res, next) {

  // Params
  var email = req.param('email'),
      password = req.param('password'),
      schoolId = req.param('schoolId');

  if (!email) {
    return res.send(400, error.alert(req, "Enrolled Policy Error", "Email is required."));
  }

  if (!password || !schoolId) {
    return res.send(400, error.alert(req, "Enrolled Policy Error", "Password and School ID is required."));
  }

  User.findOneByEmail(email)
    .populate('enrolledSchools')
    .exec(function (err, user) {
      // Error handling
      if (err) {
        console.log(err);
        return res.send(500, error.log(req, "Enrolled Policy Error", "Error in user find method."));

      // No User found
      } else if (!user) {
        return res.send(404, error.log(req, "Enrolled Policy Error", "User doesn't exitst."));

      // Password Doesn't Match
      } else if (user.password !== password) {
        return res.send(404, error.log(req, "Enrolled Policy Error", "Password doesn't match."));

      // User attending check
      } else if (Arrays.getIds(user.enrolledSchools).indexOf(Number(schoolId)) < 0) {
        return res.send(403, error.log(req, "Enrolled Policy Error", "User is not enrolled current school."));

      // Found User
      } else {
        return next();
      }
    });

};
