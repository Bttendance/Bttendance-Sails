/**
 * hasDevice
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');

module.exports = function hasDevice (req, res, next) {

	// Params
	var username = req.param('username');
	var device_uuid = req.param('device_uuid');

	if (!username || !device_uuid) {
		console.log("hasDevice : Username and device uuid is required.");
		return res.send(400, Error.log("Username and device uuid is required."));
	}

	// Super Username Policy
	if (username == "appletest0"
		|| username == "appletest1"
		|| username == "appletest2"
		|| username == "appletest3"
		|| username == "appletest4"
		|| username == "appletest5"
		|| username == "appletest6"
		|| username == "appletest7"
		|| username == "appletest8"
		|| username == "appletest9")
		return next();

	// hasDevice Policy
	Users
	.findOneByUsername(username)
	.populate('device')
	.exec(function callback(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, Error.log("Error in user find method."));

	  // No User found
	  } else if (!user) {
	    return res.send(404, Error.log("User doesn't exitst."));

	  // User Device Doesn't Match
	  } else if (user.device.uuid != device_uuid) {
		  return res.send(404, Error.log("Device uuid doesn't match."));

		// Found User
	  } else {
	  	return next();
	  }
	});

};