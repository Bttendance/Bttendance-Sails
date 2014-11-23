/**
 * Employed
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = function isUser (req, res, next) {

  // Params
  var email = req.param('email');
  var password = req.param('password');
  var school_id = req.param('school_id');

  if (!email)
    return res.send(400, Error.alert(req, "Employed Policy Error", "Email is required."));

  if (!password || !school_id)
    return res.send(400, Error.alert(req, "Employed Policy Error", "Password and School ID is required."));

  User
  .findOneByEmail(email)
  .populate('employed_schools')
  .exec(function (err, user) {

    // Error handling
    if (err) {
      console.log(err);
      return res.send(500, Error.log(req, "Employed Policy Error", "Error in user find method."));

    // No User found
    } else if (!user) {
      return res.send(404, Error.log(req, "Employed Policy Error", "User doesn't exitst."));

    // Password Doesn't Match
    } else if (user.password != password) {
      return res.send(404, Error.log(req, "Employed Policy Error", "Password doesn't match."));

    // User attending check
    } else if (Arrays.getIds(user.employed_schools).indexOf(Number(school_id)) < 0) {
      return res.send(403, Error.log(req, "Employed Policy Error", "User is not employed current school."));

    // Found User
    } else {
      return next();
    }
  });

};
