'use strict';

/**
 * isUser
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/errors');

module.exports = function isUser (req, res, next) {

  // Params
  var email = req.param('email'),
      password = req.param('password');

  if (!email) {
    return res.send(400, error.alert(req, "User Policy Error", "Email is required."));
  }

  if (!password) {
    return res.send(400, error.alert(req, "User Policy Error", "Password is required."));
  }

  // Super Email Policy
  var emailsToCheck = [
    "apple0@apple.com", "apple1@apple.com", "apple2@apple.com",
    "apple3@apple.com", "apple4@apple.com", "apple5@apple.com",
    "apple6@apple.com", "apple7@apple.com", "apple8@apple.com",
    "apple9@apple.com"
  ];

  if (emailsToCheck.indexOf(email) !== -1) {
    return next();
  }

  User.findOneByEmail(email)
    .exec(function (err, user) {
      // Error handling
      if (err) {
        console.log(err);
        return res.send(500, error.log(req, "User Policy Error", "Error in user find method."));

      // No User found
      } else if (!user) {
        return res.send(404, error.log(req, "User Policy Error", "User doesn't exitst."));

      // Password Doesn't Match
      } else if (user.password !== password) {
        return res.send(404, error.log(req, "User Policy Error", "Password doesn't match."));

      // Found User
      } else {
        return next();
      }
    });

};
