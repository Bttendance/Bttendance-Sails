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
	var username = req.param('username');
	var email = req.param('email');
	var password = req.param('password');
	var school_id = req.param('school_id');

	if (!username && !email)
		return res.send(400, Error.alert(req, "Employed Policy Error", "Username or Email is required."));

	if (!password || !school_id)
		return res.send(400, Error.alert(req, "Employed Policy Error", "Password and School ID is required."));

	User
	.findOne({
	  or : [
	    { email: email },
	    { username: username }
	  ]
	})
	.populate('employed_schools')
	.exec(function callback(err, user) {

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