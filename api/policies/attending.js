/**
 * Attending
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = function attending (req, res, next) {

	// Params
	var username = req.param('username');
	var email = req.param('email');
	var password = req.param('password');
	var course_id = req.param('course_id');

	if (!username && !email)
		return res.send(400, Error.log(req, "Attending Policy Error", "Username or Email is required."));

	if (!password || !course_id)
		return res.send(400, Error.log(req, "Attending Policy Error", "Password and Course ID is required."));

	User
	.findOne({
	  or : [
	    { email: email },
	    { username: username }
	  ]
	})
	.populate('attending_courses')
	.exec(function callback(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, Error.log(req, "Attending Policy Error", "Error in user find method."));

	  // No User found
	  } else if (!user) {
	    return res.send(404, Error.log(req, "Attending Policy Error", "User doesn't exitst."));

	  // Password Doesn't Match
	  } else if (user.password != password) {
		  return res.send(404, Error.log(req, "Attending Policy Error", "Password doesn't match."));

		// User attending check
		} else if (Arrays.getIds(user.attending_courses).indexOf(Number(course_id)) < 0) {
		  return res.send(403, Error.log(req, "Attending Policy Error", "User is not attending current course."));

		// Found User
	  } else {
	  	return next();
	  }
	});

};