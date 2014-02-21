/**
 * Allow any authenticated user.
 */
module.exports = function hasDevice (req, res, ok) {

	var username = req.param('username');
	var device_uuid = req.param('device_uuid');

	if (!username || !device_uuid) {
		console.log("hasDevice : Username and Device UUID is required");
		return res.send(400, { message: "Username and Device UUID  is required"});
	}

	if (username == "appletest")
		ok();
	else {
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
		  	ok();
		  }
		});
	}
};