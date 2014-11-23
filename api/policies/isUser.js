/**
 * isUser
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');

module.exports = function isUser (req, res, next) {

  // Params
  var email = req.param('email');
  var password = req.param('password');

  if (!email)
    return res.send(400, Error.alert(req, "User Policy Error", "Email is required."));

  if (!password)
    return res.send(400, Error.alert(req, "User Policy Error", "Password is required."));

  // Super Email Policy
  if (email == "apple0@apple.com"
    || email == "apple1@apple.com"
    || email == "apple2@apple.com"
    || email == "apple3@apple.com"
    || email == "apple4@apple.com"
    || email == "apple5@apple.com"
    || email == "apple6@apple.com"
    || email == "apple7@apple.com"
    || email == "apple8@apple.com"
    || email == "apple9@apple.com")
    return next();

  User
  .findOneByEmail(email)
  .exec(function (err, user) {

    // Error handling
    if (err) {
      console.log(err);
      return res.send(500, Error.log(req, "User Policy Error", "Error in user find method."));

    // No User found
    } else if (!user) {
      return res.send(404, Error.log(req, "User Policy Error", "User doesn't exitst."));

    // Password Doesn't Match
    } else if (user.password != password) {
      return res.send(404, Error.log(req, "User Policy Error", "Password doesn't match."));

    // Found User
    } else {
      return next();
    }
  });

};
