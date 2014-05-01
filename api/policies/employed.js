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
	var password = req.param('password');
	var school_id = req.param('school_id');

	if (!username || !password || !school_id) {
		console.log("isUser : Username, password and school id is required.");
		return res.send(400, Error.log("Username, password and school id is required."));
	}

	// isUser Policy
	Users
	.findOneByUsername(username)
	.populate('employed_schools')
	.exec(function callback(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, Error.log("Error in user find method."));

	  // No User found
	  } else if (!user) {
	    return res.send(404, Error.log("User doesn't exitst."));

	  // Password Doesn't Match
	  } else if (user.password != password) {
		  return res.send(404, Error.log("Password doesn't match."));

		// User attending check
		} else if (Arrays.getIds(user.employed_schools).indexOf(Number(school_id)) < 0) {
		  return res.send(403, Error.log("User is not employed current school."));

		// Found User
	  } else {
	  	// Haven't validated for deprecated serials.
	  	return next();
	  }
	});

};