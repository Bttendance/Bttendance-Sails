/**
 * hasDevice
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */
module.exports = function hasDevice (req, res, next) {

	// Super Port Policy
	if (req.port == 7331) 
		return next();

	// Super Username Policy
	var username = req.param('username');
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
	var username = req.param('username');
	var device_uuid = req.param('device_uuid');

	if (!username || !device_uuid) {
		console.log("hasDevice : Username and Device UUID is required");
		return res.send(400, { message: "Username and Device UUID  is required"});
	}

	User.findOne({
		username: username
	}).done(function(err, user) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { message: "User Find Error" });

	  // No User found
	  } else if (!user) {
	    return res.send(404, { message: "No User Found Error" });

	  // User Device Doesn't Match
	  } else if (user.device_uuid != device_uuid) {
	    return res.send(401, { message: "Device UUID doesn't match Error" });

		// Found User
	  } else {
    	console.log("User found : " + user);
	  	return next();
	  }
	});

};